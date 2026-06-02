"use client"

import { useRouter } from "next/navigation";
import { packages } from "@/lib/data/travel";
import { ShopStyleHeader, ShopStyleCard } from "@/components/website/common/ShopStyleCard";

export function Travel() {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <ShopStyleHeader
        title="Travel Packages"
        subtitle="Curated Adi Kailash Experiences"
        action={{ text: "View All", href: "/travel-package" }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {packages.slice(0, 3).map((pkg, index) => (
          <ShopStyleCard
            key={index}
            image={pkg.image}
            imageAlt={pkg.title}
            category={`Duration: ${pkg.duration}`}
            title={pkg.title}
            price={pkg.price}
            href={pkg.broucher}
            secondaryAction={{
              text: "Download",
              href: pkg.broucher,
              external: true,
            }}
          />
        ))}
      </div>
    </section>
  );
}
