"use client";

import { useState, type FormEvent } from "react";
import { toast } from "@/components/ui/common";
import { ShopStyleHero, ShopStyleHeader } from "@/components/website/common/ShopStyleCard";
import { Send, MapPin, Phone, Mail, Instagram, Youtube, Facebook, MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { defaultCity } from "@/lib/data/cities";

// Validation functions
const validateEmail = (email: string): boolean => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const validatePhone = (phone: string): boolean => {
  return /^\+?[0-9\s\-\(\)]{10,20}$/.test(phone);
};

export default function SchoolPage() {
  const { settings, phoneForDisplay, createWhatsAppLink } = useSettings();
  const cityData = defaultCity;
  
  // Create WhatsApp link with school-specific message
  const whatsappLink = createWhatsAppLink("Hi! I'm interested in the paragliding school. Please share details.");
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.location.trim() || formData.location.trim().length < 2) {
      newErrors.location = "Location is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (10-20 digits)";
    }

    if (!formData.message.trim() || formData.message.trim().length < 2) {
      newErrors.message = "Message must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/school", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          location: formData.location.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        toast.success(data.message || "Your inquiry has been submitted successfully!");
        setFormData({
          name: "",
          location: "",
          email: "",
          phone: "",
          message: "",
        });
        setErrors({});
      } else {
        const errorMessage =
          data?.error || data?.message || "Failed to submit inquiry. Please try again.";
        toast.error(errorMessage);
      }
    } catch (_error: unknown) {
      toast.error("Failed to submit inquiry. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <ShopStyleHero
        title="Paragliding"
        accentText="School"
        subtitle="Learn to fly with the best instructors in the Himalayas. From beginner courses to advanced cross-country training, we offer comprehensive paragliding education."
        backgroundImage="/training.jpg"
      />

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShopStyleHeader
            title="Fill up & Submit"
            subtitle="Get in touch with our school for enrollment and course details"
            align="center"
          />

          <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            {/* Row 1: Name and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder-gray-400 ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Your Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder-gray-400 ${
                    errors.location
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                )}
              </div>
            </div>

            {/* Row 2: Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder-gray-400 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 12345 67890"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder-gray-400 ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us about your paragliding goals and any questions you have..."
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-5 py-4 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder-gray-400 resize-none ${
                  errors.message
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gray-900 hover:bg-black text-white font-bold py-4 px-12 rounded-full uppercase tracking-wider text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-3"
              >
                {submitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Map and Contact Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
            {/* Map */}
            <div className="relative h-[400px] lg:h-full bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d220826.55693488003!2d80.17203205382692!3d30.139550322046055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sPanchachuli%20Munsyari%2C%20Uttarakhand%2C%20India%20map!5e0!3m2!1sen!2sin!4v1772948977809!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location Map"
                className="absolute inset-0"
              />
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 lg:p-12 flex flex-col justify-center text-white">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
                Let&apos;s Connect
              </h3>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Have a question about our school? Want to start your paragliding journey?
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

              {/* Contact Details */}
              <div className="space-y-4 text-gray-400">
                <div>
                  <p className="text-white font-bold uppercase tracking-wider text-sm mb-1">
                    Location
                  </p>
                  <p>Fly {settings.organizationName}</p>
                  <p>{settings.address || cityData.address}</p>
                </div>

                <div>
                  <p className="text-white font-bold uppercase tracking-wider text-sm mb-1">
                    Contact
                  </p>
                  <p>{phoneForDisplay}</p>
                  <p>{settings.email}</p>
                </div>

                <div>
                  <p className="text-white font-bold uppercase tracking-wider text-sm mb-1">
                    Hours
                  </p>
                  <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              {/* Social Media */}
              {/* <div className="mt-8 pt-8 border-t border-gray-700">
                <p className="font-bold text-white uppercase tracking-wider text-sm mb-4">
                  Connect With Us
                </p>
                <div className="flex gap-4">
                    
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 rounded-xl flex items-center justify-center transition-all"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                </div> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop"
          alt="Paragliding group in mountains"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
              Join Our School
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Experience the thrill of flight with expert instructors and world-class training programs
            </p>
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShopStyleHeader
            title="Our Courses"
            subtitle="Comprehensive training programs for all skill levels"
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Course Card 1 */}
            <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700 hover:border-blue-500 transition-all group">
              <div className="text-blue-500 text-sm font-bold uppercase tracking-widest mb-2">
                Beginner
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
                Discovery Course
              </h3>
              <p className="text-gray-400 mb-6">
                Perfect introduction to paragliding. Learn the basics and take your first solo flights.
              </p>
              <div className="text-white font-bold text-xl">₹15,000</div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700 hover:border-blue-500 transition-all group">
              <div className="text-blue-500 text-sm font-bold uppercase tracking-widest mb-2">
                Intermediate
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
                Pilot License
              </h3>
              <p className="text-gray-400 mb-6">
                Complete P1/P2 certification course with extensive flight training and theory.
              </p>
              <div className="text-white font-bold text-xl">₹45,000</div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700 hover:border-blue-500 transition-all group">
              <div className="text-blue-500 text-sm font-bold uppercase tracking-widest mb-2">
                Advanced
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
                XC Training
              </h3>
              <p className="text-gray-400 mb-6">
                Cross-country flying techniques, thermaling, and advanced maneuver training.
              </p>
              <div className="text-white font-bold text-xl">₹75,000</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
