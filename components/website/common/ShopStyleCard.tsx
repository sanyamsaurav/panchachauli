"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";

// Shop-style card with rounded-3xl, aspect-square, hover effects
interface ShopStyleCardProps {
  image: string;
  imageAlt: string;
  category?: string;
  title: string;
  price?: string;
  meta?: string;
  description?: string;
  href: string;
  secondaryAction?: {
    text: string;
    href: string;
    external?: boolean;
  };
}

export function ShopStyleCard({
  image,
  imageAlt,
  category,
  title,
  price,
  meta,
  description,
  href,
  secondaryAction,
}: ShopStyleCardProps) {
  return (
    <div className="group cursor-pointer">
      {/* Image Container - aspect-square with rounded-3xl */}
      <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden mb-6 border border-gray-100 transition-all group-hover:shadow-xl ">
        <img
          src={image}
          alt={imageAlt}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      {/* Content */}
      <div className="space-y-1">
        {/* Category/Meta */}
        {(category || meta) && (
          <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            {category || meta}
          </p>
        )}

        {/* Title and Price Row */}
        <div className="flex flex-col justify-between items-start gap-4">
          <h3 className="text-2xl font-black text-gray-900  transition-colors uppercase">
            {title}
          </h3>
          {price && (
            <p className="text-xl font-bold text-gray-900 whitespace-nowrap">
              {price}
            </p>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4">
          <Link
            href={href}
            className="inline-flex items-center text-gray-900 font-bold uppercase tracking-widest text-xs group/btn"
          >
            View Details
            <MoveRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
          </Link>

          {secondaryAction && (
            <>
              <span className="text-gray-300">|</span>
              {secondaryAction.external ? (
                <a
                  href={secondaryAction.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 font-bold uppercase tracking-widest text-xs hover:text-blue-700"
                >
                  {secondaryAction.text}
                </a>
              ) : (
                <Link
                  href={secondaryAction.href}
                  className="inline-flex items-center text-blue-600 font-bold uppercase tracking-widest text-xs hover:text-blue-700"
                >
                  {secondaryAction.text}
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Shop-style hero section
interface ShopStyleHeroProps {
  title: string;
  accentText?: string;
  subtitle: string;
  backgroundImage: string;
  buttonText?: string;
  buttonHref?: string;
  isCentered?: boolean;
}

export function ShopStyleHero({
  title,
  accentText,
  subtitle,
  backgroundImage,
  buttonText,
  buttonHref,
  isCentered = false,
}: ShopStyleHeroProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with Gradient and Overlay */}
      <div className="absolute inset-0 bg-black">
        <div
          className="absolute inset-0 opacity-50 bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
        <div
          className={`absolute inset-0 ${
            isCentered
              ? "bg-black/70"
              : "bg-gradient-to-r from-black via-black/80 to-transparent"
          }`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`${
            isCentered ? "w-full text-center" : "lg:w-1/2"
          }`}
        >
          <h2
            className={`text-4xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-6 ${
              isCentered ? "mx-auto" : ""
            }`}
          >
            {title} <br />
            {accentText && (
              <span className="text-blue-500">{accentText}</span>
            )}
          </h2>
          <p
            className={`text-xl text-gray-300 mb-10 leading-relaxed ${
              isCentered ? "max-w-2xl mx-auto" : "max-w-lg"
            }`}
          >
            {subtitle}
          </p>
          {buttonText && buttonHref && (
            <Link
              href={buttonHref}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full uppercase tracking-wider text-sm transition-all inline-flex items-center group ${
                isCentered ? "mx-auto" : ""
              }`}
            >
              {buttonText}
              <MoveRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

// Shop-style section header
interface ShopStyleHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    text: string;
    href: string;
  };
  align?: "left" | "center";
}

export function ShopStyleHeader({ title, subtitle, action, align = "left" }: ShopStyleHeaderProps) {
  if (align === "center") {
    return (
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-2">
          {title}
        </h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center text-gray-900 font-bold uppercase tracking-widest text-xs mt-4 group"
          >
            {action.text}
            <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-between items-end mb-12">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-2">
          {title}
        </h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="hidden md:inline-flex items-center text-gray-900 font-bold uppercase tracking-widest text-xs group"
        >
          {action.text}
          <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </Link>
      )}
    </div>
  );
}

// Filter buttons
interface FilterButtonsProps {
  filters: string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export function FilterButtons({ filters, activeFilter = "All", onFilterChange }: FilterButtonsProps) {
  return (
    <div className="hidden md:flex gap-2 mb-8">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange?.(filter)}
          className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
            filter === activeFilter
              ? "bg-gray-900 text-white"
              : "border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
