import NextAuth from 'next-auth';

import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from './lib/db/prisma';
import bcryptjs from 'bcryptjs';
import { authConfig } from './auth.config';

const getUser = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log(credentials, 'クリデンシャル🔥');
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          // ▶️ AuthErrorを投げる　▶️ authenticate.tsでエラー処理
          const passwordsMatch = await bcryptjs.compare(
            password,
            user.password
          );
          console.log(user, '🔥🔥');
          if (passwordsMatch) return user;
          // authにuserオブジェクトが入る
        }
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id || token.sub || '') as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
