"use client";

import { withAuth } from "@/components/withAuth";
import Link from "next/link";

function AdminPanel() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="space-y-4">
        <Link
          href="/admin/users"
          className="block px-4 py-2 bg-blue-500 text-white rounded w-fit"
        >
          Manage Users
        </Link>
        <Link
          href="/admin/applications"
          className="block px-4 py-2 bg-green-500 text-white rounded w-fit"
        >
          All Applications
        </Link>
      </div>
    </div>
  );
}

export default withAuth(AdminPanel, ["admin"]);
