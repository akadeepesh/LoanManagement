import NextAuth from "next-auth";
import { authOptions } from "@/lib/authoptions";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please provide process.env.NEXTAUTH_SECRET");
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
