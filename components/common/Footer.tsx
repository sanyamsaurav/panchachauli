"use client";

import { useState } from "react";
import { toast } from "@/components/ui/common";
import { ShopStyleHeader } from "@/components/website/common/ShopStyleCard";
import { Send, Facebook, Instagram, Youtube } from "lucide-react";
import { usePathname } from "next/navigation";
import { getCityBySlug } from "@/lib/data/cities";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pathname = usePathname();

  let currentCity = "Panchachuli";
  if (pathname?.startsWith("/fly/")) {
    const slug = pathname.split("/")[2];
    currentCity = getCityBySlug(slug).name;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setEmail("");
      } else {
        toast.error(data.message || "Failed to subscribe");
      }
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Social Section */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-8">
            <a
              href="https://www.facebook.com/people/Fly-Panchachuli/61585017037047/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group"
            >
              <Facebook className="w-5 h-5 text-gray-600 group-hover:text-white" />
            </a>
            <a
              href="https://www.instagram.com/fly_panchachuli"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all group"
            >
              <Instagram className="w-5 h-5 text-gray-600 group-hover:text-white" />
            </a>
            {/* <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all group"
            >
              <Youtube className="w-5 h-5 text-gray-600 group-hover:text-white" />
            </a> */}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShopStyleHeader
            title="Join Our Mailing List"
            subtitle="Get 10% off your first purchase when you sign up for our newsletter!"
            align="center"
          />

          <form onSubmit={handleSubscribe} className="max-w-xl mx-auto mt-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full uppercase tracking-wider text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {submitting ? "Subscribing..." : (
                  <>
                    Sign Up
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-wider">
            Copyright © 2025 Fly {currentCity} - All Rights Reserved
          </p>
        </div>
      </footer>
    </>
  );
}
