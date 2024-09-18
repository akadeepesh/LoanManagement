"use client";

import React from "react";
import { withAuth } from "@/components/withAuth";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, FileText } from "lucide-react";

interface AdminCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  darkColor: string;
}

const AdminCard: React.FC<AdminCardProps> = ({
  href,
  title,
  description,
  icon,
  color,
  darkColor,
}) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className="relative overflow-hidden"
  >
    <Link href={href}>
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${color} ${darkColor}`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16 rotate-45 bg-opacity-10 bg-white dark:bg-opacity-10 dark:bg-gray-300"></div>
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full mr-4 bg-opacity-20 bg-white dark:bg-opacity-20 dark:bg-gray-300">
              {icon}
            </div>
            <h2 className="text-2xl font-bold text-white dark:text-gray-100">
              {title}
            </h2>
          </div>
          <p className="text-lg text-white dark:text-gray-200 opacity-90 mb-6">
            {description}
          </p>
          <div className="flex justify-end">
            <span className="text-white dark:text-gray-100 font-semibold inline-flex items-center group">
              Access
              <svg
                className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

function AdminPanel() {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 min-h-[calc(100vh-5rem)] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-primary-800 dark:text-primary-200 mb-8 text-center">
          Admin Dashboard
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <AdminCard
            href="/admin/manage-users"
            title="Manage Users"
            description="Add, edit, or remove user accounts. View and manage user permissions and details."
            icon={<Users className="h-8 w-8 text-white dark:text-gray-100" />}
            color="bg-gradient-to-br from-blue-500 to-blue-700"
            darkColor="dark:from-blue-700 dark:to-blue-900"
          />
          <AdminCard
            href="/admin/all-applications"
            title="All Applications"
            description="Review and process loan applications. Access detailed information and make informed decisions."
            icon={
              <FileText className="h-8 w-8 text-white dark:text-gray-100" />
            }
            color="bg-gradient-to-br from-green-500 to-green-700"
            darkColor="dark:from-green-700 dark:to-green-900"
          />
        </div>
      </div>
    </div>
  );
}

export default withAuth(AdminPanel, ["admin"]);
