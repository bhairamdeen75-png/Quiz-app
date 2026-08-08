import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') redirect('/login');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/questions" className="card hover:border-brand">
          <h2 className="text-xl font-bold">📝 Questions</h2>
          <p className="text-sm text-slate-500">Approve / edit questions (AI & PDF se aaye hue)</p>
        </Link>
        <Link href="/admin/import" className="card hover:border-brand">
          <h2 className="text-xl font-bold">📥 CSV Import</h2>
          <p className="text-sm text-slate-500">Question bank bulk upload karo</p>
        </Link>
        <Link href="/exams" className="card hover:border-brand">
          <h2 className="text-xl font-bold">🏛️ Exams</h2>
          <p className="text-sm text-slate-500">Site ka public view</p>
        </Link>
      </div>
    </div>
  );
}
