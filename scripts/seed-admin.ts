/**
 * Seed script: creates a default admin user if none exists.
 * Loads .env and .env.local from project root so MONGODB_URI is set.
 * Override with SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME.
 *
 * Usage: npm run seed
 */

import path from 'path';
import { config } from 'dotenv';

// Load .env from project root (cwd when running "npm run seed"), then .env.local so local overrides
const root = process.cwd();
config({ path: path.join(root, '.env') });
config({ path: path.join(root, '.env.local') });

const DEFAULT_EMAIL = 'admin@example.com';
const DEFAULT_PASSWORD = 'Admin@123';
const DEFAULT_NAME = 'Admin';

async function seedAdmin() {
  const { default: connectDB } = await import('../lib/db/mongodb');
  const { hashPassword } = await import('../lib/auth/password');
  const { default: Admin } = await import('../models/Admin');

  const email = process.env.SEED_ADMIN_EMAIL ?? DEFAULT_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD ?? DEFAULT_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? DEFAULT_NAME;

  console.log('Connecting to MongoDB...');
  await connectDB();

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin already exists with email: ${email}`);
    process.exit(0);
  }

  const hashedPassword = await hashPassword(password);
  await Admin.create({
    email,
    password: hashedPassword,
    name,
    role: 'admin',
    isActive: true,
    permissions: ['all'],
  });

  console.log('Admin created successfully.');
  console.log(`  Email:    ${email}`);
  console.log(`  Name:     ${name}`);
  console.log('  Password: (use SEED_ADMIN_PASSWORD to customize)');
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
