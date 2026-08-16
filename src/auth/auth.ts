import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/utils/password";
import type { UserRole } from "@/generated/prisma/client";

const authSecret =
  process.env.AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: authSecret,
  // Needed in local/dev so /api/auth/session returns JSON instead of an HTML error page.
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.name} ${user.lastName}`.trim(),
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role as UserRole | undefined;
      }
      // Keep id stable across refreshes (Auth.js uses `sub` as the subject).
      if (!token.id && typeof token.sub === "string") {
        token.id = token.sub;
      }
      if (trigger === "update" && session) {
        if (typeof session.email === "string") {
          token.email = session.email;
        }
        if (typeof session.role === "string") {
          token.role = session.role as UserRole;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.email === "string") {
          session.user.email = token.email;
        }
        if (typeof token.name === "string") {
          session.user.name = token.name;
        }
        const id =
          typeof token.id === "string"
            ? token.id
            : typeof token.sub === "string"
              ? token.sub
              : undefined;
        if (id) {
          session.user.id = id;
        }
        if (typeof token.role === "string") {
          session.user.role = token.role as UserRole;
        }
      }
      return session;
    },
  },
});

export async function isAuth(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user);
}
