import { getBlogs } from "@/api.services/api.services";
import { getImageUrl } from "@/lib/utils/image";
import { ShopStyleHero, ShopStyleHeader, ShopStyleCard } from "@/components/website/common/ShopStyleCard";
import type { IBlog } from "@/types/models";

// Force dynamic rendering to avoid prerendering errors during build
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  // Fetch blogs from API
  let blogs: IBlog[] = [];
  try {
    const result = await getBlogs({ limit: 100 });
    blogs = result.data || [];
  } catch (_err) {
    blogs = [];
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Shop Style */}
      <ShopStyleHero
        title="Journey Through"
        accentText="The Himalayas"
        subtitle="Discover stories, guides, and insights from our adventures in the mountains. Get inspired for your next journey."
        backgroundImage="/blog/unnamed-2.png"
        // buttonText="Explore Stories"
        // buttonHref="/blog"
      />

      {/* Blog Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShopStyleHeader
          title="Our Blogs"
          subtitle="Travel stories and mountain insights"
        />

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blogs found.</p>
          </div>
        ) : (
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
        )}
      </section>
    </div>
  );
}
