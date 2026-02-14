"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Plus, Edit, Trash2, Package, Image as ImageIcon, Loader2, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import ProductFormModal, { Product } from "@/components/admin/ProductFormModal";

export default function ProductsPage() {
    const { t, formatCurrency } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const fetchProducts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching products:", error);
        } else {
            setProducts(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            alert("Error deleting product");
            console.error(error);
        } else {
            fetchProducts();
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        fetchProducts();
    };

    // Extract unique categories
    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

    const getCategoryCount = (cat: string) => {
        if (cat === 'all') return products.length;
        return products.filter(p => p.category === cat).length;
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--foreground)]">{t.admin.products.title}</h1>
                    <p className="text-[var(--text-muted)]">{t.admin.products.subtitle}</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-neon-blue)] text-black font-bold rounded-xl hover:bg-[var(--color-electric-cyan)] transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]"
                >
                    <Plus className="w-5 h-5" />
                    {t.admin.products.add_product}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 p-4 glass rounded-xl border border-white/5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder={t.admin.products.search_placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-[var(--foreground)] focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors",
                            categoryFilter !== 'all'
                                ? "bg-[var(--color-neon-blue)]/10 border-[var(--color-neon-blue)]/50 text-[var(--color-neon-blue)]"
                                : "bg-white/5 border-white/10 text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-white/10"
                        )}
                    >
                        <Filter className="w-4 h-4" />
                        {t.admin.products.category_filter}
                        <ChevronDown className={cn("w-4 h-4 transition-transform", showCategoryDropdown && "rotate-180")} />
                    </button>

                    {showCategoryDropdown && (
                        <div className="absolute right-0 mt-2 w-56 glass rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden">
                            <div className="p-3">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Category</p>
                                <div className="space-y-1 max-h-64 overflow-y-auto">
                                    <button
                                        onClick={() => { setCategoryFilter('all'); setShowCategoryDropdown(false); }}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
                                            categoryFilter === 'all'
                                                ? "bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] font-medium"
                                                : "text-gray-300 hover:bg-white/5"
                                        )}
                                    >
                                        <span>All</span>
                                        <span className="text-xs opacity-60">{getCategoryCount('all')}</span>
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => { setCategoryFilter(cat); setShowCategoryDropdown(false); }}
                                            className={cn(
                                                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
                                                categoryFilter === cat
                                                    ? "bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] font-medium"
                                                    : "text-gray-300 hover:bg-white/5"
                                            )}
                                        >
                                            <span>{cat}</span>
                                            <span className="text-xs opacity-60">{getCategoryCount(cat)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Filter Badge */}
            {categoryFilter !== 'all' && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Filtered by:</span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] rounded-full text-xs font-medium border border-[var(--color-neon-blue)]/20">
                        {categoryFilter}
                        <button onClick={() => setCategoryFilter('all')} className="ml-1 hover:opacity-70"><X className="w-3 h-3" /></button>
                    </span>
                    <span className="text-xs text-gray-500">({getCategoryCount(categoryFilter)} products)</span>
                </div>
            )}

            {/* Products Table */}
            <div className="glass rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-bold tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4">{t.admin.products.table.product}</th>
                                <th className="px-6 py-4">{t.admin.products.table.category}</th>
                                <th className="px-6 py-4">{t.admin.products.table.price}</th>
                                <th className="px-6 py-4">{t.admin.products.table.stock}</th>
                                <th className="px-6 py-4">{t.admin.products.table.status}</th>
                                <th className="px-6 py-4 text-right">{t.admin.products.table.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--color-neon-blue)]" />
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        {t.admin.products.table.no_products}
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative">
                                                    {product.image_url ? (
                                                        <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-gray-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{product.name}</div>
                                                    <div className="text-xs font-mono text-gray-500 truncate max-w-[100px]">{product.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-white/5 rounded text-xs">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white font-mono font-bold">{formatCurrency(product.price)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-mono">{product.stock}</span>
                                                <span className="text-xs text-gray-500">{t.admin.products.table.units}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${product.stock > 50
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : product.stock > 0
                                                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                {product.stock > 0 ? (product.stock < 20 ? t.admin.products.status.low_stock : t.admin.products.status.in_stock) : t.admin.products.status.out_of_stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                    title="Edit Product"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id!)}
                                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productToEdit={editingProduct}
                onSave={handleSave}
            />
        </div>
    );
}
