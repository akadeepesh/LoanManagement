import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import { ObjectId } from "mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        await dbConnect();
        const user = (await User.findOne({
          email: credentials.email,
        })) as IUser | null;
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }
        return {
          id: (user._id as ObjectId).toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  // ... rest of the code remains the same
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
