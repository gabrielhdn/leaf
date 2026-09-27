import { z } from "zod";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyOwnerPassword } from "@/lib/auth/owner-password";

const credentialsSchema = z.object({
  password: z.string().min(1).max(1024),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        password: { type: "password" },
      },
      authorize(credentials) {
        const input = credentialsSchema.safeParse(credentials);

        if (
          !input.success ||
          !verifyOwnerPassword(input.data.password, process.env.LEAF_OWNER_PASSWORD)
        ) {
          return null;
        }

        return { id: "owner", name: "Leaf owner" };
      },
    }),
  ],
});
