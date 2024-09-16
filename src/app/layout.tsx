import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import AuthProvider from "@/components/AuthProvider";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loan Management System",
  description: "Apply and manage loans easily",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main className="container mx-auto mt-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
