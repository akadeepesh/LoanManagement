"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Loan Management
        </Link>
        <div className="space-x-4">
          {session ? (
            <>
              <Link href="/">Home</Link>
              {session.user.role === "user" && (
                <Link href="/dashboard">Dashboard</Link>
              )}
              {session.user.role === "admin" && (
                <Link href="/admin">Admin</Link>
              )}
              {(session.user.role === "verifier" ||
                session.user.role === "admin") && (
                <Link href="/verifier">Verify</Link>
              )}
              <button
                onClick={() => signOut()}
                className="bg-red-500 px-2 py-1 rounded"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">Sign In</Link>
              <Link href="/auth/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
