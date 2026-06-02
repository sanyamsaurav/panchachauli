"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getExperiences } from "@/api.services/api.services";
import { getImageUrl } from "@/lib/utils/image";
import { ShopStyleHeader, ShopStyleCard } from "@/components/website/common/ShopStyleCard";
import type { IExperience } from "@/types/models";
import { useWhatsApp } from "@/hooks/useWhatsApp";

export function Experiences() {
  const router = useRouter();
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const { createLink } = useWhatsApp();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const result = await getExperiences({ limit: 3 });
        setExperiences(result.data || []);
      } catch (_err) {
        console.error("Failed to fetch experiences");
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading experiences...</p>
        </div>
      </section>
    );
  }

  if (experiences.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <ShopStyleHeader
        title="Our Experiences"
        subtitle="Curated local adventures"
        action={{ text: "View All", href: "/experiences" }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {experiences.map((exp) => (
          <ShopStyleCard
            key={exp.slug}
            image={getImageUrl(exp.image)}
            imageAlt={exp.title}
            category={exp.date}
            title={exp.title}
            href={`/experiences/${exp.slug}`}
            secondaryAction={{
              text: "Book Now",
              href: createLink(`I want to book the experience: ${exp.title}`),
              external: true,
            }}
          />
        ))}
      </div>
    </section>
  );
}
