"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ShoppingCart, Loader2, Sparkles, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url: string | null;
    stock: number;
    on_sale?: boolean;
    sale_price?: number;
}

export default function ProductsSection() {
    const { locale, formatCurrency } = useLanguage();
    const isAr = locale === "ar";
    const addItem = useCartStore((state) => state.addItem);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .gt("stock", 0)
                .order("created_at", { ascending: false })
                .limit(8);

            if (error) {
                console.error("Error fetching products:", error);
            } else {
                setProducts(data || []);
            }
            setIsLoading(false);
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product: Product) => {
        const effectivePrice = product.on_sale && product.sale_price ? product.sale_price : product.price;
        addItem({
            id: product.id,
            name: product.name,
            price: effectivePrice,
            originalPrice: product.on_sale && product.sale_price ? product.price : undefined,
            image: product.image_url || "https://images.unsplash.com/photo-1534125881478-f7ebc24c6a49?auto=format&fit=crop&q=80&w=800",
            category: product.category,
        });
    };

    return (
        <section className="py-16 bg-white text-slate-900 border-b border-slate-200" dir={isAr ? "rtl" : "ltr"}>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c91c1c] mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isAr ? "أفضل المختارات" : "Top Picks & Best Sellers"}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            {isAr ? "أحدث منتجاتنا المميزة" : "Featured Products"}
                        </h2>
                    </div>

                    <Link
                        href="/shop"
                        className="group flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#c91c1c] transition-colors"
                    >
                        <span>{isAr ? "عرض جميع المنتجات" : "View All Products"}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Product Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[#c91c1c]" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-slate-500 font-medium">
                            {isAr ? "لا توجد منتجات متوفرة حالياً" : "No products available at the moment."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => {
                            const isOnSale = product.on_sale && product.sale_price;
                            const finalPrice = isOnSale ? product.sale_price : product.price;

                            return (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:scale-[1.02]"
                                >
                                    {/* Image & Badges */}
                                    <div className="relative w-full aspect-square bg-slate-50 overflow-hidden p-4">
                                        {isOnSale && (
                                            <span className="absolute top-3 left-3 z-10 bg-[#c91c1c] text-white text-[11px] font-bold px-2.5 py-0.5 rounded shadow-xs uppercase tracking-wide">
                                                {isAr ? "خصم" : "Sale"}
                                            </span>
                                        )}

                                        <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                                            <Image
                                                src={product.image_url || "/placeholder.jpg"}
                                                alt={product.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* Product Meta */}
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                                {product.category}
                                            </span>
                                            <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug line-clamp-2 group-hover:text-[#c91c1c] transition-colors">
                                                {product.name}
                                            </h3>
                                        </div>

                                        {/* Price and Add Button */}
                                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                            <div>
                                                <div className="text-base font-black text-slate-900 font-mono">
                                                    {formatCurrency(finalPrice || 0)}
                                                </div>
                                                {isOnSale && (
                                                    <div className="text-xs text-slate-400 line-through font-mono">
                                                        {formatCurrency(product.price)}
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="px-3.5 py-2 bg-slate-900 text-white hover:bg-[#c91c1c] text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                                                title="Add to basket"
                                            >
                                                <ShoppingCart className="w-3.5 h-3.5" />
                                                <span>{isAr ? "أضف" : "Add"}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
