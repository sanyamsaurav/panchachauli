const BASE = '/api';

const adminRoutes = {
  settings: () => `${BASE}/admin/settings`,
  password: () => `${BASE}/admin/password`,
  volunteers: () => `${BASE}/admin/volunteers`,
  blogs: (id?: string) => (id ? `${BASE}/admin/blogs/${id}` : `${BASE}/admin/blogs`),
  blogBySlug: (slug: string) => `${BASE}/admin/blogs/slug/${slug}`,
  experiences: (id?: string) => (id ? `${BASE}/admin/experiences/${id}` : `${BASE}/admin/experiences`),
  experienceBySlug: (slug: string) => `${BASE}/admin/experiences/slug/${slug}`,
  upload: () => `${BASE}/admin/upload`,
  contacts: (id?: string) => (id ? `${BASE}/admin/contacts/${id}` : `${BASE}/admin/contacts`),
  school: (id?: string) => (id ? `${BASE}/admin/school/${id}` : `${BASE}/admin/school`),
  products: (id?: string) => (id ? `${BASE}/admin/products/${id}` : `${BASE}/admin/products`),
  productBySlug: (slug: string) => `${BASE}/admin/products/slug/${slug}`,
} as const;

const publicRoutes = {
  settings: () => `${BASE}/settings`,
  blogs: () => `${BASE}/blogs`,
  blogBySlug: (slug: string) => `${BASE}/blogs/${slug}`,
  experiences: () => `${BASE}/experiences`,
  experienceBySlug: (slug: string) => `${BASE}/experiences/${slug}`,
  products: () => `${BASE}/products`,
  productBySlug: (slug: string) => `${BASE}/products/${slug}`,
} as const;

export { adminRoutes, publicRoutes, BASE };

export interface SettingsUpdatePayload {
  organizationName?: string;
  email?: string;
  phone?: string;
  address?: string;
  mapLocationKeyframe?: string;
}

export interface SettingsData {
  id: string;
  organizationName: string;
  email: string;
  phone: string;
  address: string;
  mapLocationKeyframe: string;
  updatedAt: string;
}

