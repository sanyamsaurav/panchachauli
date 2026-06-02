'use client'
import { useEffect, useState } from "react";
import { Mountain, Search, Plus, Calendar, Pencil, Eye, Trash2 } from "lucide-react";
import { Input, Button, toast, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/common";
import type { IExperience } from "@/types/models";
import type { PaginatedResponse } from "@/types/api";
import { getAdminExperiences, deleteAdminExperience, type AdminExperiencesParams } from "@/api.services/api.services";

const Page = () => {
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<IExperience>["pagination"]>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AdminExperiencesParams["status"]>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<IExperience | null>(null);

  const fetchExperiences = async (page = 1) => {
    setLoading(true);
    try {
      const result = await getAdminExperiences({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status,
      });
      setExperiences(result.data);
      setPagination(result.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = () => fetchExperiences(1);

  const openDeleteDialog = (exp: IExperience) => {
    setExperienceToDelete(exp);
    setDeleteDialogOpen(true);
  };

  const onDelete = async () => {
    if (!experienceToDelete) return;
    try {
      const res = await deleteAdminExperience(experienceToDelete._id.toString());
      if (res.success) {
        toast.success("Experience deleted");
        setDeleteDialogOpen(false);
        setExperienceToDelete(null);
        fetchExperiences(pagination.page);
      } else {
        toast.error(res.message || "Failed to delete");
      }
    } catch (_err: unknown) {
      toast.error("Failed to delete experience");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-black p-2">
            <Mountain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Experiences</h1>
            <p className="text-gray-600">Manage your experiences and adventures</p>
          </div>
        </div>
        <a href="/admin/experiences/new">
          <Button variant="primary" className="whitespace-nowrap bg-black hover:bg-gray-800 rounded-none">
            <Plus className="mr-2 h-4 w-4" />
            New Experience
          </Button>
        </a>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search experiences by title..."
            className="w-full"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>
        <Button variant="outline" onClick={onSearch} disabled={loading} className="rounded-none">
          Search
        </Button>
      </div>

      <div className="border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {experiences.map((exp) => (
                <tr key={exp._id.toString()} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {exp.image && (
                        <img
                          src={exp.image}
                          alt=""
                          className="h-10 w-10 object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{exp.title}</p>
                        <p className="text-sm text-gray-500">/{exp.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs ${
                        exp.status === "published"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{exp.order}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(exp.updatedAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/experiences/${exp.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-black transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      <a
                        href={`/admin/experiences/${exp.slug}`}
                        className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-black transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => openDeleteDialog(exp)}
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
        {!loading && experiences.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No experiences found.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing page <span className="font-medium">{pagination.page}</span> of{" "}
          <span className="font-medium">{pagination.totalPages}</span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1 || loading}
            onClick={() => fetchExperiences(pagination.page - 1)}
            className="rounded-none"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => fetchExperiences(pagination.page + 1)}
            className="rounded-none"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Delete Experience</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{experienceToDelete?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="rounded-none">Cancel</Button>
            </DialogClose>
            <Button variant="primary" className="bg-red-600 hover:bg-red-700 rounded-none" onClick={onDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
