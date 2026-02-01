"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft, CreditCard } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
    const { items, updateQuantity, removeItem, totalPrice } = useCartStore();
    const { t } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[var(--color-obsidian)] text-white flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full mt-20">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/shop" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-400" />
                    </Link>
                    <h1 className="text-3xl font-bold">{t.cart?.title || "Shopping Cart"}</h1>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-gray-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{t.cart?.empty || "Your cart is empty"}</h2>
                            <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
                            <Link
                                href="/shop"
                                className="inline-block px-8 py-3 bg-[var(--color-neon-blue)] text-black font-bold rounded-xl hover:bg-[var(--color-electric-cyan)] transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="glass p-4 sm:p-6 rounded-2xl border border-white/5 flex gap-6"
                                >
                                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-black/30 shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg line-clamp-1">{item.name}</h3>
                                                <p className="text-sm text-gray-400">{item.category}</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-end justify-between mt-4">
                                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:text-[var(--color-neon-blue)] transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="font-mono font-bold w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:text-[var(--color-neon-blue)] transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="font-mono text-xl text-[var(--color-plasma-pink)] font-bold">
                                                {typeof item.price === 'number'
                                                    ? `${(item.price * item.quantity).toFixed(0)} EGP`
                                                    : item.price}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="glass p-8 rounded-2xl border border-white/10 sticky top-32">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-[var(--color-neon-blue)]" />
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-white font-mono">{totalPrice().toFixed(0)} EGP</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-[var(--color-neon-blue)]">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Taxes</span>
                                        <span className="text-white font-mono">0 EGP</span>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6 mb-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-2xl font-bold font-mono text-[var(--color-neon-blue)]">
                                            {totalPrice().toFixed(0)} EGP
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="block w-full py-4 bg-[var(--color-neon-blue)] text-black font-bold text-center uppercase tracking-wider rounded-xl hover:bg-[var(--color-electric-cyan)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Proceed to Checkout
                                </Link>

                                <p className="text-center text-xs text-gray-500 mt-4">
                                    Secure Checkout powered by Quantum Shield
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
