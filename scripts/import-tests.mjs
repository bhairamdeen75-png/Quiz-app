#!/usr/bin/env node
/**
 * data/<exam-slug>/<testN>.json → Supabase me import
 * ZERO-DEPENDENCY version — sirf Node 18+ ka built-in fetch
 *
 * ✅ DONO FORMATS SUPPORT:
 *    Format 1 (single object): { "name": "...", "subject": "...", "questions": [...] }
 *    Format 2 (array):         [ { "name": "...", ... }, { "name": "...", ... } ]
 *
 * Idempotent: bar-bar chalao, duplicate kabhi nahi banega.
 */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error('❌ SUPABASE_URL aur SUPABASE_SERVICE_ROLE_KEY env vars chahiye');
  process.exit(1);
}

const BASE = `${URL.replace(/\/+$/, '')}/rest/v1`;
const H = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};
const JH = { ...H, Prefer: 'return=representation' };

const DATA_DIR = join(process.cwd(), 'data');
const NAMESPACE = 'quizapp-hindi-tests-v1';
const DIFFS = ['easy', 'medium', 'hard'];

// Same content → same UUID (duplicate kabhi nahi banta)
function detId(...parts) {
  const hash = createHash('sha256').update(NAMESPACE + '|' + parts.join('|')).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const h = hash.subarray(0, 16).toString('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// Saari rows (1000 ke chunks me)
async function getAll(table) {
  const out = [];
  let from = 0;
  for (;;) {
    const res = await fetch(`${BASE}/${table}?select=*`, {
      headers: { ...H, Range: `${from}-${from + 999}` },
    });
    if (!res.ok) throw new Error(`GET ${table}: ${res.status} ${await res.text()}`);
    const rows = await res.json();
    out.push(...rows);
    if (rows.length < 1000) break;
    from += 1000;
  }
  return out;
}

// Upsert: same id pe merge (update), warna insert
async function upsert(table, rows, onConflict) {
  const arr = Array.isArray(rows) ? rows : [rows];
  if (!arr.length) return [];
  const qs = onConflict ? `?on_conflict=${onConflict}` : '';
  const res = await fetch(`${BASE}/${table}${qs}`, {
    method: 'POST',
    headers: { ...JH, Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(arr),
  });
  if (!res.ok) throw new Error(`POST ${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

// Update by id
async function patch(table, id, data) {
  const res = await fetch(`${BASE}/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: JH,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PATCH ${table}: ${res.status} ${await res.text()}`);
}

const stats = { exams: 0, subjects: 0, chapters: 0, questions: 0, series: 0, mappings: 0 };

async function main() {
  const examDirs = readdirSync(DATA_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'));
  if (!examDirs.length) { console.log('⚠️ data/ me koi exam folder nahi'); return; }

  // Ek baar sab load karo (lookup ke liye — isi se duplicates nahi bante)
  const examsBySlug = new Map((await getAll('exams')).map((e) => [e.slug, e]));
  const subjectsByKey = new Map((await getAll('subjects')).map((s) => [`${s.exam_id}:${s.name}`, s]));
  const chaptersByKey = new Map((await getAll('chapters')).map((c) => [`${c.subject_id}:${c.name}`, c]));
  const questionsByKey = new Map((await getAll('questions')).map((q) => [`${q.exam_id}:${q.question_text}`, q]));
  const seriesByKey = new Map((await getAll('test_series')).map((s) => [`${s.exam_id}:${s.name}`, s]));

  for (const dir of examDirs) {
    const slug = dir.name;
    const files = readdirSync(join(DATA_DIR, slug)).filter((f) => f.endsWith('.json'));
    if (!files.length) { console.log(`ℹ️ ${slug}: koi .json file nahi`); continue; }
    console.log(`\n📂 Exam: ${slug} (${files.length} file)`);

    for (const file of files) {
      // JSON parse — error ho to file skip karke aage badho
      let parsed;
      try {
        parsed = JSON.parse(readFileSync(join(DATA_DIR, slug, file), 'utf8'));
      } catch (e) {
        console.error(`    ❌ "${file}" me JSON parse error: ${e.message}`);
        continue;
      }

      // ✅ ARRAY FORMAT BHI SUPPORT — ek file me ek se zyada tests
      const tests = Array.isArray(parsed) ? parsed : [parsed];
      console.log(`  📄 ${file}: ${tests.length} test(s)`);

      for (const raw of tests) {
        if (!raw || typeof raw !== 'object' || !raw.name) {
          console.error(`    ⚠️ Ek test object me "name" missing hai — skip`);
          continue;
        }
        console.log(`    ▶ ${raw.name}`);

        // 1) EXAM — slug se dhoondo, nahi mila to create
        let exam = examsBySlug.get(slug);
        if (!exam) {
          exam = {
            id: detId('exam', slug),
            slug,
            name: raw.examName ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            description: raw.examDescription ?? null,
            icon: raw.examIcon ?? '📝',
          };
          await upsert('exams', exam, 'id');
          examsBySlug.set(slug, exam);
          stats.exams++;
        }

        // 2) SUBJECT
        const subjectName = (raw.subject ?? '').trim();
        if (!subjectName) { console.error(`    ❌ "${raw.name}" me "subject" field missing — skip`); continue; }
        let subject = subjectsByKey.get(`${exam.id}:${subjectName}`);
        if (!subject) {
          subject = { id: detId('subject', exam.id, subjectName), exam_id: exam.id, name: subjectName, order_no: 0 };
          await upsert('subjects', subject, 'id');
          subjectsByKey.set(`${exam.id}:${subjectName}`, subject);
          stats.subjects++;
        }

        // 3) CHAPTERS + QUESTIONS
        const rows = [];
        for (const q of raw.questions ?? []) {
          if (!Array.isArray(q.options) || q.options.length < 2) {
            console.error(`    ⚠️ skip (options invalid): ${String(q.question ?? '').slice(0, 40)}...`); continue;
          }
          if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
            console.error(`    ⚠️ skip (correctIndex invalid): ${String(q.question ?? '').slice(0, 40)}...`); continue;
          }
          const chapterName = (q.chapter ?? '').trim();
          let chapterId = null;
          if (chapterName) {
            let chapter = chaptersByKey.get(`${subject.id}:${chapterName}`);
            if (!chapter) {
              chapter = { id: detId('chapter', subject.id, chapterName), subject_id: subject.id, name: chapterName, order_no: 0 };
              await upsert('chapters', chapter, 'id');
              chaptersByKey.set(`${subject.id}:${chapterName}`, chapter);
              stats.chapters++;
            }
            chapterId = chapter.id;
          }
          rows.push({
            id: detId('question', exam.id, q.question),
            exam_id: exam.id,
            subject_id: subject.id,
            chapter_id: chapterId,
            question_text: q.question,
            options: q.options,
            correct_index: q.correctIndex,
            hint: q.hint ?? null,
            explanation: q.explanation ?? null,
            difficulty: DIFFS.includes(q.difficulty) ? q.difficulty : DIFFS.includes(raw.difficulty) ? raw.difficulty : 'medium',
            source: 'preloaded',
            is_approved: true,
          });
        }

        for (const row of rows) {
          const existing = questionsByKey.get(`${exam.id}:${row.question_text}`);
          if (existing) {
            await patch('questions', existing.id, {
              options: row.options, correct_index: row.correct_index,
              hint: row.hint, explanation: row.explanation,
              difficulty: row.difficulty, chapter_id: row.chapter_id,
            });
          } else {
            await upsert('questions', row, 'id');
            questionsByKey.set(`${exam.id}:${row.question_text}`, row);
          }
          stats.questions++;
        }

        // 4) TEST SERIES
        const seriesKey = `${exam.id}:${raw.name}`;
        const seriesData = {
          subject_id: subject.id,
          description: raw.description ?? null,
          question_count: rows.length,
          duration_minutes: raw.duration_minutes ?? Math.ceil(rows.length * 1.5),
          difficulty: DIFFS.includes(raw.difficulty) ? raw.difficulty : 'medium',
        };
        let series = seriesByKey.get(seriesKey);
        if (series) {
          await patch('test_series', series.id, seriesData);
          stats.series++;
        } else {
          series = { id: detId('series', exam.id, raw.name), exam_id: exam.id, name: raw.name, ...seriesData };
          await upsert('test_series', series, 'id');
          seriesByKey.set(seriesKey, series);
          stats.series++;
        }

        // 5) SERIES ↔ QUESTIONS MAPPING (composite PK pe upsert)
        const finalMappings = rows.map((r) => {
          const existing = questionsByKey.get(`${exam.id}:${r.question_text}`);
          return { test_series_id: series.id, question_id: existing ? existing.id : r.id };
        });
        if (finalMappings.length) {
          await upsert('test_series_questions', finalMappings, 'test_series_id,question_id');
          stats.mappings += finalMappings.length;
        }
      }
    }
  }

  console.log(`\n✅ Import complete: ${stats.exams} exams · ${stats.subjects} subjects · ${stats.chapters} chapters · ${stats.questions} questions · ${stats.series} series · ${stats.mappings} mappings`);
}

main().catch((e) => { console.error('❌', e.message || e); process.exit(1); });
