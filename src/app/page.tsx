import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Loan Management System
      </h1>
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          User Dashboard
        </Link>
        <Link
          href="/admin"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Admin Panel
        </Link>
        <Link
          href="/verifier"
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Loan Verification
        </Link>
      </div>
    </main>
  );
}
