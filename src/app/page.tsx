"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, ShieldCheck, Users, LogIn, UserPlus } from "lucide-react";
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
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
    <Link
      href={href}
      className={`flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ${color}`}
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
    <main className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-start sm:justify-center p-6 sm:p-10
      bg-gradient-to-br from-primary-50 to-primary-100
      border-4 border-primary-400 rounded-3xl
      shadow-xl
      overflow-hidden
      animate-borderGlow"
    >
      <style jsx>{`
        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        .animate-borderGlow {
          animation: borderGlow 3s infinite ease-in-out;
        }
      `}</style>

      <motion.div className="absolute top-6 sm:top-12 w-full text-center z-20">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to Loan Management System
        </motion.h1>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.03, y: -2, boxShadow: "0 20px 40px rgba(59,130,246,0.25)" }}
        className="relative mt-28 sm:mt-36 bg-gradient-to-br from-white to-primary-50 shadow-[0_20px_40px_rgba(59,130,246,0.25)] rounded-3xl p-8 sm:p-12 max-w-md sm:max-w-3xl w-full text-center z-10 border border-primary-200"
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <div className="w-20 h-1 bg-gradient-to-r from-primary-300 to-primary-400 rounded-full mb-4 mx-auto"></div>

        <p className="text-gray-600 text-base sm:text-lg md:text-lg mb-6">
          Sign in to access your account or create a new one to start managing your loans.
        </p>

        {!session && (
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/auth/signin"
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-base sm:text-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/auth/signup"
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl text-base sm:text-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                <UserPlus className="h-5 w-5" />
                Sign Up
              </Link>
            </motion.div>
          </div>
        )}
      </motion.div>
    </main>
  );
}
