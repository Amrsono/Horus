"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Tag, Loader2, Clock, ShoppingCart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";

interface SaleProduct {
    id: string;
    name: string;
    category: string;
    price: number;
    sale_price: number;
    sale_badge_text: string;
    image_url: string;
}

export default function SaleSection() {
    const { locale, formatCurrency } = useLanguage();
    const isAr = locale === "ar";
    const addItem = useCartStore((state) => state.addItem);
    const [saleProducts, setSaleProducts] = useState<SaleProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSaleProducts();
    }, []);

    const fetchSaleProducts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("products")
            .select("id, name, category, price, sale_price, sale_badge_text, image_url")
            .eq("on_sale", true)
            .limit(4);

        if (!error && data) {
            setSaleProducts(data);
        }
        setIsLoading(false);
    };

    const handleAddToCart = (item: SaleProduct) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.sale_price || item.price,
            originalPrice: item.price,
            image: item.image_url || "/placeholder.jpg",
            category: item.category,
        });
    };

    const calculateDiscount = (original: number, sale: number) => {
        if (!original || !sale) return "";
        const discount = ((original - sale) / original) * 100;
        return `${Math.round(discount)}% OFF`;
    };

    if (isLoading) {
        return (
            <section id="sale" className="py-16 bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#c91c1c]" />
            </section>
        );
    }

    if (saleProducts.length === 0) {
        return null;
    }

    return (
        <section id="sale" className="py-16 bg-slate-50 border-b border-slate-200" dir={isAr ? "rtl" : "ltr"}>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-[#c91c1c] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{isAr ? "عروض حصرية لفترة محدودة" : "Limited Time Deals"}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        {isAr ? "عروض التخفيضات المميزة" : "Special Offers & Sales"}
                    </h2>
                    <p className="text-slate-500 text-sm mt-2">
                        {isAr ? "اقتنِ أفضل الأجهزة والنكهات بأفضل الأسعار المتاحة" : "Grab your favorite gear and juices at unbeatable prices"}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {saleProducts.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 }}
                            className="group bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:scale-[1.02]"
                        >
                            {/* Image & Discount Badge */}
                            <div className="relative w-full aspect-square bg-white p-4 overflow-hidden">
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="flex items-center gap-1 px-2.5 py-0.5 bg-[#c91c1c] text-white text-[11px] font-bold uppercase tracking-wide rounded shadow-xs">
                                        <Tag className="w-3 h-3" />
                                        {item.sale_badge_text || calculateDiscount(item.price, item.sale_price || item.price)}
                                    </span>
                                </div>

                                <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                                    <Image
                                        src={item.image_url || "/placeholder.jpg"}
                                        alt={item.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-4 flex-1 flex flex-col justify-between border-t border-slate-100 bg-white">
                                <div>
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                        {item.category}
                                    </span>
                                    <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug line-clamp-2 group-hover:text-[#c91c1c] transition-colors">
                                        {item.name}
                                    </h3>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                    <div>
                                        <div className="text-base font-black text-[#c91c1c] font-mono">
                                            {formatCurrency(item.sale_price || item.price)}
                                        </div>
                                        <div className="text-xs text-slate-400 line-through font-mono">
                                            {formatCurrency(item.price)}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="px-3.5 py-2 bg-slate-900 text-white hover:bg-[#c91c1c] text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                                    >
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        <span>{isAr ? "أضف" : "Add"}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
