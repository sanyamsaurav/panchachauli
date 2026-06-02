"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Search, Calendar, Trash2, MapPin, Phone, Mail, StickyNote, Edit3 } from "lucide-react";
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
import type { ISchoolAspirant } from "@/types/models";
import type { PaginatedResponse } from "@/types/api";
import {
  getAdminSchoolAspirants,
  updateAdminSchoolAspirant,
  deleteAdminSchoolAspirant,
  type AdminSchoolAspirantsParams,
} from "@/api.services/api.services";

const Page = () => {
  const [aspirants, setAspirants] = useState<ISchoolAspirant[]>([]);
  const [pagination, setPagination] = useState<
    PaginatedResponse<ISchoolAspirant>["pagination"]
  >({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [status, setStatus] = useState<AdminSchoolAspirantsParams["status"]>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [aspirantToDelete, setAspirantToDelete] = useState<ISchoolAspirant | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [aspirantToEdit, setAspirantToEdit] = useState<ISchoolAspirant | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  const fetchAspirants = async (page = 1) => {
    setLoading(true);
    try {
      const result = await getAdminSchoolAspirants({
        page,
        limit: 10,
        status,
        name: searchFilter.trim() || undefined,
      });
      setAspirants(result.data);
      setPagination(result.pagination);
    } catch (_error: unknown) {
      toast.error("Failed to load school aspirants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchAspirants(1);
  }, []);

  const onSearch = () => fetchAspirants(1);

  const openDeleteDialog = (aspirant: ISchoolAspirant) => {
    setAspirantToDelete(aspirant);
    setDeleteDialogOpen(true);
  };

  const onDelete = async () => {
    if (!aspirantToDelete) return;
    try {
      const res = await deleteAdminSchoolAspirant(aspirantToDelete._id.toString());
      if (res.success) {
        toast.success("Aspirant deleted");
        setDeleteDialogOpen(false);
        setAspirantToDelete(null);
        fetchAspirants(pagination.page);
      } else {
        toast.error(res.message || "Failed to delete aspirant");
      }
    } catch (_err: unknown) {
      toast.error("Failed to delete aspirant");
    }
  };

  const openEditDialog = (aspirant: ISchoolAspirant) => {
    setAspirantToEdit(aspirant);
    setEditStatus(aspirant.status);
    setEditNotes(aspirant.notes || "");
    setEditDialogOpen(true);
  };

  const onUpdate = async () => {
    if (!aspirantToEdit) return;
    try {
      const res = await updateAdminSchoolAspirant(aspirantToEdit._id.toString(), {
        status: editStatus,
        notes: editNotes,
      });
      if (res.success) {
        toast.success("Aspirant updated successfully");
        setEditDialogOpen(false);
        setAspirantToEdit(null);
        fetchAspirants(pagination.page);
      } else {
        toast.error(res.message || "Failed to update aspirant");
      }
    } catch (_err: unknown) {
      toast.error("Failed to update aspirant");
    }
  };

  const formatStatusBadge = (value: ISchoolAspirant["status"]) => {
    const base =
      "inline-flex px-2 py-1 text-xs rounded-full capitalize border font-medium";
    switch (value) {
      case "new":
        return `${base} bg-blue-50 text-blue-700 border-blue-200`;
      case "contacted":
        return `${base} bg-yellow-50 text-yellow-700 border-yellow-200`;
      case "enrolled":
        return `${base} bg-green-50 text-green-700 border-green-200`;
      case "rejected":
        return `${base} bg-red-50 text-red-700 border-red-200`;
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
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              School Aspirants
            </h1>
            <p className="text-gray-600">
              View and manage inquiries from the Paragliding School.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Filter by name..."
            className="w-full"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
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
                (e.target.value || undefined) as AdminSchoolAspirantsParams["status"]
              )
            }
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="enrolled">Enrolled</option>
            <option value="rejected">Rejected</option>
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
                  Aspirant
                </th>
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
              {aspirants.map((aspirant) => (
                <tr
                  key={aspirant._id.toString()}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">
                        {aspirant.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{aspirant.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{aspirant.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{aspirant.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div>
                      <p
                        className="text-sm text-gray-700 line-clamp-2"
                        title={aspirant.message}
                      >
                        {aspirant.message}
                      </p>
                      {aspirant.notes && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                          <StickyNote className="h-3 w-3" />
                          <span className="line-clamp-1" title={aspirant.notes}>
                            Note: {aspirant.notes}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <span className={formatStatusBadge(aspirant.status)}>
                      {aspirant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(aspirant.createdAt).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditDialog(aspirant)}
                        className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Status & Notes"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteDialog(aspirant)}
                        className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && aspirants.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No school aspirants found.
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
            onClick={() => fetchAspirants(pagination.page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => fetchAspirants(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Aspirant</DialogTitle>
            <DialogDescription>
              Update status and add notes for {aspirantToEdit?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="enrolled">Enrolled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                rows={3}
                placeholder="Add notes about this aspirant..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="primary" onClick={onUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Aspirant</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the inquiry from &quot;
              {aspirantToDelete?.name}&quot;? This action cannot be undone.
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
