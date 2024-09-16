"use client";

import { withAuth } from "@/components/withAuth";
import Link from "next/link";

function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <div className="space-y-4">
        <Link
          href="/dashboard/apply"
          className="block px-4 py-2 bg-blue-500 text-white rounded w-fit"
        >
          Apply for a Loan
        </Link>
        <Link
          href="/dashboard/applications"
          className="block px-4 py-2 bg-green-500 text-white rounded w-fit"
        >
          My Applications
        </Link>
      </div>
    </div>
  );
}

export default withAuth(Dashboard, ["user"]);
