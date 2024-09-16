import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function hasRole(role: string) {
  const user = await getCurrentUser();
  return user?.role === role;
}

export async function canManageLoans() {
  const user = await getCurrentUser();
  return user?.role === "user";
}

export async function canVerifyLoans() {
  const user = await getCurrentUser();
  return user?.role === "verifier" || user?.role === "admin";
}

export async function canManageUsers() {
  const user = await getCurrentUser();
  return user?.role === "admin";
}
