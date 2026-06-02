"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/api.services/api.services";
import DynamicProductFeature from "@/components/website/products/DynamicProductFeature";
import type { IProduct } from "@/types/models";
import { Loader2 } from "lucide-react";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    // In Next.js 15+ accessing params in client components requires unwrapping it utilizing React.use
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;

    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getProductBySlug(slug);
                if (result.success && result.data) {
                    setProduct(result.data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-slate-500 animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        notFound();
    }

    return <DynamicProductFeature product={product} />;
}
