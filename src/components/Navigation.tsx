"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Home, User, Shield, LogOut } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => (
  <Link
    href={href}
    className="text-gray-200 hover:bg-primary-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default function Navigation() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gradient-to-r from-primary-700 to-primary-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-white text-xl font-bold">
                Loan Management
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {session ? (
                <>
                  <NavLink href="/">
                    <Home className="inline-block mr-2 h-4 w-4" />
                    Home
                  </NavLink>
                  {session.user?.role === "user" && (
                    <NavLink href="/dashboard">
                      <User className="inline-block mr-2 h-4 w-4" />
                      Dashboard
                    </NavLink>
                  )}
                  {session.user?.role === "admin" && (
                    <NavLink href="/admin">
                      <Shield className="inline-block mr-2 h-4 w-4" />
                      Admin
                    </NavLink>
                  )}
                  {(session.user?.role === "verifier" ||
                    session.user?.role === "admin") && (
                    <NavLink href="/verifier">
                      <Shield className="inline-block mr-2 h-4 w-4" />
                      Verify
                    </NavLink>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-gray-200 hover:bg-primary-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center"
                  >
                    <LogOut className="inline-block mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <NavLink href="/auth/signin">Sign In</NavLink>
                  <NavLink href="/auth/signup">
                    <span className="bg-secondary-500 text-white px-4 py-2 rounded-md">
                      Sign Up
                    </span>
                  </NavLink>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800 focus:ring-white transition duration-150 ease-in-out"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-800">
            {session ? (
              <>
                <NavLink href="/" onClick={closeMenu}>
                  <Home className="inline-block mr-2 h-4 w-4" />
                  Home
                </NavLink>
                {session.user?.role === "user" && (
                  <NavLink href="/dashboard" onClick={closeMenu}>
                    <User className="inline-block mr-2 h-4 w-4" />
                    Dashboard
                  </NavLink>
                )}
                {session.user?.role === "admin" && (
                  <NavLink href="/admin" onClick={closeMenu}>
                    <Shield className="inline-block mr-2 h-4 w-4" />
                    Admin
                  </NavLink>
                )}
                {(session.user?.role === "verifier" ||
                  session.user?.role === "admin") && (
                  <NavLink href="/verifier" onClick={closeMenu}>
                    <Shield className="inline-block mr-2 h-4 w-4" />
                    Verify
                  </NavLink>
                )}
                <button
                  onClick={() => {
                    closeMenu();
                    signOut();
                  }}
                  className="text-gray-200 hover:bg-primary-600 hover:text-white px-3 py-2 rounded-md text-base font-medium w-full text-left transition duration-150 ease-in-out flex items-center"
                >
                  <LogOut className="inline-block mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink href="/auth/signin" onClick={closeMenu}>
                  Sign In
                </NavLink>
                <NavLink href="/auth/signup" onClick={closeMenu}>
                  <span className="bg-secondary-500 text-white px-4 py-2 rounded-md inline-block">
                    Sign Up
                  </span>
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
