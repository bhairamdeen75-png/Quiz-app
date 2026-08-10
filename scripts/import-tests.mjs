#!/usr/bin/env node
/**
 * data/<exam-slug>/<testN>.json → Supabase me import
 * Idempotent: kitni baar bhi chalao, duplicate kabhi nahi banega
 * (deterministic UUID + text-based lookup)
 */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import { createClient } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error('❌ SUPABASE_URL aur SUPABASE_SERVICE_ROLE_KEY env vars chahiye');
  process.exit(1);
}

const supabase = createClient(URL, KEY, { auth: { persistSession: false } });
const DATA_DIR = join(process.cwd(), 'data');
const NAMESPACE = 'quizapp-hindi-tests-v1';
const DIFFS = ['easy', 'medium', 'hard'];

// Same content → same ID (isi se duplicate kabhi nahi banta)
function detId(...parts) {
  const hash = createHash('sha256').update(NAMESPACE + '|' + parts.join('|')).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const h = hash.subarray(0, 16).toString('hex');
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}

const stats = { exams: 0, subjects: 0, chapters: 0, questions: 0, series: 0, mappings: 0 };

async function main() {
  const examDirs = readdirSync(DATA_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'));

  if (examDirs.length === 0) { console.log('⚠️ data/ folder me koi exam folder nahi mila'); return; }

  // Existing data ek baar load karo (lookup ke liye — isse duplicate nahi bante)
  const { data: existingExams } = await supabase.from('exams').select('*');
  const examsBySlug = new Map((existingExams ?? []).map((e) => [e.slug, e]));
  const { data: allSubjects } = await supabase.from('subjects').select('*');
  const subjectsByKey = new Map((allSubjects ?? []).map((s) => [`${s.exam_id}:${s.name}`, s]));
  const { data: allChapters } = await supabase.from('chapters').select('*');
  const chaptersByKey = new Map((allChapters ?? []).map((c) => [`${c.subject_id}:${c.name}`, c]));
  const { data: allQuestions } = await supabase.from('questions').select('*');
  const questionsByKey = new Map((allQuestions ?? []).map((q) => [`${q.exam_id}:${q.question_text}`, q]));
  const { data: allSeries } = await supabase.from('test_series').select('*');
  const seriesByKey = new Map((allSeries ?? []).map((s) => [`${s.exam_id}:${s.name}`, s]));

  for (const dir of examDirs) {
    const slug = dir.name;
    const files = readdirSync(join(DATA_DIR, slug)).filter((f) => f.endsWith('.json'));
    if (files.length === 0) { console.log(`ℹ️ ${slug}: koi .json file nahi`); continue; }
    console.log(`\n📂 Exam: ${slug} (${files.length} file)`);

    for (const file of files) {
      const raw = JSON.parse(readFileSync(join(DATA_DIR, slug, file), 'utf8'));
      console.log(`  📄 ${file}: ${raw.name}`);

      // 1) EXAM — slug se dhoondo, nahi mila to auto-create
      let exam = examsBySlug.get(slug);
      if (!exam) {
        exam = {
          id: detId('exam', slug),
          slug,
          name: raw.examName ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          description: raw.examDescription ?? null,
          icon: raw.examIcon ?? '📝',
        };
        const { error } = await supabase.from('exams').insert(exam);
        if (error) { console.error(`    ❌ exam: ${error.message}`); continue; }
        stats.exams++;
      }

      // 2) SUBJECT
      const subjectName = (raw.subject ?? '').trim();
      if (!subjectName) { console.error(`    ❌ "${file}" me "subject" field missing`); continue; }
      let subject = subjectsByKey.get(`${exam.id}:${subjectName}`);
      if (!subject) {
        subject = { id: detId('subject', exam.id, subjectName), exam_id: exam.id, name: subjectName, order_no: 0 };
        const { error } = await supabase.from('subjects').insert(subject);
        if (error) { console.error(`    ❌ subject: ${error.message}`); continue; }
        subjectsByKey.set(`${exam.id}:${subjectName}`, subject);
        stats.subjects++;
      }

      // 3) CHAPTERS + QUESTIONS
      const rows = [];
      for (const q of raw.questions ?? []) {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          console.error(`    ⚠️ skip question (options invalid): ${q.question?.slice(0, 40)}...`); continue;
        }
        if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
          console.error(`    ⚠️ skip question (correctIndex invalid): ${q.question?.slice(0, 40)}...`); continue;
        }
        const chapterName = (q.chapter ?? '').trim();
        let chapterId = null;
        if (chapterName) {
          let chapter = chaptersByKey.get(`${subject.id}:${chapterName}`);
          if (!chapter) {
            chapter = { id: detId('chapter', subject.id, chapterName), subject_id: subject.id, name: chapterName, order_no: 0 };
            const { error } = await supabase.from('chapters').insert(chapter);
            if (error) { console.error(`    ❌ chapter: ${error.message}`); continue; }
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
          const { error } = await supabase.from('questions').update({
            options: row.options, correct_index: row.correct_index,
            hint: row.hint, explanation: row.explanation,
            difficulty: row.difficulty, chapter_id: row.chapter_id,
          }).eq('id', existing.id);
          if (error) console.error(`    ⚠️ question update: ${error.message}`);
          else stats.questions++;
        } else {
          const { error } = await supabase.from('questions').insert(row);
          if (error) console.error(`    ❌ question insert: ${error.message}`);
          else { questionsByKey.set(`${exam.id}:${row.question_text}`, row); stats.questions++; }
        }
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
        const { error } = await supabase.from('test_series').update(seriesData).eq('id', series.id);
        if (error) console.error(`    ❌ series update: ${error.message}`);
        else stats.series++;
      } else {
        series = { id: detId('series', exam.id, raw.name), exam_id: exam.id, name: raw.name, ...seriesData };
        const { error } = await supabase.from('test_series').insert(series);
        if (error) { console.error(`    ❌ series insert: ${error.message}`); continue; }
        seriesByKey.set(seriesKey, series);
        stats.series++;
      }

      // 5) SERIES ↔ QUESTIONS MAPPING (on conflict = duplicate nahi hoga)
      const finalMappings = rows.map((r) => {
        const existing = questionsByKey.get(`${exam.id}:${r.question_text}`);
        return { test_series_id: series.id, question_id: existing ? existing.id : r.id };
      });
      if (finalMappings.length) {
        const { error } = await supabase.from('test_series_questions')
          .upsert(finalMappings, { onConflict: 'test_series_id,question_id' });
        if (error) console.error(`    ❌ mapping: ${error.message}`);
        else stats.mappings += finalMappings.length;
      }
    }
  }

  console.log(`\n✅ Import complete: ${stats.exams} exams · ${stats.subjects} subjects · ${stats.chapters} chapters · ${stats.questions} questions · ${stats.series} series · ${stats.mappings} mappings`);
}

main().catch((e) => { console.error('❌', e); process.exit(1); });
