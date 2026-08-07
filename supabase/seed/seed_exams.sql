-- ============ 10 EXAMS ============
insert into exams (slug, name, description, icon) values
('jee-main',   'JEE Main',      'Engineering entrance — Physics, Chemistry, Maths', '🧪'),
('neet',       'NEET',          'Medical entrance — Physics, Chemistry, Biology',   '🩺'),
('ssc-cgl',    'SSC CGL',       'Staff Selection Commission — Graduate Level',       '🏛️'),
('upsc-prelims','UPSC Prelims', 'Civil Services Prelims — GS Paper 1',               '🇮🇳'),
('gate',       'GATE',          'Graduate Aptitude Test in Engineering',             '⚙️'),
('cat',        'CAT',           'MBA entrance — QA, VARC, DILR',                     '💼'),
('ibps-po',    'IBPS PO',       'Banking Probationary Officer',                      '🏦'),
('rrb-ntpc',   'RRB NTPC',      'Railway Non-Technical',                             '🚂'),
('cuet',       'CUET UG',       'Central University Entrance Test',                  '🎓'),
('class-10',   'Class 10 Boards','CBSE Class 10 — Maths, Science',                   '📚');

-- ============ EXAM RULES (timing + marking, exam ke hisaab se) ============
insert into exam_rules (exam_id, duration_minutes, per_question_seconds, correct_marks, negative_marks, total_questions)
select id, 180, 120, 4, 1, 90 from exams where slug = 'jee-main';
insert into exam_rules (exam_id, duration_minutes, per_question_seconds, correct_marks, negative_marks, total_questions)
select id, 200, 66, 4, 1, 180 from exams where slug = 'neet';
insert into exam_rules (exam_id, duration_minutes, per_question_seconds, correct_marks, negative_marks, total_questions)
select id, 60, 144, 2, 0.5, 25 from exams where slug = 'ssc-cgl';
insert into exam_rules (exam_id, duration_minutes, per_question_seconds, correct_marks, negative_marks, total_questions)
select id, 120, 72, 2, 0.66, 100 from exams where slug = 'upsc-prelims';
insert into exam_rules (exam_id, duration_minutes, per_question_seconds, correct_marks, negative_marks, total_questions)
select id, 180, 120, 1, 0.33, 65 from exams where slug = 'gate';
insert into exam_rules (exam_id, duration_minutes, per_question_seconds, correct_marks, negative_marks, total_questions)
select id, 120, 90, 3, 1, 66 from exams where slug = 'cat';
insert into exam_rules (exam_id, duration_minutes, per_question_seconds, correct_marks, negative_marks, total_questions)
select id, 60, 72, 1, 0.25, 35 from exams where slug = 'ibps-po';
insert into exam_rules (exam_id, duration_minutes, per_question_seconds, correct_marks, negative_marks, total_questions)
select id, 90, 60, 1, 0.33, 100 from exams where slug = 'rrb-ntpc';
insert into exam_rules (exam_id, duration_minutes, per_question_seconds, correct_marks, negative_marks, total_questions)
select id, 120, 90, 4, 1, 65 from exams where slug = 'cuet';
insert into exam_rules (exam_id, duration_minutes, per_question_seconds, correct_marks, negative_marks, total_questions)
select id, 90, 90, 1, 0.25, 40 from exams where slug = 'class-10';

-- ============ JEE SUBJECTS + CHAPTERS ============
insert into subjects (exam_id, name, order_no)
select id, 'Physics', 1 from exams where slug = 'jee-main';
insert into subjects (exam_id, name, order_no)
select id, 'Chemistry', 2 from exams where slug = 'jee-main';
insert into subjects (exam_id, name, order_no)
select id, 'Mathematics', 3 from exams where slug = 'jee-main';

insert into chapters (subject_id, name, order_no)
select s.id, c.name, c.ord from subjects s
cross join (values ('Kinematics',1),('Laws of Motion',2),('Work Energy Power',3)) as c(name, ord)
where s.exam_id = (select id from exams where slug='jee-main') and s.name='Physics';

