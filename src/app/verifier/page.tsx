"use client";

import { withAuth } from "@/components/withAuth";
import Link from "next/link";

function VerifierPanel() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Loan Verification</h1>
      <div className="space-y-4">
        <Link
          href="/verifier/pending"
          className="block px-4 py-2 bg-yellow-500 text-white rounded w-fit"
        >
          Pending Applications
        </Link>
        <Link
          href="/verifier/verified"
          className="block px-4 py-2 bg-green-500 text-white rounded w-fit"
        >
          Verified Applications
        </Link>
      </div>
    </div>
  );
}

export default withAuth(VerifierPanel, ["verifier", "admin"]);
