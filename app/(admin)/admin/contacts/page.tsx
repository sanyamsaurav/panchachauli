"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Search, Calendar, Trash2 } from "lucide-react";
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
  type AdminContactsParams,
} from "@/api.services/api.services";

const Page = () => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [pagination, setPagination] = useState<
    PaginatedResponse<IContact>["pagination"]
  >({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const [status, setStatus] = useState<AdminContactsParams["status"]>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<IContact | null>(null);

  const fetchContacts = async (page = 1) => {
    setLoading(true);
    try {
      const result = await getAdminContacts({
        page,
        limit: 10,
        status,
        email: emailFilter.trim() || undefined,
      });
      setContacts(result.data);
      setPagination(result.pagination);
    } catch (_error: unknown) {
      toast.error("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchContacts(1);
  }, []);

  const onSearch = () => fetchContacts(1);

  const openDeleteDialog = (contact: IContact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const onDelete = async () => {
    if (!contactToDelete) return;
    try {
      const res = await deleteAdminContact(contactToDelete._id.toString());
      if (res.success) {
        toast.success("Contact deleted");
        setDeleteDialogOpen(false);
        setContactToDelete(null);
        fetchContacts(pagination.page);
      } else {
        toast.error(res.message || "Failed to delete contact");
      }
    } catch (_err: unknown) {
      toast.error("Failed to delete contact");
    }
  };

  const formatStatusBadge = (value: IContact["status"]) => {
    const base =
      "inline-flex px-2 py-1 text-xs rounded-full capitalize border font-medium";
    switch (value) {
      case "new":
        return `${base} bg-blue-50 text-blue-700 border-blue-200`;
      case "read":
        return `${base} bg-gray-100 text-gray-700 border-gray-200`;
      case "replied":
        return `${base} bg-green-50 text-green-700 border-green-200`;
      case "archived":
        return `${base} bg-yellow-50 text-yellow-700 border-yellow-200`;
      default:
        return base;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Contact Messages
            </h1>
            <p className="text-gray-600">
              View and manage messages sent from the Contact Us form.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Filter by email…"
            className="w-full"
            type="email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Status</label>
          <select
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={status || ""}
            onChange={(e) =>
              setStatus(
                (e.target.value || undefined) as AdminContactsParams["status"]
              )
            }
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <Button variant="outline" onClick={onSearch} disabled={loading}>
          Search
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Received
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr
                  key={contact._id.toString()}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">
                        {contact.fullName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="h-4 w-4" />
                        <span>{contact.mobileNumber}</span>
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="h-4 w-4" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <p
                      className="text-sm text-gray-700 line-clamp-3"
                      title={contact.message}
                    >
                      {contact.message}
                    </p>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <span className={formatStatusBadge(contact.status)}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(contact.createdAt).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top text-right">
                    <button
                      type="button"
                      onClick={() => openDeleteDialog(contact)}
                      className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && contacts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No contact messages found.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing page{" "}
          <span className="font-medium">{pagination.page}</span> of{" "}
          <span className="font-medium">{pagination.totalPages}</span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1 || loading}
            onClick={() => fetchContacts(pagination.page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => fetchContacts(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete message from &quot;
              {contactToDelete?.fullName}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
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