-- ============ NEET ============
insert into subjects (exam_id, name, order_no)
select id, 'Biology', 1 from exams where slug = 'neet';
insert into subjects (exam_id, name, order_no)
select id, 'Physics', 2 from exams where slug = 'neet';
insert into subjects (exam_id, name, order_no)
select id, 'Chemistry', 3 from exams where slug = 'neet';

-- ============ SSC CGL ============
insert into subjects (exam_id, name, order_no)
select id, 'Reasoning', 1 from exams where slug = 'ssc-cgl';
insert into subjects (exam_id, name, order_no)
select id, 'Quantitative Aptitude', 2 from exams where slug = 'ssc-cgl';
insert into subjects (exam_id, name, order_no)
select id, 'English', 3 from exams where slug = 'ssc-cgl';
insert into subjects (exam_id, name, order_no)
select id, 'General Awareness', 4 from exams where slug = 'ssc-cgl';

-- ============ UPSC ============
insert into subjects (exam_id, name, order_no)
select id, 'GS Paper 1', 1 from exams where slug = 'upsc-prelims';
insert into subjects (exam_id, name, order_no)
select id, 'CSAT', 2 from exams where slug = 'upsc-prelims';

-- ============ BAAKI EXAMS KE SUBJECTS (sirf naam — chapters baad me CSV se) ============
insert into subjects (exam_id, name, order_no)
select id, n.name, n.ord from exams e cross join (values ('Aptitude',1),('Reasoning',2),('English',3),('GK',4)) as n(name, ord)
where e.slug in ('ibps-po','rrb-ntpc');

insert into subjects (exam_id, name, order_no)
select id, 'Quantitative Aptitude', 1 from exams where slug = 'cat';
insert into subjects (exam_id, name, order_no)
select id, 'Verbal Ability', 2 from exams where slug = 'cat';
insert into subjects (exam_id, name, order_no)
select id, 'DILR', 3 from exams where slug = 'cat';

insert into subjects (exam_id, name, order_no)
select id, 'General Aptitude', 1 from exams where slug = 'gate';
insert into subjects (exam_id, name, order_no)
select id, 'Domain Subject', 2 from exams where slug = 'gate';

insert into subjects (exam_id, name, order_no)
select id, 'Domain Subjects', 1 from exams where slug = 'cuet';
insert into subjects (exam_id, name, order_no)
select id, 'General Test', 2 from exams where slug = 'cuet';

insert into subjects (exam_id, name, order_no)
select id, 'Mathematics', 1 from exams where slug = 'class-10';
insert into subjects (exam_id, name, order_no)
select id, 'Science', 2 from exams where slug = 'class-10';

-- ============ SAMPLE QUESTIONS (proof of concept — full bank CSV se) ============
insert into questions (exam_id, subject_id, chapter_id, question_text, options, correct_index, hint, explanation, difficulty, source)
select
  e.id, s.id, c.id,
  'A particle moves with uniform acceleration. Its velocity changes from 5 m/s to 25 m/s in 4 s. The acceleration is:',
  '["2.5 m/s²","5 m/s²","7.5 m/s²","10 m/s²"]', 1,
  'a = (v - u) / t',
  'a = (25 - 5) / 4 = 5 m/s²',
  'easy', 'preloaded'
from exams e
join subjects s on s.exam_id = e.id and s.name = 'Physics'
join chapters c on c.subject_id = s.id and c.name = 'Kinematics'
where e.slug = 'jee-main';

insert into questions (exam_id, subject_id, question_text, options, correct_index, hint, explanation, difficulty, source)
select e.id, s.id,
  'Which of the following is a primary metabolite?',
  '["Insulin","Alkaloids","Flavonoids","Antibiotics"]', 0,
  'Primary metabolites are essential for normal growth',
  'Insulin is a primary metabolite; alkaloids, flavonoids, antibiotics are secondary metabolites.',
  'medium', 'preloaded'
from exams e join subjects s on s.exam_id = e.id and s.name = 'Biology'
where e.slug = 'neet';
