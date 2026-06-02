'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getAdminProductById } from "@/api.services/api.services";
import type { IProduct } from "@/types/models";
import { toast } from "@/components/ui/common";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await getAdminProductById(params.id as string);
                if (res.success && res.data) {
                    setProduct(res.data);
                } else {
                    toast.error("Failed to load product");
                    router.push("/admin/products");
                }
            } catch (_err) {
                toast.error("Failed to load product");
                router.push("/admin/products");
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchProduct();
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (!product) return null;

    return <ProductForm initialData={product} />;
}
