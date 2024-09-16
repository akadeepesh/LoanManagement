"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Loan Management System
      </h1>
      {session ? (
        <div className="flex flex-col items-center">
          <p className="mb-4">
            Welcome, {session.user.name || session.user.email}
          </p>
          <div className="flex gap-4">
            {session.user.role === "user" && (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                User Dashboard
              </Link>
            )}
            {session.user.role === "admin" && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Admin Panel
              </Link>
            )}
            {(session.user.role === "verifier" ||
              session.user.role === "admin") && (
              <Link
                href="/verifier"
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Loan Verification
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Sign Up
          </Link>
        </div>
      )}
    </main>
  );
}
