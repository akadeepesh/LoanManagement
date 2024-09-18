"use client";

import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
      <p className="text-xl mb-8">
        You do not have permission to view this page.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Return to Home
      </Link>
    </div>
  );
}
