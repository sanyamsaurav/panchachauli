import { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from './jwt';
import type { JWTPayload } from '@/types/auth';

/**
 * Authenticate request and return user payload
 * Throws error if authentication fails
 */
export async function authenticateRequest(
  request: NextRequest | Request
): Promise<JWTPayload> {
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  let token = extractTokenFromHeader(authHeader);

  // If not in header, try to get from cookie
  if (!token && request instanceof NextRequest) {
    token = request.cookies.get('token')?.value || null;
  }

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const payload = verifyToken(token);
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Middleware to protect routes - requires authentication
 */
export async function requireAuth(
  request: NextRequest | Request
): Promise<JWTPayload> {
  return authenticateRequest(request);
}

/**
 * Middleware to protect routes - requires specific role(s)
 */
export async function requireRole(
  request: NextRequest | Request,
  roles: ('admin' | 'volunteer' | 'user')[]
): Promise<JWTPayload> {
  const user = await authenticateRequest(request);
  
  if (!hasRole(user.role, roles)) {
    throw new Error('Insufficient permissions');
  }
  
  return user;
}

