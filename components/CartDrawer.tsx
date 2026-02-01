"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
    const { t, locale } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: locale === 'ar' ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: locale === 'ar' ? '-100%' : '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={cn(
                            "fixed top-0 bottom-0 z-[101] w-full max-w-md bg-[var(--color-obsidian)] border-l border-white/10 shadow-2xl flex flex-col",
                            locale === 'ar' ? "left-0 border-r border-l-0" : "right-0 border-l"
                        )}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-[var(--color-neon-blue)]" />
                                {t.cart.title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                    <ShoppingBag className="w-16 h-16 mb-4 text-gray-600" />
                                    <p className="text-lg">{t.cart.empty}</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex gap-4 p-4 glass rounded-xl border border-white/5"
                                    >
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-black/30 shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-white line-clamp-1">{item.name}</h3>
                                                <p className="text-sm text-gray-400">{item.category}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="font-mono text-[var(--color-plasma-pink)]">
                                                    {typeof item.price === 'number'
                                                        ? `${item.price.toFixed(0)} EGP`
                                                        : item.price}
                                                </p>

                                                <div className="flex items-center gap-3 bg-white/5 rounded-full px-2 py-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:text-[var(--color-neon-blue)] transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:text-[var(--color-neon-blue)] transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-black/20">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-400">{t.cart.subtotal}</span>
                                    <span className="text-2xl font-bold font-mono text-white">
                                        {totalPrice().toFixed(0)} EGP
                                    </span>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={onClose}
                                    className="block w-full py-4 bg-[var(--color-neon-blue)] text-black font-bold text-center uppercase tracking-wider rounded-lg hover:bg-[var(--color-electric-cyan)] transition-colors hover-lift"
                                >
                                    {t.cart.checkout}
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
