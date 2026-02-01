"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ShoppingCart, ArrowRight, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/cartStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url: string | null;
    stock: number;
    description?: string;
}

export default function ShopPage() {
    const { addItem } = useCartStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, searchQuery, selectedCategory, priceRange]);

    const fetchProducts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching products:", error);
        } else {
            const allProducts = data || [];
            setProducts(allProducts);

            // Extract unique categories
            const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category))).filter(Boolean);
            setCategories(["All", ...uniqueCategories]);

            // Determine max price for range slider
            const highestPrice = Math.max(...allProducts.map(p => Number(p.price)), 0);
            setMaxPrice(Math.ceil(highestPrice));
            setPriceRange([0, Math.ceil(highestPrice)]);
        }
        setIsLoading(false);
    };

    const applyFilters = () => {
        let result = products;

        // Search
        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category
        if (selectedCategory !== "All") {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Price
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        setFilteredProducts(result);
    };

    const handleAddToCart = (product: Product) => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url || "/placeholder.jpg",
            category: product.category
        });
    };

    return (
        <div className="min-h-screen bg-[var(--color-obsidian)] text-white font-sans">
            <Navbar />

            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">
                            SHOP <span className="text-gradient">CATALOG</span>
                        </h1>
                        <p className="text-gray-400 max-w-xl">
                            Explore our complete collection of premium vaping products, from advanced mods to exotic e-liquids.
                        </p>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className={cn(
                        "lg:w-1/4 space-y-8",
                        showFilters ? "block" : "hidden lg:block"
                    )}>
                        <div className="glass p-6 rounded-2xl border border-white/10 sticky top-24">
                            <div className="flex justify-between items-center lg:hidden mb-4">
                                <h3 className="font-bold text-lg">Filters</h3>
                                <button onClick={() => setShowFilters(false)}>
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-8">
                                <h3 className="font-bold text-sm text-[var(--color-neon-blue)] uppercase tracking-wider mb-4">Search</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors text-sm"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-8">
                                <h3 className="font-bold text-sm text-[var(--color-neon-blue)] uppercase tracking-wider mb-4">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={cn(
                                                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                                                selectedCategory === category
                                                    ? "bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] font-bold border border-[var(--color-neon-blue)]/20"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="font-bold text-sm text-[var(--color-neon-blue)] uppercase tracking-wider mb-4">
                                    Price Range: <span className="text-white">{priceRange[0]} - {priceRange[1]} EGP</span>
                                </h3>
                                <input
                                    type="range"
                                    min="0"
                                    max={maxPrice}
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                    className="w-full accent-[var(--color-neon-blue)] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>0 EGP</span>
                                    <span>{maxPrice} EGP</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(true)}
                        className="lg:hidden flex items-center justify-center gap-2 py-3 glass rounded-xl border border-white/10 font-bold"
                    >
                        <Filter className="w-4 h-4" />
                        Show Filters
                    </button>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div key={n} className="h-[400px] glass rounded-2xl animate-pulse bg-white/5" />
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-2xl border border-white/5">
                                <Search className="w-16 h-16 text-gray-600 mb-4" />
                                <h3 className="text-xl font-bold mb-2">No products found</h3>
                                <p className="text-gray-400">Try adjusting your filters or search query.</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("All");
                                        setPriceRange([0, maxPrice]);
                                    }}
                                    className="mt-6 text-[var(--color-neon-blue)] hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {filteredProducts.map((product) => (
                                        <motion.div
                                            layout
                                            key={product.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.2 }}
                                            className="group relative glass rounded-2xl overflow-hidden border border-white/5 hover:border-[var(--color-neon-blue)]/30 transition-all duration-300"
                                        >
                                            {/* Image */}
                                            <div className="relative h-64 overflow-hidden bg-black/20">
                                                <Image
                                                    src={product.image_url || "/placeholder.jpg"}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                                {/* Float Category */}
                                                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 uppercase tracking-wider">
                                                    {product.category}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-[var(--color-neon-blue)] transition-colors">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-end justify-between mt-4">
                                                    <span className="text-2xl font-mono font-bold text-[var(--color-plasma-pink)]">
                                                        {product.price} <span className="text-sm text-gray-400">EGP</span>
                                                    </span>
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--color-neon-blue)] flex items-center justify-center text-white hover:text-black transition-all hover:scale-110 active:scale-95"
                                                    >
                                                        <ShoppingCart className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
