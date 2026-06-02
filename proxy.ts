import { withAuth } from 'next-auth/middleware';
import { ROLES } from '@/constants';

const authMiddleware = withAuth({
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    authorized: ({ token }) => {
      return token?.role === ROLES.ADMIN;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.JWT_SECRET,
});

export const proxy = authMiddleware;
export default authMiddleware;

export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
};
