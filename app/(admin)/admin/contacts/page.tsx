"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Mail,
  Phone,
  Search,
  Calendar,
  Trash2,
  MessageCircle,
  Eye,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  Input,
  Button,
  toast,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/common";
import type { IContact } from "@/types/models";
import type { PaginatedResponse } from "@/types/api";
import {
  getAdminContacts,
  deleteAdminContact,
  updateAdminContactStatus,
  type AdminContactsParams,
} from "@/api.services/api.services";

function cleanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

const Page = () => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [pagination, setPagination] = useState<
    PaginatedResponse<IContact>["pagination"]
  >({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [status, setStatus] = useState<AdminContactsParams["status"]>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<IContact | null>(null);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });
  const [, startTransition] = useTransition();

  const fetchContacts = async (page = 1, currentStatus = status) => {
    setLoading(true);
    try {
      const result = await getAdminContacts({
        page,
        limit: 15,
        status: currentStatus,
        search: searchFilter.trim() || undefined,
      });
      setContacts(result.data);
      setPagination(result.pagination);
    } catch (_error: unknown) {
      toast.error("Failed to load customer enquiries");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.contactsStats) {
          setStats(json.data.contactsStats);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchContacts(1);
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = () => fetchContacts(1);

  const handleStatusChange = async (
    contactId: string,
    newStatus: "new" | "read" | "replied" | "archived"
  ) => {
    // Optimistic UI update
    setContacts((prev) =>
      prev.map((c) =>
        c._id.toString() === contactId ? ({ ...c, status: newStatus } as IContact) : c
      )
    );

    if (selectedContact && selectedContact._id.toString() === contactId) {
      setSelectedContact((prev) => (prev ? ({ ...prev, status: newStatus } as IContact) : null));
    }

    startTransition(async () => {
      try {
        const res = await updateAdminContactStatus(contactId, newStatus);
        if (res.success) {
          toast.success(`Status updated to ${newStatus}`);
          fetchStats();
        } else {
          toast.error(res.message || "Failed to update status");
        }
      } catch {
        toast.error("Failed to update status");
      }
    });
  };

  const openDeleteDialog = (contact: IContact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const onDelete = async () => {
    if (!contactToDelete) return;
    try {
      const res = await deleteAdminContact(contactToDelete._id.toString());
      if (res.success) {
        toast.success("Enquiry deleted successfully");
        setDeleteDialogOpen(false);
        setContactToDelete(null);
        fetchContacts(pagination.page);
        fetchStats();
      } else {
        toast.error(res.message || "Failed to delete enquiry");
      }
    } catch (_err: unknown) {
      toast.error("Failed to delete enquiry");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (contacts.length === 0) {
      toast.error("No enquiries to export");
      return;
    }

    const headers = ["ID", "Full Name", "Mobile Number", "Email", "Status", "Message", "Received At"];
    const rows = contacts.map((c) => [
      c._id.toString(),
      `"${c.fullName.replace(/"/g, '""')}"`,
      `"${c.mobileNumber}"`,
      `"${c.email || ""}"`,
      c.status,
      `"${c.message.replace(/"/g, '""')}"`,
      new Date(c.createdAt).toISOString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `customer_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Enquiries exported as CSV");
  };

  const formatStatusBadge = (value: IContact["status"]) => {
    switch (value) {
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
            <Archive className="h-3 w-3 text-zinc-500" />
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2.5 py-1 text-xs rounded-full border bg-gray-50 text-gray-700">
            {value}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-black p-2.5 text-white">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900">
                Customer Enquiries
              </h1>
              {stats.new > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                  {stats.new} New
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage messages and booking inquiries sent from the website contact form.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchContacts(pagination.page);
              fetchStats();
            }}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          onClick={() => {
            setStatus(undefined);
            fetchContacts(1, undefined);
          }}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            status === undefined
              ? "bg-black text-white border-black shadow-md"
              : "bg-white text-gray-900 border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-70">
            Total Enquiries
          </p>
          <p className="mt-1 text-2xl font-black">{stats.total}</p>
        </div>

        <div
          onClick={() => {
            setStatus("new");
            fetchContacts(1, "new");
          }}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            status === "new"
              ? "bg-blue-600 text-white border-blue-600 shadow-md"
              : "bg-white text-gray-900 border-gray-200 hover:border-blue-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">
              New / Unread
            </p>
            {stats.new > 0 && (
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </div>
          <p className="mt-1 text-2xl font-black">{stats.new}</p>
        </div>

        <div
          onClick={() => {
            setStatus("replied");
            fetchContacts(1, "replied");
          }}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            status === "replied"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
              : "bg-white text-gray-900 border-gray-200 hover:border-emerald-200"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-70">
            Replied
          </p>
          <p className="mt-1 text-2xl font-black">{stats.replied}</p>
        </div>

        <div
          onClick={() => {
            setStatus("archived");
            fetchContacts(1, "archived");
          }}
          className={`cursor-pointer rounded-xl p-4 border transition-all ${
            status === "archived"
              ? "bg-zinc-800 text-white border-zinc-800 shadow-md"
              : "bg-white text-gray-900 border-gray-200 hover:border-zinc-300"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider opacity-70">
            Archived
          </p>
          <p className="mt-1 text-2xl font-black">{stats.archived}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, phone, email, or message…"
            className="w-full pl-9 h-10 text-xs"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black"
            value={status || ""}
            onChange={(e) => {
              const val = (e.target.value || undefined) as AdminContactsParams["status"];
              setStatus(val);
              fetchContacts(1, val);
            }}
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={onSearch}
            disabled={loading}
            className="text-xs"
          >
            Search
          </Button>

          {(searchFilter || status) && (
            <button
              type="button"
              onClick={() => {
                setSearchFilter("");
                setStatus(undefined);
                fetchContacts(1, undefined);
              }}
              className="text-xs text-gray-500 hover:text-black font-semibold px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Received
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.map((contact) => {
                const waNumber = cleanPhoneForWhatsApp(contact.mobileNumber);
                const waText = encodeURIComponent(
                  `Hello ${contact.fullName}, thank you for contacting Fly Panchachauli. Regarding your enquiry: "${contact.message.slice(0, 50)}..."`
                );
                const waUrl = `https://wa.me/${waNumber}?text=${waText}`;

                return (
                  <tr
                    key={contact._id.toString()}
                    className={`hover:bg-gray-50/80 transition-colors ${
                      contact.status === "new" ? "bg-blue-50/20" : ""
                    }`}
                  >
                    {/* Customer Info */}
                    <td className="px-5 py-4 align-top">
                      <div className="space-y-1 min-w-[180px]">
                        <p className="font-bold text-sm text-gray-900">
                          {contact.fullName}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <a
                            href={`tel:${contact.mobileNumber}`}
                            className="hover:text-black hover:underline"
                          >
                            {contact.mobileNumber}
                          </a>
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <a
                              href={`mailto:${contact.email}`}
                              className="hover:text-black hover:underline truncate max-w-[180px]"
                            >
                              {contact.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Message Preview */}
                    <td className="px-5 py-4 align-top max-w-md">
                      <p
                        className="text-xs text-gray-700 line-clamp-3 leading-relaxed cursor-pointer hover:text-black"
                        onClick={() => {
                          setSelectedContact(contact);
                          setViewDialogOpen(true);
                        }}
                        title="Click to view full message"
                      >
                        {contact.message}
                      </p>
                    </td>

                    {/* Status & Quick Status Switcher */}
                    <td className="px-5 py-4 align-top">
                      <div className="space-y-2">
                        {formatStatusBadge(contact.status)}
                        <div>
                          <select
                            value={contact.status}
                            onChange={(e) =>
                              handleStatusChange(
                                contact._id.toString(),
                                e.target.value as "new" | "read" | "replied" | "archived"
                              )
                            }
                            className="text-[11px] font-medium border border-gray-200 rounded-md px-2 py-1 bg-white hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                          >
                            <option value="new">Mark New</option>
                            <option value="read">Mark Read</option>
                            <option value="replied">Mark Replied</option>
                            <option value="archived">Mark Archived</option>
                          </select>
                        </div>
                      </div>
                    </td>

                    {/* Received Date */}
                    <td className="px-5 py-4 align-top whitespace-nowrap">
                      <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>
                          {new Date(contact.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(contact.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>

                        {/* Call */}
                        <a
                          href={`tel:${contact.mobileNumber}`}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          title="Call customer"
                        >
                          <Phone className="h-4 w-4" />
                        </a>

                        {/* View Full Message */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedContact(contact);
                            setViewDialogOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => openDeleteDialog(contact)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && contacts.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Mail className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm font-semibold">No customer enquiries found</p>
            <p className="text-xs text-gray-400 mt-1">
              Customer enquiries submitted on the website will be listed here.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-gray-500">
          Showing page <span className="font-bold text-gray-900">{pagination.page}</span> of{" "}
          <span className="font-bold text-gray-900">{pagination.totalPages || 1}</span> ({pagination.total} total enquiries)
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1 || loading}
            onClick={() => fetchContacts(pagination.page - 1)}
            className="text-xs"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => fetchContacts(pagination.page + 1)}
            className="text-xs"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Full View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          {selectedContact && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Enquiry Details
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
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-200/80 space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" /> Phone:
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

                {/* Direct Action Buttons */}
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
                    <span>WhatsApp</span>
                  </a>

                  {selectedContact.email && (
                    <a
                      href={`mailto:${selectedContact.email}?subject=Reply to your enquiry - Fly Panchachauli&body=Hi ${selectedContact.fullName},%0D%0A%0D%0AThank you for reaching out to Fly Panchachauli!`}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 p-2.5 text-xs font-bold text-white shadow-sm transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Enquiry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the enquiry from &quot;
              {contactToDelete?.fullName}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={onDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
