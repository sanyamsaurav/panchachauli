"use client";

import { useState, useEffect } from "react";
import { ShopStyleHero, ShopStyleHeader, ShopStyleCard, FilterButtons } from "@/components/website/common/ShopStyleCard";
import { getProducts } from "@/api.services/api.services";
import type { IProduct } from "@/types/models";
import { Loader2 } from "lucide-react";

export default function ShopPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getProducts({ limit: 100 });
        if (result.success && result.data) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extract unique categories for the filters
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <ShopStyleHero
        title="Gear Up For"
        accentText="Your Next Adventure"
        subtitle="Discover our curated selection of professional paragliding equipment, from the latest G-Lite rescues to premium harnesses and accessories."
        backgroundImage="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"
      />

      {/* Products Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShopStyleHeader
          title="Featured Equipment"
          subtitle="Hand-picked gear for maximum safety and performance."
        />

        {/* Filter Buttons */}
        <FilterButtons
          filters={categories.length > 1 ? categories : ["All", "Rescues", "Harnesses", "Accessories"]}
          activeFilter="All"
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 min-h-[400px]">
          {loading ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <ShopStyleCard
                key={product._id.toString()}
                image={product.image}
                imageAlt={product.title}
                category={product.category}
                title={product.title}
                price={product.price}
                href={`/shop/${product.slug}`}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
              No products found at the moment. Please check back later!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
