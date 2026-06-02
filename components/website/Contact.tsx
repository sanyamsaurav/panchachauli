"use client";

import { useState, type FormEvent } from "react";
import { toast } from "@/components/ui/common";
import { ShopStyleHeader } from "@/components/website/common/ShopStyleCard";
import { Send, MessageCircle } from "lucide-react";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { CityData, defaultCity } from "@/lib/data/cities";

export default function Contact({ cityData = defaultCity }: { cityData?: CityData }) {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { whatsappLink } = useWhatsApp("Hi! I have a question and would like to connect.");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          mobileNumber,
          email: email.trim() || undefined,
          message,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        toast.success(data.message || "Message sent successfully");
        setFullName("");
        setMobileNumber("");
        setEmail("");
        setMessage("");
      } else {
        const errorMessage =
          data?.error || data?.message || "Failed to send message. Please try again.";
        toast.error(errorMessage);
      }
    } catch (_error: unknown) {
      toast.error("Failed to send message. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShopStyleHeader
          title="Contact Us"
          subtitle="We'd love to hear from you"
          align="center"
        />

        <div className="grid md:grid-cols-2 gap-16 mt-12">
          {/* Form */}
          <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-6 text-blue-400">
              Get in Touch
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d+]/g, "");
                    const cleanedValue = value.replace(/(?!^)\+/g, "");
                    if (cleanedValue.length <= 16) {
                      setMobileNumber(cleanedValue);
                    }
                  }}
                  className="w-full px-5 py-4 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder-gray-500"
                  inputMode="tel"
                  pattern="^\+?[0-9]{10,15}$"
                  maxLength={16}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Enter your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-900 border border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder-gray-500 resize-none"
                  minLength={2}
                  maxLength={2000}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full uppercase tracking-wider text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
              Let&apos;s Connect
            </h3>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Have a question about our services? Want to plan your next adventure?
              We&apos;d love to hear from you! Reach out and we&apos;ll get back to you as soon as possible.
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full uppercase tracking-wider text-sm transition-all mb-8 w-fit"
            >
              <MessageCircle className="w-5 h-5" />
              Message us on WhatsApp
            </a>

            <div className="space-y-4 text-gray-400">
              <div>
                <p className="text-white font-bold uppercase tracking-wider text-sm mb-1">
                  Location
                </p>
                <p>Fly {cityData.name}</p>
                <p>{cityData.address}</p>
              </div>

              <div>
                <p className="text-white font-bold uppercase tracking-wider text-sm mb-1">
                  Contact
                </p>
                <p>+91 89307 90652</p>
                <p>info@flypanchachuli.com</p>
              </div>

              <div>
                <p className="text-white font-bold uppercase tracking-wider text-sm mb-1">
                  Hours
                </p>
                <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
