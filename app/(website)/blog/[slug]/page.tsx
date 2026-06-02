import Link from "next/link";
import { getBlogBySlug } from "@/api.services/api.services";
import { getImageUrl } from "@/lib/utils/image";
import BlogContent from "@/components/ui/common/BlogContent";

interface BlogProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetail({ params }: BlogProps) {
  const { slug } = await params;
  
  // Fetch blog from API
  const result = await getBlogBySlug(slug);
  const blog = result.data;

  if (!blog) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-semibold">Blog Not Found</h1>
        <Link href="/blog" className="text-blue-600 mt-4 inline-block">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden bg-black">
        <img
          src={getImageUrl(blog.coverImage)}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight text-white drop-shadow-md max-w-4xl">
            {blog.title}
          </h1>
          <div className="mt-6 flex items-center gap-4 text-slate-400">
            <p className="text-sm md:text-base">
              {blog.publishedAt 
                ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
              }
            </p>
            {blog.author && (
              <span className="text-sm md:text-base">· {blog.author}</span>
            )}
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        {/* Blog HTML Content */}
        <BlogContent html={blog.contentHtml} />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/blog"
          className="inline-block mt-8 px-5 py-2 border border-black hover:bg-black hover:text-white transition cursor-pointer"
        >
          Back to Blogs
        </Link>
      </section>
    </>
  );
}