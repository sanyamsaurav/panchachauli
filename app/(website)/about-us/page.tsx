"use client";

import { teamMembers } from "@/lib/data/team";
import { ShopStyleHero, ShopStyleHeader } from "@/components/website/common/ShopStyleCard";
import { usePathname } from "next/navigation";
import { getCityBySlug } from "@/lib/data/cities";

export default function OurTeam() {
  const pathname = usePathname();
  let citySlug = "panchachuli";
  if (pathname?.startsWith("/fly/")) {
    citySlug = pathname.split("/")[2];
  }
  const cityData = getCityBySlug(citySlug);
  const isPanchachuli = cityData.slug === "panchachuli";
  const cityName = cityData.name;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Shop Style */}
      <ShopStyleHero
        title="Meet Our"
        accentText="Team"
        subtitle={`The passionate individuals behind Fly ${cityName} who make every adventure possible.`}
        backgroundImage="/hero.webp"
      // buttonText="Learn More"
      // buttonHref="/about-us"
      />

      {/* About Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">
          About Fly {cityName}
        </p>
        <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-6">
          Our Story
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Fly {cityName} is a {isPanchachuli ? "Himalayan adventure and paragliding platform rooted in the Panchachuli region of Uttarakhand" : `paragliding-focused adventure platform based in ${cityName}`}. We're here to make mountain flying and outdoor
          experiences safe, accessible, and unforgettable—guided by certified pilots and
          local experts who know these valleys, peaks, and weather windows inside out.
        </p>
      </section>

      {/* Team Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShopStyleHeader
          title="Our Team"
          subtitle="The experts behind your adventures"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {teamMembers.map((member, index) => (
            <div key={index} className="group cursor-pointer text-center">
              {/* Image Container - aspect-square with rounded-3xl */}
              <div className="relative aspect-[3/4] bg-gray-50 rounded-3xl overflow-hidden mb-6 border border-gray-100 transition-all group-hover:shadow-xl group-hover:-translate-y-2">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                  {member.role}
                </p>
                <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-700 transition-colors uppercase">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
