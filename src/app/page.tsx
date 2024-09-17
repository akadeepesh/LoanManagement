"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, DollarSign, ShieldCheck, Users } from "lucide-react";

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
  <Link
    href={href}
    className={`flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${color}`}
  >
    <div className="flex-shrink-0 mr-4">{icon}</div>
    <div>
      <h2 className="text-xl text-indigo-800 font-semibold">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
    <ArrowRight className="ml-auto" />
  </Link>
);

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="bg-gradient-to-br  p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 text-indigo-400">
          Loan Management System
        </h1>
        {session ? (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-2xl font-semibold text-indigo-800 mb-2">
                Welcome, {session.user?.name || session.user?.email}
              </p>
              <p className="text-gray-600">
                Access your personalized dashboard below.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
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
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
              Get Started
            </h2>
            <p className="text-gray-600 mb-6">
              Sign in to access your account or create a new one to start
              managing your loans.
            </p>
            <div className="flex gap-4">
              <Link
                href="/auth/signin"
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-md text-center font-semibold hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md text-center font-semibold hover:bg-green-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
