"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProductsSection() {
    const { t } = useLanguage();
    const addItem = useCartStore((state) => state.addItem);

    const products = [
        {
            id: 1,
            name: t.products.items.nebula_x1.name,
            price: 6500,
            displayPrice: "6500 EGP",
            category: t.products.items.nebula_x1.category,
            image: "https://images.unsplash.com/photo-1534125881478-f7ebc24c6a49?auto=format&fit=crop&q=80&w=800",
            span: "md:col-span-2 md:row-span-2",
            badge: t.products.badges.best_seller,
            color: "neon-blue",
        },
        {
            id: 2,
            name: t.products.items.plasma_pod.name,
            price: 2500,
            displayPrice: "2500 EGP",
            category: t.products.items.plasma_pod.category,
            image: "https://images.unsplash.com/photo-1627916327885-2e6973f5509c?auto=format&fit=crop&q=80&w=800",
            span: "md:col-span-1 md:row-span-1",
            color: "plasma-pink",
        },
        {
            id: 3,
            name: t.products.items.quantum_juice.name,
            price: 1250,
            displayPrice: "1250 EGP",
            category: t.products.items.quantum_juice.category,
            image: "https://images.unsplash.com/photo-1616421943899-7f51b472097e?auto=format&fit=crop&q=80&w=800",
            span: "md:col-span-1 md:row-span-1",
            color: "quantum-purple",
        },
        {
            id: 4,
            name: t.products.items.cyber_coil.name,
            price: 950,
            displayPrice: "950 EGP",
            category: t.products.items.cyber_coil.category,
            image: "https://images.unsplash.com/photo-1563289053-f725a3977dc8?auto=format&fit=crop&q=80&w=800",
            span: "md:col-span-1 md:row-span-2",
            badge: t.products.badges.new_arrival,
            color: "electric-cyan",
        },
        {
            id: 5,
            name: t.products.items.void_tank.name,
            price: 1950,
            displayPrice: "1950 EGP",
            category: t.products.items.void_tank.category,
            image: "https://images.unsplash.com/photo-1542452377-22d73359d959?auto=format&fit=crop&q=80&w=800",
            span: "md:col-span-1 md:row-span-1",
            color: "solar-yellow",
        }
    ];

    const handleAddToCart = (item: any) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category
        });
    };

    return (
        <section className="py-24 bg-[var(--color-deep-space)] relative">
            {/* ... background ... */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(var(--color-neon-blue) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* ... headers ... */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-[var(--color-quantum-purple)] font-bold tracking-widest uppercase mb-4 text-sm"
                        >
                            {t.products.section_title}
                        </motion.h2>
                        <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-black text-white"
                        >
                            {t.products.main_title} <span className="text-gradient">{t.products.main_title_highlight}</span>
                        </motion.h3>
                    </div>

                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        {t.products.view_all}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "group relative glass rounded-2xl overflow-hidden hover:border-[var(--color-neon-blue)]/50 transition-all duration-500",
                                product.span
                            )}
                        >
                            {/* Image with overlay */}
                            <div className="absolute inset-0">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            </div>

                            {/* Badges */}
                            {product.badge && (
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="px-3 py-1 bg-[var(--color-neon-blue)] text-black text-xs font-bold uppercase tracking-wider rounded-sm">
                                        {product.badge}
                                    </span>
                                </div>
                            )}

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                                    {product.category}
                                </span>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className="text-2xl font-bold text-white mb-1 group-hover:text-gradient transition-all">
                                            {product.name}
                                        </h4>
                                        <p className="text-[var(--color-neon-blue)] font-mono font-bold">
                                            {product.displayPrice}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--color-neon-blue)] flex items-center justify-center text-white hover:text-black transition-colors backdrop-blur-sm"
                                    >
                                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
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
