# 📚 Quiz App

Free test series & quiz platform for JEE, NEET, SSC, UPSC aur 10+ exams.
Har student ke liye free — AI test, PDF → Quiz, aur preloaded question banks.

## Features
- 🤖 AI Live Test (Pollinations AI) — exam/subject/chapter select, 10-50 Q, instant feedback + hint
- 📄 PDF → Quiz — upload PDF, AI questions nikaalta hai
- 🏆 Preloaded Series — 10 exams, exam-level timing & difficulty
- ⏱️ Exam-accurate timers + negative marking

## Tech Stack
Next.js 14 · Supabase (PostgreSQL) · Pollinations AI · Tailwind CSS · NextAuth

## Setup
1. `npm install`
2. `.env.example` copy karke `.env.local` me values bharo
3. Supabase me `supabase/migrations/0001_init.sql` chalao
4. `supabase/seed/seed_exams.sql` chalao (exams + subjects + rules)
5. `npx tsx scripts/import-csv.ts supabase/seed/questions/jee_main_questions.csv` (question bank)
6. `npm run dev`

## Deploy (Vercel)
1. Repo ko GitHub par push karo
2. Vercel → New Project → repo connect
3. Environment variables dalo 
4. Deploy — done! 🚀

# deployer and programmer 
 made with ❤️ TEAMVB 
