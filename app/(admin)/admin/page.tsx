import { FileText, Compass, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    cache: "no-store",
    headers: { Cookie: cookieStore.toString() },
  });

  const data = res.ok ? (await res.json()).data || {} : {};
  const totalBlogs = data.totalBlogs ?? 0;
  const totalExperiences = data.totalExperiences ?? 0;

  const stats = [
    {
      title: "Total Blogs",
      value: String(totalBlogs),
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/admin/blogs",
    },
    {
      title: "Total Experiences",
      value: String(totalExperiences),
      icon: Compass,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/experiences",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Manage your blogs and experiences.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-primary/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl bg-gradient-to-r from-primary to-primary-hard p-6 text-white shadow-lg">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/admin/blogs/new"
            className="rounded-lg bg-white/10 p-4 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
          >
            <FileText className="h-6 w-6 mb-2" />
            <p className="font-semibold">Create Blog</p>
            <p className="text-sm text-white/80">Add a new blog post</p>
          </Link>
          <Link
            href="/admin/experiences/new"
            className="rounded-lg bg-white/10 p-4 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
          >
            <Compass className="h-6 w-6 mb-2" />
            <p className="font-semibold">Create Experience</p>
            <p className="text-sm text-white/80">Add a new experience</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
