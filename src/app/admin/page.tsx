"use client";

import { withAuth } from "@/components/withAuth";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface AdminCardProps {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
}

function AdminCard({ href, title, description, icon, color }: AdminCardProps) {
  return (
    <Link
      href={href}
      className="block group hover:shadow-md transition-shadow duration-200 rounded-lg overflow-hidden"
    >
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className={`p-4 ${color}`}>{icon}</div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h2>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-blue-600 group-hover:bg-blue-50 transition-colors duration-200 flex justify-end items-center">
          <span className="text-sm font-medium">Access</span>
          <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}

function AdminPanel() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-blue-100 mt-2">
            Manage your application and users
          </p>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <AdminCard
              href="/admin/manage-users"
              title="Manage Users"
              description="Add, edit, or remove user accounts"
              icon={<Users className="h-6 w-6" />}
              color="bg-purple-500"
            />
            <AdminCard
              href="/admin/all-applications"
              title="All Applications"
              description="View and process submitted applications"
              icon={<FileText className="h-6 w-6" />}
              color="bg-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(AdminPanel, ["admin"]);
