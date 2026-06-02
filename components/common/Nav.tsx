"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Phone } from "lucide-react";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { adventureCities, getCityBySlug } from "@/lib/data/cities";

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  let currentCity = "Panchachuli";
  let slug = "";
  if (pathname?.startsWith("/fly/")) {
    slug = pathname.split("/")[2];
    currentCity = getCityBySlug(slug).name;
  }

  const { whatsappLink } = useWhatsApp("Hi! I would like to get in touch.");

  // Track scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/travel-package", label: "Packages" },
    { href: "/experiences", label: "Experiences" },
    { href: "/shop", label: "Shop" },
    { href: "/blog", label: "Blog" },
    { href: "/school", label: "School" },
  ];

  return (
    <>
      <header
        className={`fixed  top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-black/80 py-3"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className={`text-xl md:text-2xl font-black uppercase tracking-tighter transition-colors ${scrolled ? "text-gray-900" : "text-white"
                  }`}
              >
                Fly<span className="text-blue-600">{currentCity}</span>
              </Link>

              <div className="relative flex items-center">
                <select
                  className={` outline-none cursor-pointer rounded-full px-2 py-1 text-xs font-semibold appearance-none border border-current shadow-sm transition-colors text-transparent w-8 flex justify-center text-center items-center ${scrolled
                    ? "text-transparent bg-gray-100 hover:bg-gray-200"
                    : "text-transparent bg-white/10 hover:bg-white/20"
                    }`}
                  value={pathname?.startsWith("/fly/") ? pathname.split("/")[2] : ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      router.push(`/fly/${e.target.value}`);
                    } else {
                      router.push(`/`);
                    }
                  }}
                >
                  <option value="" className="text-gray-900 bg-white">All Cities</option>
                  {adventureCities.map(city => (
                    <option key={city.slug} value={city.slug} className="text-gray-900 bg-white">
                      {city.name}
                    </option>
                  ))}
                </select>
                <div className={`absolute right-2 pointer-events-none ${scrolled ? "text-gray-900" : "text-white"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all rounded-full ${isActive(item.href)
                    ? scrolled
                      ? "text-blue-600 bg-blue-50"
                      : "text-white bg-white/20"
                    : scrolled
                      ? "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${scrolled ? "bg-blue-600" : "bg-white"
                        }`}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/shop"
                className={`p-2.5 rounded-full transition-all ${scrolled
                  ? "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  : "text-white hover:text-white hover:bg-white/10"
                  }`}
              >
                <ShoppingBag className="w-5 h-5" />
              </Link>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all ${scrolled
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-900 hover:bg-white/90"
                  }`}
              >
                <Phone className="w-4 h-4" />
                Contact
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className={`lg:hidden p-2.5 rounded-full transition-all ${scrolled
                ? "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                : "text-white hover:text-white hover:bg-white/10"
                }`}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Mobile Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="text-xl font-black uppercase tracking-tighter text-gray-900">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Nav Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-4 rounded-2xl text-base font-bold uppercase tracking-wider transition-all ${isActive(item.href)
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="w-2 h-2 bg-white rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile CTA */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-blue-700 transition-all"
            >
              <Phone className="w-5 h-5" />
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}
