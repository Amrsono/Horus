"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SaleSection() {
    const { t } = useLanguage();
    const addItem = useCartStore((state) => state.addItem);

    const saleItems = [
        {
            id: 101,
            name: t.sale.items.void_starter.name,
            originalPrice: "4500 EGP",
            salePrice: 2950,
            displayOriginal: "4500 EGP",
            displaySale: "2950 EGP",
            category: t.sale.items.void_starter.category,
            image: "https://images.unsplash.com/photo-1534125881478-f7ebc24c6a49?auto=format&fit=crop&q=80&w=800",
            discount: "33% OFF",
            color: "neon-blue"
        },
        {
            id: 102,
            name: t.sale.items.quantum_liquids.name,
            originalPrice: "1500 EGP",
            salePrice: 950,
            displayOriginal: "1500 EGP",
            displaySale: "950 EGP",
            category: t.sale.items.quantum_liquids.category,
            image: "https://images.unsplash.com/photo-1616421943899-7f51b472097e?auto=format&fit=crop&q=80&w=800",
            discount: "33% OFF",
            color: "plasma-pink"
        },
        {
            id: 103,
            name: t.sale.items.cyber_mods.name,
            originalPrice: "7500 EGP",
            salePrice: 4950,
            displayOriginal: "7500 EGP",
            displaySale: "4950 EGP",
            category: t.sale.items.cyber_mods.category,
            image: "https://images.unsplash.com/photo-1542452377-22d73359d959?auto=format&fit=crop&q=80&w=800",
            discount: "33% OFF",
            color: "quantum-purple"
        }
    ];

    const handleAddToCart = (item: any) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.salePrice, // Passing number
            image: item.image,
            category: item.category
        });
    };

    return (
        <section id="sale" className="py-24 relative overflow-hidden">

            {/* ... background ... */}
            <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-obsidian)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-neon-blue)]/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* ... header ... */}
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
                    {saleItems.map((item, index) => (
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
                                    {item.discount}
                                </span>
                            </div>

                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={item.image}
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
                                    <span className="text-gray-500 line-through text-lg">{item.displayOriginal}</span>
                                    <span className="text-[var(--color-plasma-pink)] font-mono font-bold text-2xl">{item.displaySale}</span>
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
