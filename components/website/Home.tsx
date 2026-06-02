"use client";

import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import Contact from "./Contact";
import { Travel } from "./travel";
import { Blog } from "./blog";
import { Experiences } from "./experiences";
import { ShopStyleHero, ShopStyleHeader } from "@/components/website/common/ShopStyleCard";
import { CityData, defaultCity } from "@/lib/data/cities";

export default function Home({ cityData = defaultCity }: { cityData?: CityData }) {
  const isPanchachuli = cityData.slug === "panchachuli";
  const cityName = cityData.name;

  return (
    <>
      {/* HERO - Shop Style */}
      <ShopStyleHero
        title={isPanchachuli ? "Explore Incredible" : `Fly ${cityName}`}
        accentText={isPanchachuli ? "Destinations" : ""}
        subtitle={`Discover breathtaking travel experiences with us today! Fly through the majestic ${isPanchachuli ? 'Himalayas' : 'skies of ' + cityName} and create memories that last a lifetime.`}
        backgroundImage="/hero.webp"
        buttonText="Start Your Journey"
        buttonHref="/travel-package"
        isCentered={true}
      />

      {/* DISCOVER - Shop Style */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image with shop-style rounded-3xl */}
          <div className="relative aspect-[4/3] bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
            <Image
              src="/mountain.webp"
              alt="Mountain"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="text-left">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">
              Discover Your Next Adventure
            </p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900 mb-6">
              Explore Exotic Destinations
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Fly {cityName} is a paragliding-focused adventure brand based in
              {isPanchachuli ? " the Panchachuli Himalayas of Uttarakhand" : ` ${cityName}`}. We offer safe,
              professionally guided paragliding experiences that let you
              witness the grandeur of deep valleys, alpine landscapes, and
              snow-clad peaks from the sky.
            </p>
            <Link
              href="/about-us"
              className="inline-flex items-center text-gray-900 font-bold uppercase tracking-widest text-sm group"
            >
              Learn More About Us
              <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Travel Packages */}
      <Travel />

      {/* Shop Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShopStyleHeader
          title="Our Shop"
          subtitle="Professional paragliding equipment"
          action={{ text: "View All Products", href: "/shop" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              id: "g-lite-2",
              name: "G-Lite 2 Rescue",
              category: "Square Parachute",
              price: "₹8,500",
              image: "/rescues/square/g-lite-2/parachute.png",
              link: "/shop",
            },
            {
              id: "bolero-7",
              name: "Bolero 7",
              category: "Beginner Glider",
              price: "₹1,85,000",
              image: "/rescues/square/g-lite-2/parachute.png",
              link: "/shop",
            },
            {
              id: "yeti-6",
              name: "Yeti 6",
              category: "Lightweight Glider",
              price: "₹1,45,000",
              image: "/rescues/square/g-lite-2/parachute.png",
              link: "/shop",
            },
          ].map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden mb-6 border border-gray-100 transition-all group-hover:shadow-xl group-hover:-translate-y-2">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                  {product.category}
                </p>
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-700 transition-colors uppercase">
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold text-gray-900">
                    {product.price}
                  </p>
                </div>
                <Link
                  href={product.link}
                  className="inline-flex items-center text-gray-900 font-bold uppercase tracking-widest text-xs pt-4 group/btn"
                >
                  View Details
                  <MoveRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY - Shop Style */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShopStyleHeader
            title="Our Gallery"
            subtitle="Explore the world through our stunning gallery"
            align="center"
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "gallary_1.webp",
              "gallary_2.webp",
              "gallary_3.webp",
              "gallary_4.webp",
              "gallary_5.webp",
              "gallary_6.webp",
            ].map((img, index) => (
              <div
                key={index}
                className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group cursor-pointer"
              >
                <Image
                  src={`/${img}`}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences */}
      <Experiences />

      {/* Blog */}
      <Blog />

      {/* Contact */}
      <Contact cityData={cityData} />
    </>
  );
}
