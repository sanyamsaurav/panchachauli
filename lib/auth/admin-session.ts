import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import { requireRole } from '@/lib/auth/middleware';
import { ROLES } from '@/constants';
import { MESSAGES } from '@/constants/messages';

export type AdminSession = {
  id: string;
  email: string | null | undefined;
  name: string | null | undefined;
  role: string;
};

/**
 * Get the current admin session in API routes or Server Components.
 * Returns session user if authenticated and role is admin; otherwise throws.
 */
export async function getAdminSession(): Promise<AdminSession> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    const error = new Error(MESSAGES.AUTH.NO_TOKEN);
    (error as Error & { code?: string }).code = 'UNAUTHORIZED';
    throw error;
  }

  if (session.user.role !== ROLES.ADMIN) {
    const error = new Error(MESSAGES.AUTH.INSUFFICIENT_PERMISSIONS);
    (error as Error & { code?: string }).code = 'FORBIDDEN';
    throw error;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}

/**
 * Require admin: use NextAuth session if present, else fall back to Bearer token.
 * Use this in admin API routes to support both browser (session) and API clients (token).
 */
export async function requireAdmin(request: NextRequest): Promise<AdminSession> {
  const session = await getServerSession(authOptions);
  if (session?.user?.role === ROLES.ADMIN) {
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    };
  }
  const payload = await requireRole(request, [ROLES.ADMIN]);
  return {
    id: payload.userId,
    email: payload.email,
    name: undefined,
    role: payload.role,
  };
}

/**
 * Get session or null (no throw). Useful when you need optional auth.
 */
export async function getSessionOrNull() {
  return getServerSession(authOptions);
}
