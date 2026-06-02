"use client";

import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  button?: {
    text: string;
    href: string;
  };
  overlayOpacity?: string;
  height?: string;
  align?: "center" | "left";
}

export function PageHero({
  title,
  subtitle,
  backgroundImage,
  button,
  overlayOpacity = "bg-black/50",
  height = "h-[60vh]",
  align = "center",
}: PageHeroProps) {
  const contentClass = align === "center" 
    ? "flex flex-col justify-center items-center text-center" 
    : "flex flex-col justify-center";

  return (
    <section className={`relative ${height} ${contentClass}`}>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      
      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayOpacity}`} />
      
      {/* Content */}
      <div className="relative z-10 px-4 max-w-7xl mx-auto w-full">
        {align === "center" ? (
          <>
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-6">
                {subtitle}
              </p>
            )}
            {button && (
              <Link
                href={button.href}
                className="inline-flex items-center border-2 border-white px-8 py-3 text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all"
              >
                {button.text}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            )}
          </>
        ) : (
          <div className="lg:w-1/2">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
                {subtitle}
              </p>
            )}
            {button && (
              <Link
                href={button.href}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full uppercase tracking-wider text-sm transition-all"
              >
                {button.text}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// Dark Hero with gradient overlay (like ShopSection)
interface DarkHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  button: {
    text: string;
    href: string;
  };
  accentText?: string;
}

export function DarkHero({
  title,
  subtitle,
  backgroundImage,
  button,
  accentText,
}: DarkHeroProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with Gradient and Overlay */}
      <div className="absolute inset-0 bg-black">
        <div
          className="absolute inset-0 opacity-50 bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:w-1/2">
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            {title} <br />
            {accentText && (
              <span className="text-blue-500">{accentText}</span>
            )}
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-lg leading-relaxed">
            {subtitle}
          </p>
          <Link
            href={button.href}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full uppercase tracking-wider text-sm transition-all inline-flex items-center group"
          >
            {button.text}
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
