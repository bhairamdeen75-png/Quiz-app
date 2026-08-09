import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-4xl font-extrabold text-gray-900">404</h1>
      <p className="mt-2 text-slate-600">Ye page exist nahi karta.</p>
      <Link href="/" className="btn-primary mt-6 inline-block">Home Pe Jaao</Link>
    </div>
  );
}
