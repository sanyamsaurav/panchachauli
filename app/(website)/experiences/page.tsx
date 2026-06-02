
import { getExperiences } from "@/api.services/api.services";
import { ShopStyleHero, ShopStyleHeader } from "@/components/website/common/ShopStyleCard";
import type { IExperience } from "@/types/models";
import { ExperienceCardClient } from "./ExperienceCardClient";
// Force dynamic rendering to avoid prerendering errors during build
export const dynamic = 'force-dynamic';

export default async function ExperiencesPage() {
  // Fetch experiences from API
  let experiences: IExperience[] = [];

  try {
    const result = await getExperiences({ limit: 100 });
    experiences = result.data || [];
  } catch (_err) {
    experiences = [];
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Shop Style */}
      <ShopStyleHero
        title="Curated Local"
        accentText="Adventures"
        subtitle="Discover unique experiences crafted by local experts in the heart of the Himalayas."
        backgroundImage="/exp/download.jpeg"
      // buttonText="Explore Experiences"
      // buttonHref="/experiences"
      />

      {/* Experiences Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShopStyleHeader
          title="Our Experiences"
          subtitle="Adventures designed for every traveler"
        />

        {experiences?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No experiences found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {experiences.map((exp) => (
              <ExperienceCardClient key={exp.slug} exp={exp} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
