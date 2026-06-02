'use client'
import { useEffect, useState } from "react";
import { PackageSearch, Search, Plus, Calendar, Pencil, Eye, Trash2 } from "lucide-react";
import { Input, Button, toast, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/common";
import type { IProduct } from "@/types/models";
import type { PaginatedResponse } from "@/types/api";
import { getAdminProducts, deleteAdminProduct, type AdminProductsParams } from "@/api.services/api.services";

const Page = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [pagination, setPagination] = useState<PaginatedResponse<IProduct>["pagination"]>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<AdminProductsParams["status"]>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const result = await getAdminProducts({
                page,
                limit: 10,
                search: search.trim() || undefined,
                status,
            });
            setProducts(result.data);
            setPagination(result.pagination);
        } catch (_err) {
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSearch = () => fetchProducts(1);

    const openDeleteDialog = (prod: IProduct) => {
        setProductToDelete(prod);
        setDeleteDialogOpen(true);
    };

    const onDelete = async () => {
        if (!productToDelete) return;
        try {
            const res = await deleteAdminProduct(productToDelete._id.toString());
            if (res.success) {
                toast.success("Product deleted");
                setDeleteDialogOpen(false);
                setProductToDelete(null);
                fetchProducts(pagination.page);
            } else {
                toast.error(res.message || "Failed to delete");
            }
        } catch (_err: unknown) {
            toast.error("Failed to delete product");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-black p-2">
                        <PackageSearch className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Products & Gear</h1>
                        <p className="text-gray-600">Manage shop items and rescue equipment</p>
                    </div>
                </div>
                <a href="/admin/products/new">
                    <Button variant="primary" className="whitespace-nowrap bg-black hover:bg-gray-800 rounded-none">
                        <Plus className="mr-2 h-4 w-4" />
                        New Product
                    </Button>
                </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search products by title..."
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
                                    Product
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
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
                            {products.map((prod) => (
                                <tr key={prod._id.toString()} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {prod.image && (
                                                <img
                                                    src={prod.image}
                                                    alt=""
                                                    className="h-10 w-10 object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{prod.title}</p>
                                                <p className="text-sm text-gray-500">/{prod.slug}</p>
                                                <p className="text-xs text-blue-500 font-semibold mt-0.5">{prod.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold">{prod.price}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs ${prod.status === "published"
                                                    ? "bg-black text-white"
                                                    : "bg-gray-200 text-gray-800"
                                                }`}
                                        >
                                            {prod.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(prod.updatedAt).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={`/shop/${prod.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-black transition-colors"
                                                title="View"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </a>
                                            <a
                                                href={`/admin/products/${prod._id.toString()}/edit`}
                                                className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-black transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </a>
                                            <button
                                                onClick={() => openDeleteDialog(prod)}
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
                {!loading && products.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No products found.
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
                        onClick={() => fetchProducts(pagination.page - 1)}
                        className="rounded-none"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page >= pagination.totalPages || loading}
                        onClick={() => fetchProducts(pagination.page + 1)}
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
                        <DialogTitle>Delete Product</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{productToDelete?.title}&quot;? This action cannot be undone.
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
