"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input, Button, Textarea, RichTextEditor, toast } from "@/components/ui/common";
import { uploadAdminImage, getAdminBlogBySlug, updateAdminBlog } from "@/api.services/api.services";
import { Loader2 } from "lucide-react";
import type { IBlog } from "@/types/models";

interface FieldErrors {
  title?: string;
  slug?: string;
  excerpt?: string;
  contentHtml?: string;
  metaTitle?: string;
  metaDescription?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function validateField(field: string, value: string): string | undefined {
  switch (field) {
    case "title":
      if (!value.trim()) return "Title is required";
      if (value.length > 200) return "Title must not exceed 200 characters";
      break;
    case "slug":
      if (!value.trim()) return "Slug is required";
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return "Slug must be URL-safe (lowercase letters, numbers, hyphens)";
      break;
    case "excerpt":
      if (value && value.length > 500) return "Excerpt must not exceed 500 characters";
      break;
    case "contentHtml":
      if (!value.trim()) return "Content is required";
      break;
    case "metaTitle":
      if (value && value.length > 200) return "Meta title must not exceed 200 characters";
      break;
    case "metaDescription":
      if (value && value.length > 300) return "Meta description must not exceed 300 characters";
      break;
  }
  return undefined;
}

function validateAll(fields: { title: string; slug: string; excerpt: string; contentHtml: string; metaTitle: string; metaDescription: string }): FieldErrors {
  const errors: FieldErrors = {};
  const titleError = validateField("title", fields.title);
  if (titleError) errors.title = titleError;
  const slugError = validateField("slug", fields.slug);
  if (slugError) errors.slug = slugError;
  const excerptError = validateField("excerpt", fields.excerpt);
  if (excerptError) errors.excerpt = excerptError;
  const contentError = validateField("contentHtml", fields.contentHtml);
  if (contentError) errors.contentHtml = contentError;
  const metaTitleError = validateField("metaTitle", fields.metaTitle);
  if (metaTitleError) errors.metaTitle = metaTitleError;
  const metaDescError = validateField("metaDescription", fields.metaDescription);
  if (metaDescError) errors.metaDescription = metaDescError;
  return errors;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogSlug = params.slug as string;

  const [blogId, setBlogId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [coverPreview, setCoverPreview] = useState<string | undefined>();
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState<string>("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [contentHtml, setContentHtml] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [metaTitleManuallyEdited, setMetaTitleManuallyEdited] = useState(false);

  // Fetch blog data on mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getAdminBlogBySlug(blogSlug);
        if (res.success && res.data) {
          const blog: IBlog = res.data;
          setBlogId(blog._id.toString());
          setTitle(blog.title);
          setSlug(blog.slug);
          setExcerpt(blog.excerpt || "");
          setCoverImage(blog.coverImage);
          setAuthor(blog.author || "");
          setTags(blog.tags?.join(", ") || "");
          setStatus(blog.status as "draft" | "published");
          setMetaTitle(blog.metaTitle || "");
          setMetaDescription(blog.metaDescription || "");
          setContentHtml(blog.contentHtml || "");
        } else {
          toast.error("Blog not found");
        //   router.push("/admin/blogs");
        }
      } catch (_err: unknown) {
        toast.error("Failed to load blog");
        // router.push("/admin/blogs");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBlog();
  }, [blogSlug, router]);
  
  const clearFieldError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const onTitleChange = (v: string) => {
    setTitle(v);
    clearFieldError("title");
    // Auto-update slug and metaTitle unless manually edited
    if (!slugManuallyEdited) setSlug(slugify(v));
    if (!metaTitleManuallyEdited) setMetaTitle(v);
  };

  const onSlugChange = (v: string) => {
    setSlug(slugify(v));
    setSlugManuallyEdited(true);
    clearFieldError("slug");
  };

  const onExcerptChange = (v: string) => {
    setExcerpt(v);
    clearFieldError("excerpt");
  };

  const onMetaTitleChange = (v: string) => {
    setMetaTitle(v);
    setMetaTitleManuallyEdited(true);
    clearFieldError("metaTitle");
  };

  const onMetaDescriptionChange = (v: string) => {
    setMetaDescription(v);
    clearFieldError("metaDescription");
  };

  const onContentChange = (html: string) => {
    setContentHtml(html);
    // Only clear error if there's actual content
    if (html && html !== "<p></p>") {
      clearFieldError("contentHtml");
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const localUrl = URL.createObjectURL(f);
    setCoverPreview(localUrl);
    setUploading(true);
    try {
      const res = await uploadAdminImage(f);
      if (res.success && res.data?.url) {
        setCoverImage(res.data.url);
        toast.success("Image uploaded");
        URL.revokeObjectURL(localUrl);
        setCoverPreview(undefined);
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch (_err: unknown) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async () => {
    // Validate all fields first
    const errors = validateAll({ title, slug, excerpt, contentHtml, metaTitle, metaDescription });
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the validation errors");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slugify(slug),
        excerpt: excerpt.trim() || undefined,
        contentHtml,
        coverImage,
        author: author.trim() || undefined,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        status,
        metaTitle: metaTitle.trim() || title.trim(),
        metaDescription: metaDescription.trim() || excerpt.trim(),
        publishedAt: status === "published" ? new Date().toISOString() : null,
      };
      const res = await updateAdminBlog(blogId, payload);
      if (res.success) {
        toast.success(res.message || "Blog updated");
        // If slug changed, redirect to new slug URL
        if (payload.slug !== blogSlug) {
          router.push(`/admin/blogs/${payload.slug}`);
        } else {
          router.push("/admin/blogs");
        }
      } else {
        // Handle API field errors
        if (res.errors) {
          setFieldErrors(res.errors);
        }
        toast.error(res.message || "Failed to update blog");
      }
    } catch (_e: unknown) {
      toast.error("Failed to update blog");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/blogs")}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit} disabled={submitting}>
            {submitting ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-white shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <Input
              label="Title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter blog title"
              required
              error={fieldErrors.title}
            />
          </div>
          <div>
            <Input
              label="Slug"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="auto-generated-from-title"
              required
              error={fieldErrors.slug}
            />
          </div>
          <div>
            <Textarea
              label="Excerpt"
              value={excerpt}
              onChange={(e) => onExcerptChange(e.target.value)}
              placeholder="Short summary (max 500 chars)"
              rows={3}
              error={fieldErrors.excerpt}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={contentHtml}
              onChange={onContentChange}
              placeholder="Write your blog content..."
              error={fieldErrors.contentHtml}
            />
            <p className="text-xs text-gray-500">
              Tip: Use toolbar buttons or keyboard shortcuts (Ctrl/Cmd+B/I, etc.).
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 space-y-4">
            <div>
              <Input
                label="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div>
              <Input
                label="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. himalayas, travel"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <Input
                label="Meta Title"
                value={metaTitle}
                onChange={(e) => onMetaTitleChange(e.target.value)}
                placeholder="SEO title (defaults to Title)"
                error={fieldErrors.metaTitle}
              />
            </div>
            <div>
              <Textarea
                label="Meta Description"
                value={metaDescription}
                onChange={(e) => onMetaDescriptionChange(e.target.value)}
                placeholder="SEO description (defaults to Excerpt)"
                rows={3}
                error={fieldErrors.metaDescription}
              />
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Cover Image
            </label>
            {(coverPreview || coverImage) && (
              <img
                src={coverPreview || coverImage}
                alt="Cover"
                className="w-full h-40 object-cover rounded border"
              />
            )}
            <input type="file" accept="image/*" onChange={onFileChange} />
            {uploading && <p className="text-xs text-gray-500">Uploading…</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
