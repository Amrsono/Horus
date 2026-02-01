"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export type Product = {
    id?: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    image_url: string;
    on_sale?: boolean;
    sale_price?: number;
    sale_badge_text?: string;
    created_at?: string;
};

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit?: Product | null;
    onSave: () => void;
}

export default function ProductFormModal({ isOpen, onClose, productToEdit, onSave }: ProductFormModalProps) {
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Product>({
        name: "",
        category: "E-Liquids",
        price: 0,
        stock: 0,
        description: "",
        image_url: "",
        on_sale: false,
        sale_price: 0,
        sale_badge_text: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    useEffect(() => {
        if (productToEdit) {
            setFormData(productToEdit);
            setPreviewUrl(productToEdit.image_url || "");
        } else {
            setFormData({
                name: "",
                category: "E-Liquids",
                price: 0,
                stock: 0,
                description: "",
                image_url: "",
                on_sale: false,
                sale_price: 0,
                sale_badge_text: "",
            });
            setPreviewUrl("");
        }
        setImageFile(null);
    }, [productToEdit, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" || name === "stock" ? parseFloat(value) : value
        }));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let finalImageUrl = formData.image_url;

            if (imageFile) {
                finalImageUrl = await uploadImage(imageFile);
            }

            const productData = {
                ...formData,
                image_url: finalImageUrl,
            };

            if (productToEdit?.id) {
                // Update existing
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productToEdit.id);

                if (error) throw error;
            } else {
                // Create new
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);

                if (error) throw error;
            }

            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0a0a0a] z-10">
                    <h2 className="text-xl font-bold text-white">
                        {productToEdit ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Image Upload */}
                    <div className="flex justify-center">
                        <div
                            className="relative w-40 h-40 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer group hover:border-[var(--color-neon-blue)] transition-colors overflow-hidden"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="text-center p-4">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-[var(--color-neon-blue)]" />
                                    <span className="text-xs text-gray-500">Click to upload</span>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageSelect}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[var(--color-neon-blue)] focus:outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[var(--color-neon-blue)] focus:outline-none"
                            >
                                <option value="E-Liquids">E-Liquids</option>
                                <option value="Devices">Devices</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Mods">Mods</option>
                                <option value="Pod Systems">Pod Systems</option>
                                <option value="Tanks">Tanks</option>
                                <option value="Starter Kits">Starter Kits</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[var(--color-neon-blue)] focus:outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[var(--color-neon-blue)] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Description</label>
                        <textarea
                            name="description"
                            value={formData.description || ""}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[var(--color-neon-blue)] focus:outline-none"
                        />
                    </div>

                    {/* Sale Section */}
                    <div className="border-t border-white/10 pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white">Sale Settings</h3>
                                <p className="text-xs text-gray-500">Mark this product as on sale</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.on_sale || false}
                                    onChange={(e) => setFormData(prev => ({ ...prev, on_sale: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-neon-blue)]"></div>
                            </label>
                        </div>

                        {formData.on_sale && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Sale Price (EGP)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.sale_price || 0}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sale_price: parseFloat(e.target.value) }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[var(--color-neon-blue)] focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Sale Badge Text</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 50% OFF"
                                        value={formData.sale_badge_text || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sale_badge_text: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[var(--color-neon-blue)] focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-3 bg-[var(--color-neon-blue)] hover:bg-[var(--color-electric-cyan)] text-black rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {productToEdit ? "Update Product" : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
