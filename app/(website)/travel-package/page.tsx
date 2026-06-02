import { packages } from "@/lib/data/travel";
import { ShopStyleHero, ShopStyleHeader, ShopStyleCard } from "@/components/website/common/ShopStyleCard";

export default function TravelPackages() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Shop Style */}
      <ShopStyleHero
        title="Adi Kailash"
        accentText="Yatra Packages"
        subtitle="Embark on a spiritual journey to the sacred Adi Kailash. Our curated packages ensure a safe and memorable pilgrimage."
        backgroundImage="/travel/unnamed.png"
        // buttonText="View All Packages"
        // buttonHref="/travel-package"
      />

      {/* Packages Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShopStyleHeader
          title="Travel Packages"
          subtitle="Choose from our carefully designed pilgrimage experiences"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {packages.map((pkg, index) => (
            <ShopStyleCard
              key={index}
              image={pkg.image}
              imageAlt={pkg.title}
              category={`Duration: ${pkg.duration}`}
              title={pkg.title}
              price={pkg.price}
              href={pkg.broucher}
              secondaryAction={{
                text: "Download Brochure",
                href: pkg.broucher,
                external: true,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
