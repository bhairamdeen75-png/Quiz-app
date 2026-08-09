import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Kaise Kaam Karta Hai? 🤔</h1>
      <div className="card">
        <h2 className="text-lg font-bold">1. Exam Chuno</h2>
        <p className="mt-1 text-slate-600">10+ exams — JEE, NEET, SSC, UPSC aur bahut kuch. Har exam ki preloaded test series.</p>
      </div>
      <div className="card">
        <h2 className="text-lg font-bold">2. AI Test Banao</h2>
        <p className="mt-1 text-slate-600">Pollinations AI se 10-50 questions generate karo — subject, chapter aur difficulty chuno.</p>
      </div>
      <div className="card">
        <h2 className="text-lg font-bold">3. Test Do aur Seekho</h2>
        <p className="mt-1 text-slate-600">Exam-accurate timer + negative marking. Har answer ke baad sahi/galat + hint milta hai.</p>
      </div>
      <div className="card">
        <h2 className="text-lg font-bold">4. Progress Track Karo</h2>
        <p className="mt-1 text-slate-600">Dashboard pe apne scores aur weak topics ka analysis dekho.</p>
      </div>
      <Link href="/exams" className="btn-primary inline-block">Test Series Shuru Karo →</Link>
    </div>
  );
}
