"use client";

import { useWhatsApp } from "@/hooks/useWhatsApp";
import { ShopStyleCard } from "@/components/website/common/ShopStyleCard";
import { getImageUrl } from "@/lib/utils/image";
import type { IExperience } from "@/types/models";

export function ExperienceCardClient({ exp }: { exp: IExperience }) {
    const { whatsappLink } = useWhatsApp(`I want to book the experience: ${exp.title}`);

    return (
        <ShopStyleCard
            image={getImageUrl(exp.image)}
            imageAlt={exp.title}
            category={exp.date}
            title={exp.title}
            href={`/experiences/${exp.slug}`}
            secondaryAction={{
                text: "Book Now",
                href: whatsappLink,
                external: true,
            }}
        />
    );
}
