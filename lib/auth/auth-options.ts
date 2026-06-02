import path from 'path';
import { config } from 'dotenv';

// Ensure .env is loaded when this module runs (Next.js loads it too; this covers edge cases)
config({ path: path.resolve(process.cwd(), '.env') });
config({ path: path.resolve(process.cwd(), '.env.local') });

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthService } from '@/services';
import { ROLES } from '@/constants';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'admin-credentials',
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
       
        if (!credentials?.email || !credentials?.password) return null;
       
        try {
            console.log(credentials,"credentials343");
          const result = await AuthService.adminLogin({
            email: credentials.email,
            password: credentials.password,
          });
          console.log(result,"result32");
          return result.user
            ? {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name ?? undefined,
                role: result.user.role,
              }
            : null;
        } catch (error) {
          // console.error('Admin log\in error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/admin`;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.JWT_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Type augmentation for NextAuth session and JWT
 */
declare module 'next-auth' {
  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    role?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}
