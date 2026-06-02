"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input, Button, toast } from "@/components/ui/common";
import RichTextEditor from "@/components/ui/common/RichTextEditor";
import { uploadAdminImage, getAdminExperienceBySlug, updateAdminExperience } from "@/api.services/api.services";
import { Loader2 } from "lucide-react";
import type { IExperience } from "@/types/models";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const experienceSlug = params.slug as string;

  const [experienceId, setExperienceId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [order, setOrder] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await getAdminExperienceBySlug(experienceSlug);
        if (res.success && res.data) {
          const exp: IExperience = res.data;
          setExperienceId(exp._id.toString());
          setTitle(exp.title);
          setSlug(exp.slug);
          setImage(exp.image);
          setDate(exp.date || "");
          setContent(exp.content);
          setStatus(exp.status as "draft" | "published");
          setOrder(exp.order);
        } else {
          toast.error("Experience not found");
          router.push("/admin/experiences");
        }
      } catch (_err: unknown) {
        toast.error("Failed to load experience");
        router.push("/admin/experiences");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [experienceSlug, router]);

  const onTitleChange = (v: string) => {
    setTitle(v);
    // Auto-update slug only if user hasn't manually edited it
    if (!slugManuallyEdited) {
      setSlug(slugify(v));
    }
  };

  const onSlugChange = (v: string) => {
    setSlugManuallyEdited(true);
    setSlug(slugify(v));
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const localUrl = URL.createObjectURL(f);
    setImagePreview(localUrl);
    setUploading(true);
    try {
      const res = await uploadAdminImage(f);
      if (res.success && res.data?.url) {
        setImage(res.data.url);
        toast.success("Image uploaded");
        URL.revokeObjectURL(localUrl);
        setImagePreview("");
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
    if (!title.trim()) return toast.error("Title is required");
    if (!slug.trim()) return toast.error("Slug is required");
    if (!image.trim()) return toast.error("Image is required");
    if (!content.trim()) return toast.error("Content is required");

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slugify(slug),
        image,
        date: date.trim() || undefined,
        content,
        status,
        order,
      };
      const res = await updateAdminExperience(experienceId, payload);
      if (res.success) {
        toast.success(res.message || "Experience updated");
        if (payload.slug !== experienceSlug) {
          router.push(`/admin/experiences/${payload.slug}`);
        } else {
          router.push("/admin/experiences");
        }
      } else {
        toast.error(res.message || "Failed to update experience");
      }
    } catch (_e: unknown) {
      toast.error("Failed to update experience");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Experience</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/experiences")} className="rounded-none">
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit} disabled={submitting} className="rounded-none bg-black hover:bg-gray-800">
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-gray-200 p-6 space-y-4 bg-white">
          <Input
            label="Title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter experience title"
            required
            className="rounded-none"
          />
          <Input
            label="Slug"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="auto-generated-from-title"
            required
            className="rounded-none"
          />
          <Input
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="e.g. Feb 10, 2026"
            className="rounded-none"
          />

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Content
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your experience content..."
              minHeight="300px"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 p-6 space-y-4 bg-white">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Status
              </label>
              <select
                className="w-full border border-gray-300 px-3 py-2"
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <Input
              label="Order"
              type="number"
              value={order.toString()}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="rounded-none"
            />
          </div>

          <div className="border border-gray-200 p-6 space-y-3 bg-white">
            <label className="block text-sm font-semibold text-gray-900">
              Image
            </label>
            {(imagePreview || image) && (
              <img
                src={imagePreview || image}
                alt="Experience"
                className="w-full h-40 object-cover border"
              />
            )}
            <input type="file" accept="image/*" onChange={onFileChange} />
            {uploading && <p className="text-xs text-gray-500">Uploading...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
