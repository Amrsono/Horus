"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ShoppingCart, Loader2, X, SlidersHorizontal, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/cartStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url: string | null;
    stock: number;
    description?: string;
    on_sale?: boolean;
    sale_price?: number;
    sale_badge_text?: string;
}

function ShopContent() {
    const { locale, formatCurrency } = useLanguage();
    const isAr = locale === "ar";
    const { addItem } = useCartStore();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);

    // Filters
    const initialQuery = searchParams.get("q") || "";
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
    const [maxPrice, setMaxPrice] = useState(2000);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const queryFromUrl = searchParams.get("q");
        if (queryFromUrl) {
            setSearchQuery(queryFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, searchQuery, selectedCategory, priceRange]);

    const fetchProducts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching products:", error);
        } else {
            const allProducts = data || [];
            setProducts(allProducts);

            const uniqueCategories = Array.from(new Set(allProducts.map((p) => p.category))).filter(Boolean);
            setCategories(["All", ...uniqueCategories]);

            const highestPrice = Math.max(...allProducts.map((p) => Number(p.price)), 0);
            const computedMax = Math.max(1000, Math.ceil(highestPrice));
            setMaxPrice(computedMax);
            setPriceRange([0, computedMax]);
        }
        setIsLoading(false);
    };

    const applyFilters = () => {
        let result = products;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category?.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q)
            );
        }

        if (selectedCategory !== "All") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        result = result.filter((p) => {
            const effective = p.on_sale && p.sale_price ? p.sale_price : p.price;
            return effective >= priceRange[0] && effective <= priceRange[1];
        });

        setFilteredProducts(result);
    };

    const handleAddToCart = (product: Product) => {
        const effectivePrice = product.on_sale && product.sale_price ? product.sale_price : product.price;
        addItem({
            id: product.id,
            name: product.name,
            price: effectivePrice,
            originalPrice: product.on_sale && product.sale_price ? product.price : undefined,
            image: product.image_url || "/placeholder.jpg",
            category: product.category,
        });
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans" dir={isAr ? "rtl" : "ltr"}>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8 pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#c91c1c] block mb-1">
                            {isAr ? "كتالوج المنتجات الكامل" : "Explore Full Catalog"}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            {isAr ? "جميع منتجات الفيب" : "All Vape Products"}
                        </h1>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                        {isAr
                            ? `عرض ${filteredProducts.length} من إجمالي ${products.length} منتج`
                            : `Showing ${filteredProducts.length} of ${products.length} products`}
                    </div>
                </div>

                {/* Mobile Filter Trigger */}
                <div className="lg:hidden mb-6 flex gap-3">
                    <button
                        onClick={() => setShowFilters(true)}
                        className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-md flex items-center justify-center gap-2"
                    >
                        <SlidersHorizontal className="w-4 h-4 text-[#c91c1c]" />
                        <span>{isAr ? "تصفية المنتجات" : "Filter Products"}</span>
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div
                        className={cn(
                            "lg:w-64 shrink-0",
                            showFilters ? "fixed inset-0 z-[80] bg-white p-6 overflow-y-auto" : "hidden lg:block"
                        )}
                    >
                        {showFilters && (
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                                <h3 className="font-bold text-base text-slate-900">{isAr ? "التصفية" : "Filters"}</h3>
                                <button onClick={() => setShowFilters(false)} className="p-1 text-slate-500 hover:text-slate-800">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Search input */}
                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2.5">
                                    {isAr ? "البحث" : "Search"}
                                </h4>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={isAr ? "ابحث بالاسم..." : "Search by name..."}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:border-slate-800"
                                    />
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2.5">
                                    {isAr ? "الفئات" : "Categories"}
                                </h4>
                                <div className="space-y-1">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                if (showFilters) setShowFilters(false);
                                            }}
                                            className={cn(
                                                "w-full text-left rtl:text-right px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-between",
                                                selectedCategory === category
                                                    ? "bg-slate-900 text-white font-bold"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            )}
                                        >
                                            <span>{category}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                                        {isAr ? "نطاق السعر" : "Price Range"}
                                    </h4>
                                    <span className="text-xs font-bold text-[#c91c1c] font-mono">
                                        {formatCurrency(priceRange[1])}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={maxPrice}
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                    className="w-full accent-[#c91c1c] h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                                    <span>{formatCurrency(0)}</span>
                                    <span>{formatCurrency(maxPrice)}</span>
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {(selectedCategory !== "All" || searchQuery || priceRange[1] < maxPrice) && (
                                <button
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSearchQuery("");
                                        setPriceRange([0, maxPrice]);
                                    }}
                                    className="w-full py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-md transition-colors"
                                >
                                    {isAr ? "إعادة ضبط التصفية" : "Reset Filters"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div key={n} className="h-80 bg-slate-100 rounded-lg animate-pulse" />
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="py-20 text-center bg-slate-50 rounded-xl border border-slate-200 p-8">
                                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-slate-900 mb-1">
                                    {isAr ? "لم نجد منتجات مطابقة" : "No products found"}
                                </h3>
                                <p className="text-xs text-slate-500 mb-4">
                                    {isAr ? "جرب تغيير الفئة أو كلمة البحث" : "Try adjusting your search query or price range"}
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSearchQuery("");
                                        setPriceRange([0, maxPrice]);
                                    }}
                                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800"
                                >
                                    {isAr ? "عرض كل المنتجات" : "View All Products"}
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {filteredProducts.map((product) => {
                                    const isOnSale = product.on_sale && product.sale_price;
                                    const finalPrice = isOnSale ? product.sale_price : product.price;

                                    return (
                                        <div
                                            key={product.id}
                                            className="group bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:scale-[1.02]"
                                        >
                                            {/* Image */}
                                            <div className="relative w-full aspect-square bg-slate-50 p-4 overflow-hidden">
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

                                            {/* Meta */}
                                            <div className="p-4 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                                        {product.category}
                                                    </span>
                                                    <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug line-clamp-2 group-hover:text-[#c91c1c] transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </div>

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
                                                        className="px-3.5 py-2 bg-slate-900 text-white hover:bg-[#c91c1c] text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
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
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#c91c1c]" /></div>}>
            <ShopContent />
        </Suspense>
    );
}
