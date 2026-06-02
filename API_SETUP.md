# API Setup Guide

## Environment Variables

Create a `.env` or `.env.local` file in the **project root** (same folder as `package.json`). The file must be named exactly `.env` or `.env.local` (no extra spaces or extension). Next.js loads these automatically when you run `next dev` or `next build`. Restart the dev server after changing env files.

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/wow-foundation
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Configuration (used for public/user API auth and as fallback for NextAuth)
JWT_SECRET=your-super-secret-key-change-in-production-min-32-characters
JWT_EXPIRES_IN=7d

# NextAuth (admin dashboard) — required for admin login and redirect after sign-in
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-min-32-characters
# If you see ?error=Configuration after login, add both NEXTAUTH_URL and NEXTAUTH_SECRET to .env or .env.local

# Environment
NODE_ENV=development
```

### Seeding admin user

Create a default admin (e.g. for first-time setup or local dev):

```bash
npm run seed
```

This uses `scripts/seed-admin.ts`, which loads `.env` and then `.env.local` from the project root, so `MONGODB_URI` is available. If you use only `.env`, that’s enough.

**Default credentials (development only):**
- Email: `admin@example.com`
- Password: `Admin@123`
- Name: `Admin`

Override with env vars (optional):

```env
SEED_ADMIN_EMAIL=admin@yourdomain.com
SEED_ADMIN_PASSWORD=YourSecurePassword
SEED_ADMIN_NAME=Your Name
```

## Database Connection

The database connection uses a singleton pattern to prevent multiple connections in Next.js API routes.

**Usage in API routes:**
```typescript
import connectDB from '@/lib/db/mongodb';

export async function GET() {
  await connectDB(); // Reuses cached connection
  // Your code here
}
```

## Authentication

### Admin Dashboard (NextAuth)

- **Admin login**: `/admin/login` — sign in with admin credentials (Admin model only).
- **Session**: NextAuth JWT session (cookie). Protects `/admin` and `/admin/*` (except `/admin/login`).
- **Admin APIs**: Accept either NextAuth session (cookie) or `Authorization: Bearer <token>` (existing JWT).

### Token-Based Authentication (Public / API)

1. **Login** - `POST /api/auth/login`
   - Returns JWT token (user, volunteer, or admin)
   - Store token in Authorization header: `Bearer <token>`

2. **Register** - `POST /api/auth/register`
   - Creates new user/volunteer
   - Returns JWT token

3. **Verify** - `GET /api/auth/verify`
   - Validates token
   - Returns user data

### Protecting Routes

**Require admin (session or Bearer token):**
```typescript
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  // Admin is authenticated via NextAuth session or JWT
}
```

**Require any authenticated user:**
```typescript
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await requireAuth(request);
  // User is authenticated
}
```

**Require specific role:**
```typescript
import { requireRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await requireRole(request, ['admin']);
  // User is authenticated and is admin
}
```

## API Routes

### Authentication Routes
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user/volunteer
- `GET /api/auth/verify` - Verify token

### Admin Routes (Admin Only)
- `GET /api/admin/users` - Get all users (paginated)

### Volunteer Routes (Authenticated)
- `GET /api/volunteers` - Get all volunteers (paginated)

### Donation Routes
- `GET /api/donations` - Get donations (authenticated - admins see all, users see their own)
- `POST /api/donations` - Create donation (public, but can link to authenticated user)

### Activity Routes
- `GET /api/activities` - Get all activities (public)
- `POST /api/activities` - Create activity (admin only)

## Models

### User Model
- Base user model with email, password, name, role
- Roles: `admin`, `volunteer`, `user`

### Admin Model
- Extends user functionality
- Has permissions array

### Volunteer Model
- Extends user functionality
- Additional fields: phone, address, skills, availability

### Donation Model
- Donor information
- Payment details and status
- Can be linked to volunteer

### Activity Model
- Activity details
- Linked to organizer (admin)
- Can have multiple volunteers

## Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

**Paginated:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Usage Examples

### Frontend API Call Example

```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const { data } = await response.json();
// Store token: data.token

// Authenticated request
const response = await fetch('/api/volunteers', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Security Best Practices

1. **Password Hashing**: Uses bcrypt with 12 salt rounds
2. **JWT Tokens**: Stored in HTTP-only cookies (recommended) or Authorization header
3. **Token Expiration**: Configurable via `JWT_EXPIRES_IN`
4. **Role-Based Access**: Use `requireRole()` for role-specific routes
5. **Input Validation**: All inputs validated with Zod schemas

