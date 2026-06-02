'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, toast } from "@/components/ui/common";
import { uploadAdminImage, createAdminProduct, updateAdminProduct, type CreateProductPayload } from "@/api.services/api.services";
import type { IProduct } from "@/types/models";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

interface ProductFormProps {
    initialData?: IProduct;
    isCustomized?: boolean;
}

export default function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();

    // Basic Info
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialData);
    const [category, setCategory] = useState(initialData?.category || "");
    const [price, setPrice] = useState(initialData?.price || "");
    const [status, setStatus] = useState<"draft" | "published">(initialData?.status || "published");
    const [order, setOrder] = useState<number>(initialData?.order || 0);
    const [image, setImage] = useState<string>(initialData?.image || "");
    const [imagePreview, setImagePreview] = useState<string>("");
    const [description, setDescription] = useState(initialData?.description || "");
    const [features, setFeatures] = useState(initialData?.features?.join(", ") || "");

    // Hero Section
    const [heroTitle, setHeroTitle] = useState(initialData?.hero?.title || "");
    const [heroSubtitle, setHeroSubtitle] = useState(initialData?.hero?.subtitle || "");
    const [heroImage, setHeroImage] = useState(initialData?.hero?.image || "");

    // Section 2
    const [s2Title, setS2Title] = useState(initialData?.section2?.title || "");
    const [s2Desc, setS2Desc] = useState(initialData?.section2?.description || "");
    const [s2Image, setS2Image] = useState(initialData?.section2?.image || "");

    // Section 3
    const [s3Title, setS3Title] = useState(initialData?.section3?.title || "");
    const [s3Desc, setS3Desc] = useState(initialData?.section3?.description || "");
    const [s3Image, setS3Image] = useState(initialData?.section3?.image || "");

    const [uploading, setUploading] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const onTitleChange = (v: string) => {
        setTitle(v);
        if (!slugManuallyEdited) {
            setSlug(slugify(v));
        }
    };

    const onSlugChange = (v: string) => {
        setSlugManuallyEdited(true);
        setSlug(slugify(v));
    };

    const uploadImage = async (file: File, setImageState: (url: string) => void, fieldName: string) => {
        setUploading(fieldName);
        try {
            const res = await uploadAdminImage(file);
            if (res.success && res.data?.url) {
                setImageState(res.data.url);
                toast.success(`${fieldName} uploaded`);
            } else {
                toast.error(res.message || "Upload failed");
            }
        } catch (_err) {
            toast.error("Upload failed");
        } finally {
            setUploading(null);
        }
    };

    const onSubmit = async () => {
        if (!title.trim() || !slug.trim() || !category.trim() || !price.trim() || !image.trim()) {
            return toast.error("Please fill all required basic fields (Title, Slug, Category, Price, List Image)");
        }

        setSubmitting(true);
        try {
            const payload: CreateProductPayload = {
                title: title.trim(),
                slug: slug.trim(),
                category: category.trim(),
                price: price.trim(),
                image,
                description: description.trim() || undefined,
                features: features ? features.split(",").map(f => f.trim()).filter(Boolean) : undefined,
                hero: {
                    title: heroTitle.trim(),
                    subtitle: heroSubtitle.trim(),
                    image: heroImage,
                },
                section2: {
                    title: s2Title.trim(),
                    description: s2Desc.trim(),
                    image: s2Image,
                },
                section3: {
                    title: s3Title.trim(),
                    description: s3Desc.trim(),
                    image: s3Image,
                },
                status,
                order,
            };

            if (initialData) {
                const res = await updateAdminProduct(initialData._id.toString(), payload);
                if (res.success) {
                    toast.success("Product updated successfully");
                    router.push("/admin/products");
                    router.refresh();
                } else {
                    toast.error(res.message || "Failed to update product");
                }
            } else {
                const res = await createAdminProduct(payload);
                if (res.success) {
                    toast.success("Product created successfully");
                    router.push("/admin/products");
                    router.refresh();
                } else {
                    toast.error(res.message || "Failed to create product");
                }
            }
        } catch (_e) {
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    {initialData ? "Edit Product" : "New Product"}
                </h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push("/admin/products")} className="rounded-none">
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={onSubmit} disabled={submitting} className="rounded-none bg-black hover:bg-gray-800">
                        {submitting ? "Saving..." : "Save Product"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="border border-gray-200 p-6 space-y-4 bg-white">
                        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Basic Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Title" value={title} onChange={(e) => onTitleChange(e.target.value)} required className="rounded-none" />
                            <Input label="Slug" value={slug} onChange={(e) => onSlugChange(e.target.value)} required className="rounded-none" />
                            <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} required className="rounded-none" />
                            <Input label="Price" value={price} onChange={(e) => setPrice(e.target.value)} required className="rounded-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">Description (Optional)</label>
                            <textarea
                                className="w-full border border-gray-300 p-2 min-h-[100px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Short description for the product card..."
                            />
                        </div>
                        <Input label="Features (comma separated)" value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Lightweight, Durable, Fast Deployment" className="rounded-none" />
                    </div>

                    {/* Hero Section */}
                    <div className="border border-gray-200 p-6 space-y-4 bg-white">
                        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Hero Section</h2>
                        <Input label="Hero Title" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="rounded-none" />
                        <Input label="Hero Subtitle" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="rounded-none" />
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">Hero Image</label>
                            {heroImage && <img src={heroImage} alt="Hero" className="h-32 object-cover border mb-2" />}
                            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], setHeroImage, 'Hero Image')} />
                            {uploading === 'Hero Image' && <span className="text-xs text-blue-500 ml-2">Uploading...</span>}
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="border border-gray-200 p-6 space-y-4 bg-white">
                        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Section 2</h2>
                        <Input label="Title" value={s2Title} onChange={(e) => setS2Title(e.target.value)} className="rounded-none" />
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">Description</label>
                            <textarea className="w-full border border-gray-300 p-2 min-h-[100px]" value={s2Desc} onChange={(e) => setS2Desc(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">Image</label>
                            {s2Image && <img src={s2Image} alt="Section 2" className="h-32 object-cover border mb-2" />}
                            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], setS2Image, 'Section 2 Image')} />
                            {uploading === 'Section 2 Image' && <span className="text-xs text-blue-500 ml-2">Uploading...</span>}
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="border border-gray-200 p-6 space-y-4 bg-white">
                        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Section 3</h2>
                        <Input label="Title" value={s3Title} onChange={(e) => setS3Title(e.target.value)} className="rounded-none" />
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">Description</label>
                            <textarea className="w-full border border-gray-300 p-2 min-h-[100px]" value={s3Desc} onChange={(e) => setS3Desc(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">Image</label>
                            {s3Image && <img src={s3Image} alt="Section 3" className="h-32 object-cover border mb-2" />}
                            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], setS3Image, 'Section 3 Image')} />
                            {uploading === 'Section 3 Image' && <span className="text-xs text-blue-500 ml-2">Uploading...</span>}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="border border-gray-200 p-6 space-y-4 bg-white">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                            <select className="w-full border border-gray-300 px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")}>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        <Input label="Order" type="number" value={order.toString()} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} placeholder="0" className="rounded-none" />
                    </div>

                    <div className="border border-gray-200 p-6 space-y-3 bg-white">
                        <label className="block text-sm font-semibold text-gray-900">List/Card Image</label>
                        {(imagePreview || image) && <img src={imagePreview || image} alt="Product Card" className="w-full h-40 object-cover border" />}
                        <input type="file" accept="image/*" onChange={(e) => {
                            if (e.target.files?.[0]) {
                                const f = e.target.files[0];
                                const localUrl = URL.createObjectURL(f);
                                setImagePreview(localUrl);
                                uploadImage(f, (url) => { setImage(url); URL.revokeObjectURL(localUrl); setImagePreview(""); }, 'List Image');
                            }
                        }} />
                        {uploading === 'List Image' && <p className="text-xs text-blue-500">Uploading...</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
