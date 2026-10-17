"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  FileText,
  Compass,
  ShoppingBag,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Send,
  User,
  Filter,
} from "lucide-react";
import {
  Button,
  Input,
  toast,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/common";
import type { IContact, ISchoolAspirant } from "@/types/models";
import type { AdminDashboardData } from "@/api.services/api.services";
import { updateAdminContactStatus } from "@/api.services/api.services";

interface AdminDashboardClientProps {
  initialData: AdminDashboardData;
}

function cleanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length === 10) {
    return `91${digits}`; // Default to India prefix if 10 digits
  }
  return digits;
}

export default function AdminDashboardClient({
  initialData,
}: AdminDashboardClientProps) {
  const [data, setData] = useState<AdminDashboardData>(initialData);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"website" | "school">("website");
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isUpdatingStatus, startStatusTransition] = useTransition();

  // Fetch updated dashboard data
  const refreshDashboard = async (showToast = true) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          setData(json.data);
          setLastRefreshed(new Date());
          if (showToast) {
            toast.success("Dashboard updated with latest enquiries");
          }
        }
      } else {
        if (showToast) toast.error("Failed to refresh dashboard");
      }
    } catch {
      if (showToast) toast.error("Network error while refreshing dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 45 seconds to catch new enquiries
  useEffect(() => {
    const timer = setInterval(() => {
      refreshDashboard(false);
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  // Handle status update
  const handleStatusChange = async (
    contactId: string,
    newStatus: "new" | "read" | "replied" | "archived"
  ) => {
    // Optimistic update
    setData((prev) => {
      const updatedList = prev.recentContacts.map((c) =>
        c._id.toString() === contactId ? ({ ...c, status: newStatus } as IContact) : c
      );
      return {
        ...prev,
        recentContacts: updatedList,
      };
    });

    if (selectedContact && selectedContact._id.toString() === contactId) {
      setSelectedContact((prev) => (prev ? ({ ...prev, status: newStatus } as IContact) : null));
    }

    startStatusTransition(async () => {
      try {
        const res = await updateAdminContactStatus(contactId, newStatus);
        if (res.success) {
          toast.success(`Enquiry marked as ${newStatus}`);
          // Re-sync stats in background
          refreshDashboard(false);
        } else {
          toast.error(res.message || "Failed to update status");
        }
      } catch {
        toast.error("Error updating enquiry status");
      }
    });
  };

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return (data.recentContacts || []).filter((contact) => {
      const matchesStatus =
        statusFilter === "all" ? true : contact.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        contact.fullName.toLowerCase().includes(q) ||
        contact.mobileNumber.toLowerCase().includes(q) ||
        (contact.email && contact.email.toLowerCase().includes(q)) ||
        contact.message.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [data.recentContacts, statusFilter, searchQuery]);

  const newEnquiriesCount = data.newContactsCount ?? 0;
  const totalEnquiriesCount = data.totalContacts ?? 0;

  const formatStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
            New
          </span>
        );
      case "read":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            <Clock className="h-3 w-3 text-gray-500" />
            Read
          </span>
        );
      case "replied":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Replied
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Admin Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Monitoring
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            View customer enquiries, paragliding bookings, and website activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshDashboard(true)}
            disabled={loading}
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 text-gray-600 ${loading ? "animate-spin text-primary" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Link href="/admin/contacts">
            <Button
              size="sm"
              className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 shadow-sm"
            >
              <Mail className="h-4 w-4" />
              <span>All Enquiries</span>
              {newEnquiriesCount > 0 && (
                <span className="ml-1 rounded-full bg-amber-500 px-2 py-0.2 text-[11px] font-bold text-white">
                  {newEnquiriesCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* New Enquiries Alert Banner */}
      {newEnquiriesCount > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 p-5 text-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                <AlertCircle className="h-6 w-6 text-white animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {newEnquiriesCount} New Customer {newEnquiriesCount === 1 ? "Enquiry" : "Enquiries"} Waiting!
                </h3>
                <p className="text-sm text-amber-50/90 mt-0.5">
                  Visitors on the website have reached out through the contact form. Prompt replies boost customer conversions.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setStatusFilter("new")}
                className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-amber-900 hover:bg-amber-50 transition-colors shadow-sm"
              >
                Filter New Enquiries
              </button>
              <Link
                href="/admin/contacts"
                className="rounded-lg bg-black/20 hover:bg-black/30 px-3.5 py-2 text-sm font-semibold text-white border border-white/20 transition-colors"
              >
                Open Inbox →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Customer Enquiries Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-200 transition-all hover:shadow-md hover:border-blue-200 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Customer Enquiries
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-black text-gray-900">
                  {totalEnquiriesCount}
                </p>
                {newEnquiriesCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                    {newEnquiriesCount} New
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {data.contactsStats?.replied ?? 0} replied · {data.contactsStats?.read ?? 0} read
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 group-hover:scale-110 transition-transform">
              <Mail className="h-6 w-6" />
            </div>
          </div>
          <Link
            href="/admin/contacts"
            className="mt-4 inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 gap-1"
          >
            Manage Enquiries <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* School Aspirants Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-200 transition-all hover:shadow-md hover:border-purple-200 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                School Inquiries
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-black text-gray-900">
                  {data.totalSchoolAspirants ?? 0}
                </p>
                {(data.newSchoolCount ?? 0) > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-full bg-purple-100 text-purple-800">
                    {data.newSchoolCount} New
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Paragliding course applicants
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600 group-hover:scale-110 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>
          <Link
            href="/admin/school"
            className="mt-4 inline-flex items-center text-xs font-bold text-purple-600 hover:text-purple-800 gap-1"
          >
            View Applicants <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Products & Gear Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-200 transition-all hover:shadow-md hover:border-emerald-200 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Shop Gear & Products
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-black text-gray-900">
                  {data.totalProducts ?? 0}
                </p>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Paragliding gear listed online
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 group-hover:scale-110 transition-transform">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
          <Link
            href="/admin/products"
            className="mt-4 inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-800 gap-1"
          >
            Manage Gear <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Experiences & Blogs Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-200 transition-all hover:shadow-md hover:border-amber-200 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Content & Experiences
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-black text-gray-900">
                  {(data.totalBlogs ?? 0) + (data.totalExperiences ?? 0)}
                </p>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {data.totalBlogs ?? 0} blogs · {data.totalExperiences ?? 0} experiences
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 group-hover:scale-110 transition-transform">
              <Compass className="h-6 w-6" />
            </div>
          </div>
          <Link
            href="/admin/blogs"
            className="mt-4 inline-flex items-center text-xs font-bold text-amber-600 hover:text-amber-800 gap-1"
          >
            View Articles <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Main Section: Recent Customer Enquiries Feed */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        {/* Section Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Customer Enquiries
                  {newEnquiriesCount > 0 && (
                    <span className="rounded-full bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 font-bold">
                      {newEnquiriesCount} new
                    </span>
                  )}
                </h2>
                <p className="text-xs text-gray-500">
                  Customers requesting info, bookings, or flight details from the website
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/admin/contacts">
                <Button variant="outline" size="sm" className="text-xs font-semibold">
                  View Full Inbox ({totalEnquiriesCount})
                </Button>
              </Link>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All" },
                { id: "new", label: "New", count: data.contactsStats?.new },
                { id: "read", label: "Read", count: data.contactsStats?.read },
                { id: "replied", label: "Replied", count: data.contactsStats?.replied },
                { id: "archived", label: "Archived", count: data.contactsStats?.archived },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setStatusFilter(pill.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    statusFilter === pill.id
                      ? "bg-black text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{pill.label}</span>
                  {typeof pill.count === "number" && pill.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        statusFilter === pill.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {pill.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search name, phone, message…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Enquiries List / Table */}
        <div className="divide-y divide-gray-100">
          {filteredContacts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-100">
                <Mail className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-gray-900">
                No customer enquiries found
              </h3>
              <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                {searchQuery || statusFilter !== "all"
                  ? "Try clearing your search query or status filter to see other enquiries."
                  : "When a website visitor fills out the Contact form, their details will appear here instantly."}
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                >
                  Reset filters
                </button>
              )}
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const waNumber = cleanPhoneForWhatsApp(contact.mobileNumber);
              const waText = encodeURIComponent(
                `Hello ${contact.fullName}, thank you for contacting Fly Panchachauli. We received your enquiry and would love to help!`
              );
              const waUrl = `https://wa.me/${waNumber}?text=${waText}`;

              return (
                <div
                  key={contact._id.toString()}
                  className={`p-5 transition-colors hover:bg-gray-50/80 ${
                    contact.status === "new" ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left: Customer Info & Message */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Avatar initials */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-black text-white font-bold text-sm shadow-sm">
                        {contact.fullName.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm">
                            {contact.fullName}
                          </h4>
                          {formatStatusBadge(contact.status)}
                          <span className="text-xs text-gray-400">
                            •{" "}
                            {new Date(contact.createdAt).toLocaleString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Contact details */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                          <a
                            href={`tel:${contact.mobileNumber}`}
                            className="inline-flex items-center gap-1 hover:text-black font-medium transition-colors"
                            title="Click to Call"
                          >
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            <span>{contact.mobileNumber}</span>
                          </a>

                          {contact.email && (
                            <a
                              href={`mailto:${contact.email}?subject=Regarding your enquiry - Fly Panchachauli`}
                              className="inline-flex items-center gap-1 hover:text-black font-medium transition-colors"
                              title="Click to Email"
                            >
                              <Mail className="h-3.5 w-3.5 text-gray-400" />
                              <span>{contact.email}</span>
                            </a>
                          )}
                        </div>

                        {/* Customer Message */}
                        <div className="mt-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-700 border border-gray-100">
                          <p className="line-clamp-2 italic">
                            &quot;{contact.message}&quot;
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Action Controls */}
                    <div className="flex items-center gap-2 lg:flex-col lg:items-end xl:flex-row shrink-0 pt-2 lg:pt-0">
                      {/* Direct WhatsApp button */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Direct Call button */}
                      <a
                        href={`tel:${contact.mobileNumber}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-all"
                        title="Call Customer"
                      >
                        <Phone className="h-3.5 w-3.5 text-gray-500" />
                        <span>Call</span>
                      </a>

                      {/* View Details Modal button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedContact(contact);
                          setDetailsOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-800 transition-all"
                      >
                        <Eye className="h-3.5 w-3.5 text-gray-500" />
                        <span>View</span>
                      </button>

                      {/* Quick Status Dropdown */}
                      <select
                        value={contact.status}
                        onChange={(e) =>
                          handleStatusChange(
                            contact._id.toString(),
                            e.target.value as "new" | "read" | "replied" | "archived"
                          )
                        }
                        className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                        title="Update Status"
                      >
                        <option value="new">Mark New</option>
                        <option value="read">Mark Read</option>
                        <option value="replied">Mark Replied</option>
                        <option value="archived">Archive</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Section Footer */}
        {filteredContacts.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
            <Link
              href="/admin/contacts"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <span>View all customer enquiries and messages in inbox</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Secondary Section: Paragliding School Aspirants */}
      {data.recentSchoolAspirants && data.recentSchoolAspirants.length > 0 && (
        <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Paragliding School Inquiries
                </h3>
                <p className="text-xs text-gray-500">
                  Students applying for pilot training courses & certifications
                </p>
              </div>
            </div>

            <Link href="/admin/school">
              <Button variant="outline" size="sm" className="text-xs">
                View All ({data.totalSchoolAspirants ?? 0})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-gray-50/50">
            {data.recentSchoolAspirants.slice(0, 3).map((aspirant) => (
              <div
                key={aspirant._id.toString()}
                className="rounded-xl bg-white p-4 border border-gray-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-gray-900">
                      {aspirant.name}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {aspirant.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Location: {aspirant.location}
                  </p>
                  <p className="mt-2 text-xs text-gray-700 line-clamp-2 italic bg-gray-50 p-2 rounded">
                    &quot;{aspirant.message}&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <a
                    href={`tel:${aspirant.phone}`}
                    className="font-medium text-gray-600 hover:text-black flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    <span>{aspirant.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${cleanPhoneForWhatsApp(aspirant.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Admin Actions Grid */}
      <div className="rounded-2xl bg-black p-6 text-white shadow-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/contacts"
            className="rounded-xl bg-white/10 p-4 hover:bg-white/20 transition-all border border-white/10 group"
          >
            <Mail className="h-5 w-5 mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
            <p className="font-bold text-sm">Customer Enquiries</p>
            <p className="text-xs text-white/70 mt-1">Reply to website inquiries</p>
          </Link>

          <Link
            href="/admin/products/new"
            className="rounded-xl bg-white/10 p-4 hover:bg-white/20 transition-all border border-white/10 group"
          >
            <ShoppingBag className="h-5 w-5 mb-2 text-emerald-400 group-hover:scale-110 transition-transform" />
            <p className="font-bold text-sm">Add New Gear</p>
            <p className="text-xs text-white/70 mt-1">Publish shop equipment</p>
          </Link>

          <Link
            href="/admin/blogs/new"
            className="rounded-xl bg-white/10 p-4 hover:bg-white/20 transition-all border border-white/10 group"
          >
            <FileText className="h-5 w-5 mb-2 text-amber-400 group-hover:scale-110 transition-transform" />
            <p className="font-bold text-sm">Create Article</p>
            <p className="text-xs text-white/70 mt-1">Write a blog or flight story</p>
          </Link>

          <Link
            href="/admin/experiences/new"
            className="rounded-xl bg-white/10 p-4 hover:bg-white/20 transition-all border border-white/10 group"
          >
            <Compass className="h-5 w-5 mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
            <p className="font-bold text-sm">New Experience</p>
            <p className="text-xs text-white/70 mt-1">Add adventure flight package</p>
          </Link>
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          {selectedContact && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Customer Enquiry Details
                  </span>
                  {formatStatusBadge(selectedContact.status)}
                </div>
                <DialogTitle className="text-xl font-bold mt-1 text-gray-900">
                  {selectedContact.fullName}
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Received on{" "}
                  {new Date(selectedContact.createdAt).toLocaleString("en-IN", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-4">
                {/* Contact Information */}
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-200/80 space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" /> Mobile:
                    </span>
                    <a
                      href={`tel:${selectedContact.mobileNumber}`}
                      className="font-bold text-gray-900 hover:text-blue-600"
                    >
                      {selectedContact.mobileNumber}
                    </a>
                  </div>

                  {selectedContact.email && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" /> Email:
                      </span>
                      <a
                        href={`mailto:${selectedContact.email}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {selectedContact.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Message Body */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Customer Message
                  </label>
                  <div className="mt-1.5 rounded-xl bg-gray-50 p-4 text-sm text-gray-800 leading-relaxed border border-gray-200 whitespace-pre-wrap">
                    {selectedContact.message}
                  </div>
                </div>

                {/* Status Switcher in Modal */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Update Enquiry Status
                  </label>
                  <div className="mt-1.5 grid grid-cols-4 gap-2">
                    {(["new", "read", "replied", "archived"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(selectedContact._id.toString(), st)}
                        className={`py-2 text-xs font-bold rounded-lg border capitalize transition-colors ${
                          selectedContact.status === st
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct Connect Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <a
                    href={`https://wa.me/${cleanPhoneForWhatsApp(selectedContact.mobileNumber)}?text=${encodeURIComponent(
                      `Hello ${selectedContact.fullName}, thank you for contacting Fly Panchachauli. Regarding your enquiry: "${selectedContact.message.slice(0, 50)}..."`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 p-2.5 text-xs font-bold text-white shadow-sm transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp Customer</span>
                  </a>

                  {selectedContact.email && (
                    <a
                      href={`mailto:${selectedContact.email}?subject=Reply to your enquiry - Fly Panchachauli&body=Hi ${selectedContact.fullName},%0D%0A%0D%0AThank you for reaching out to Fly Panchachauli!`}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 p-2.5 text-xs font-bold text-white shadow-sm transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Email Customer</span>
                    </a>
                  )}

                  <a
                    href={`tel:${selectedContact.mobileNumber}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 p-2.5 text-xs font-semibold text-gray-800 transition-colors"
                  >
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" size="sm">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
