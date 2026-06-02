"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBlogs } from "@/api.services/api.services";
import { getImageUrl } from "@/lib/utils/image";
import { ShopStyleHeader, ShopStyleCard } from "@/components/website/common/ShopStyleCard";
import type { IBlog } from "@/types/models";

export function Blog() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const result = await getBlogs({ limit: 3 });
        setBlogs(result.data || []);
      } catch (_err) {
        console.error("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading blogs...</p>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <ShopStyleHeader
        title="Our Blogs"
        subtitle="Journey through the Divine Himalayas"
        action={{ text: "View All", href: "/blog" }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {blogs.map((blog) => (
          <ShopStyleCard
            key={blog.slug}
            image={getImageUrl(blog.coverImage)}
            imageAlt={blog.title}
            category={blog.publishedAt 
              ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : new Date(blog.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
            }
            title={blog.title}
            description={blog.excerpt || blog.metaDescription}
            href={`/blog/${blog.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
