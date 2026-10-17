import { cookies } from "next/headers";
import { AdminDashboardClient } from "@/components/admin";
import type { AdminDashboardData } from "@/api.services/api.services";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

const defaultData: AdminDashboardData = {
  totalBlogs: 0,
  totalExperiences: 0,
  totalProducts: 0,
  totalContacts: 0,
  newContactsCount: 0,
  contactsStats: {
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  },
  recentContacts: [],
  totalSchoolAspirants: 0,
  newSchoolCount: 0,
  recentSchoolAspirants: [],
  totalSubscribers: 0,
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  let dashboardData: AdminDashboardData = defaultData;

  try {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      cache: "no-store",
      headers: { Cookie: cookieStore.toString() },
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        dashboardData = { ...defaultData, ...json.data };
      }
    }
  } catch {
    // fallback to defaultData
  }

  return <AdminDashboardClient initialData={dashboardData} />;
}
