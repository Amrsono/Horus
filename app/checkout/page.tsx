"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, CreditCard, Banknote, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCartStore();
    const { t, locale } = useLanguage();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [activePaymentMethod, setActivePaymentMethod] = useState<'cash' | 'card'>('cash');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        zip: ""
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (mounted && !authLoading && !user) {
            router.push("/login?redirect=/checkout");
        }
    }, [mounted, authLoading, user, router]);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsProcessing(true);

        try {
            // Create order in database
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    guest_email: user.email,
                    total_amount: totalPrice(),
                    status: 'pending',
                    shipping_address: {
                        name: formData.name,
                        address: formData.address,
                        city: formData.city,
                        zip: formData.zip
                    }
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Create order items
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                price_at_purchase: typeof item.price === 'number' ? item.price : 0
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Success!
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Failed to place order. Please try again.");
            setIsProcessing(false);
        }
    };

    if (!mounted || authLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-[var(--color-neon-blue)]" />
            </div>
        );
    }

    // Don't render checkout if not logged in (will redirect)
    if (!user) {
        return null;
    }

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-[var(--color-obsidian)] text-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-32 h-32 rounded-full bg-[var(--color-neon-blue)]/10 flex items-center justify-center mb-6 border border-[var(--color-neon-blue)]/30 shadow-[0_0_30px_rgba(var(--color-neon-blue-rgb),0.2)]"
                    >
                        <img src="/horus-eye-logo.png" alt="Success" className="w-20 h-20 object-contain" />
                    </motion.div>
                    <h1 className="text-4xl font-black mb-4">{t.checkout.success}</h1>
                    <p className="text-gray-400 mb-8 max-w-md">
                        Thank you for your order. Your quantum delivery is properly secured and will be dispatched shortly.
                    </p>
                    <Link
                        href="/"
                        className="px-8 py-3 bg-[var(--color-neon-blue)] text-black font-bold uppercase tracking-wider rounded-lg hover:bg-[var(--color-electric-cyan)] transition-colors"
                    >
                        Return Home
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--color-obsidian)] text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-32">
                <Link href="/shop" className="inline-flex items-center text-gray-400 hover:text-[var(--color-neon-blue)] mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    Back to Shop
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Form */}
                    <div>
                        <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
                            <span className="text-[var(--color-neon-blue)]">01.</span> {t.checkout.shipping}
                        </h1>

                        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">{t.checkout.form.name}</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">{t.checkout.form.email}</label>
                                    <input
                                        type="email"
                                        value={user.email || ""}
                                        disabled
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 opacity-60 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">{t.checkout.form.address}</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">{t.checkout.form.city}</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">{t.checkout.form.zip}</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.zip}
                                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                                    />
                                </div>
                            </div>
                        </form>

                        <h1 className="text-3xl font-black mt-12 mb-8 flex items-center gap-3">
                            <span className="text-[var(--color-plasma-pink)]">02.</span> {t.checkout.payment}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setActivePaymentMethod('cash')}
                                className={cn(
                                    "p-6 rounded-xl border-2 flex items-center gap-4 transition-all duration-300",
                                    activePaymentMethod === 'cash'
                                        ? "bg-[var(--color-neon-blue)]/10 border-[var(--color-neon-blue)]"
                                        : "bg-white/5 border-transparent hover:border-white/20"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                                    activePaymentMethod === 'cash' ? "border-[var(--color-neon-blue)]" : "border-gray-500"
                                )}>
                                    {activePaymentMethod === 'cash' && <div className="w-3 h-3 rounded-full bg-[var(--color-neon-blue)]" />}
                                </div>
                                <div className="text-left">
                                    <div className="font-bold flex items-center gap-2">
                                        <Banknote className="w-5 h-5" />
                                        {t.checkout.cash_on_delivery}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">Pay when you receive</div>
                                </div>
                            </button>

                            <button
                                type="button"
                                disabled
                                className="p-6 rounded-xl border-2 border-transparent bg-white/5 opacity-50 cursor-not-allowed flex items-center gap-4 relative overflow-hidden"
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center" />
                                <div className="text-left">
                                    <div className="font-bold flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        {t.checkout.credit_card}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">Secure encrypted payment</div>
                                </div>
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-[var(--color-plasma-pink)] text-black text-[10px] font-bold rounded">
                                    {t.checkout.coming_soon}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:pl-12">
                        <div className="glass p-8 rounded-2xl sticky top-32">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-[var(--color-quantum-purple)]" />
                                {t.checkout.summary}
                            </h2>

                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black/30 shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-gray-400">{item.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono text-[var(--color-neon-blue)]">
                                                {(typeof item.price === 'number' ? item.price : 0).toFixed(0)} EGP
                                            </div>
                                            <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-6 space-y-2 mb-8">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{totalPrice().toFixed(0)} EGP</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-[var(--color-neon-blue)]">Free</span>
                                </div>
                                <div className="flex justify-between text-white font-bold text-xl pt-4 border-t border-white/10 mt-4">
                                    <span>Total</span>
                                    <span>{totalPrice().toFixed(0)} EGP</span>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={isProcessing || items.length === 0}
                                className="w-full py-4 bg-[var(--color-neon-blue)] text-black font-bold uppercase tracking-wider rounded-lg hover:bg-[var(--color-electric-cyan)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    t.checkout.place_order
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
