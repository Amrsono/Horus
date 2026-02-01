"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Tag, Loader2 } from "lucide-react";
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
    const { t } = useLanguage();
    const addItem = useCartStore((state) => state.addItem);
    const [saleProducts, setSaleProducts] = useState<SaleProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSaleProducts();
    }, []);

    const fetchSaleProducts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('id, name, category, price, sale_price, sale_badge_text, image_url')
            .eq('on_sale', true)
            .limit(3);

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
            image: item.image_url,
            category: item.category
        });
    };

    const calculateDiscount = (original: number, sale: number) => {
        const discount = ((original - sale) / original) * 100;
        return `${Math.round(discount)}% OFF`;
    };

    if (isLoading) {
        return (
            <section id="sale" className="py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-obsidian)]" />
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-[var(--color-neon-blue)]" />
                </div>
            </section>
        );
    }

    if (saleProducts.length === 0) {
        return null; // Don't show section if no sale products
    }

    return (
        <section id="sale" className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-obsidian)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-neon-blue)]/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[var(--color-plasma-pink)] font-bold tracking-widest uppercase mb-4 text-sm"
                    >
                        {t.sale.section_title}
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-black mb-6"
                    >
                        {t.sale.main_title} <span className="text-gradient from-[var(--color-plasma-pink)] to-[var(--color-quantum-purple)]">{t.sale.main_title_highlight}</span>
                    </motion.h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {saleProducts.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative glass rounded-2xl overflow-hidden border border-white/5 hover:border-[var(--color-plasma-pink)]/30 transition-all duration-500 hover:shadow-[0_0_30px_-5px_var(--color-plasma-pink)]"
                        >
                            {/* Discount Badge */}
                            <div className="absolute top-4 right-4 z-20">
                                <span className="flex items-center gap-1 px-3 py-1 bg-[var(--color-plasma-pink)] text-black text-xs font-bold uppercase tracking-wider rounded-full">
                                    <Tag className="w-3 h-3" />
                                    {item.sale_badge_text || calculateDiscount(item.price, item.sale_price || item.price)}
                                </span>
                            </div>

                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={item.image_url || '/placeholder.jpg'}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">{item.category}</div>
                                <h4 className="text-xl font-bold text-white mb-2">{item.name}</h4>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-gray-500 line-through text-lg">{item.price.toFixed(0)} EGP</span>
                                    <span className="text-[var(--color-plasma-pink)] font-mono font-bold text-2xl">
                                        {(item.sale_price || item.price).toFixed(0)} EGP
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className="w-full py-3 bg-white/5 hover:bg-[var(--color-plasma-pink)] text-white hover:text-black font-bold uppercase tracking-wider rounded-lg transition-colors duration-300"
                                >
                                    {t.sale.add_to_cart}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
