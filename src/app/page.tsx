"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, DollarSign, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardLinkProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const DashboardLink: React.FC<DashboardLinkProps> = ({
  href,
  title,
  description,
  icon,
  color,
}) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link
      href={href}
      className={`flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${color}`}
    >
      <div className="flex-shrink-0 mr-4">{icon}</div>
      <div>
        <h2 className="text-xl text-primary-700 font-semibold mb-1">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <ArrowRight className="ml-auto text-primary-600" />
    </Link>
  </motion.div>
);

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="bg-gradient-to-br from-primary-50 to-primary-100 min-h-[calc(100vh-5rem)] p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center md:mb-12 text-primary-700"
        >
          Loan Management System
        </motion.h1>
        {session ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 md:space-y-8"
          >
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
              <p className="text-xl md:text-2xl font-semibold text-primary-700 mb-2">
                Welcome, {session.user?.name || session.user?.email}
              </p>
              <p className="text-gray-600">
                Access your personalized dashboard below.
              </p>
            </div>
            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
              {session.user?.role === "user" && (
                <DashboardLink
                  href="/dashboard"
                  title="User Dashboard"
                  description="Manage your loans and applications"
                  icon={<DollarSign className="h-8 w-8 text-blue-500" />}
                  color="hover:bg-blue-50"
                />
              )}
              {session.user?.role === "admin" && (
                <DashboardLink
                  href="/admin"
                  title="Admin Panel"
                  description="Oversee system operations"
                  icon={<Users className="h-8 w-8 text-green-500" />}
                  color="hover:bg-green-50"
                />
              )}
              {(session.user?.role === "verifier" ||
                session.user?.role === "admin") && (
                <DashboardLink
                  href="/verifier"
                  title="Loan Verification"
                  description="Review and verify loan applications"
                  icon={<ShieldCheck className="h-8 w-8 text-yellow-500" />}
                  color="hover:bg-yellow-50"
                />
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 md:p-8 rounded-xl shadow-md"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-primary-700">
              Get Started
            </h2>
            <p className="text-gray-600 mb-6">
              Sign in to access your account or create a new one to start
              managing your loans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signin"
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-md text-center font-semibold hover:bg-primary-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex-1 px-6 py-3 bg-secondary-500 text-white rounded-md text-center font-semibold hover:bg-secondary-600 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
