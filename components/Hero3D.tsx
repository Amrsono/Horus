"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Truck, MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero3D() {
    const { locale } = useLanguage();
    const isAr = locale === "ar";

    return (
        <div className="w-full bg-[var(--background)] text-[var(--foreground)] overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            {/* Hero Main Banner */}
            <div data-force-dark="true" className="relative w-full min-h-[480px] md:min-h-[560px] bg-slate-950 flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out hover:scale-100"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=2000')`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/80" />

                {/* Content Overlay */}
                <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-20 flex flex-col items-center">
                    <motion.span
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ color: "#ffffff" }}
                        className="inline-block px-3.5 py-1 bg-white/10 backdrop-blur-md text-white text-xs uppercase font-bold tracking-widest rounded-full mb-6 border border-white/20 shadow-sm"
                    >
                        {isAr ? "المتجر الأول للفيب في مصر" : "Egypt's Premier Vaping Destination"}
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        style={{ color: "#ffffff" }}
                        className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-lg"
                    >
                        {isAr ? "تصفح أحدث منتجاتنا" : "Browse our latest products"}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        style={{ color: "#cbd5e1" }}
                        className="text-slate-300 text-base md:text-xl max-w-2xl mb-10 leading-relaxed font-normal drop-shadow"
                    >
                        {isAr
                            ? "اكتشف تشكيلة مميزة من السوائل المستوردة والمحلية، البودات، والتانكات المبتكرة بأفضل جودة وسعر."
                            : "Discover top-tier imported and local e-liquids, pod systems, and mods with guaranteed genuine authenticity."}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link
                            href="/shop"
                            style={{ color: "#ffffff" }}
                            className="px-8 py-3.5 bg-[#c91c1c] text-white hover:bg-[#a51616] font-bold text-sm uppercase tracking-wider rounded-md transition-all shadow-lg hover:shadow-red-900/30 flex items-center gap-2 cursor-pointer"
                        >
                            <span style={{ color: "#ffffff" }}>{isAr ? "تسوق الآن" : "Shop Now"}</span>
                            <ArrowRight className="w-4 h-4 rtl:rotate-180 text-white" />
                        </Link>
                        <Link
                            href="/track"
                            style={{ color: "#ffffff" }}
                            className="px-7 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold text-sm uppercase tracking-wider rounded-md transition-all border border-white/30 hover:border-white/50 backdrop-blur-md flex items-center gap-2.5 shadow-md cursor-pointer group"
                        >
                            <Truck className="w-4 h-4 text-[#c91c1c] group-hover:scale-110 transition-transform" />
                            <span style={{ color: "#ffffff" }} className="text-white font-bold tracking-wider">
                                {isAr ? "تتبع طلبك" : "Track Order"}
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Value Propositions Strip */}
            <div className="border-b border-[var(--border-subtle)] bg-[var(--surface)] py-10 px-6 transition-colors">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left rtl:md:text-right">
                    {/* Fast Delivery */}
                    <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg">
                        <div className="w-14 h-14 rounded-full bg-[var(--surface-subtle)] flex items-center justify-center shrink-0 text-[var(--primary-accent)]">
                            <Truck className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[var(--text-main)]">
                                {isAr ? "توصيل سريع" : "Fast Delivery"}
                            </h3>
                            <p className="text-sm text-[var(--text-muted)] mt-0.5">
                                {isAr ? "استلم طلبك خلال 24 - 48 ساعة" : "Get your order within 48 Hrs"}
                            </p>
                        </div>
                    </div>

                    {/* Support */}
                    <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg">
                        <div className="w-14 h-14 rounded-full bg-[var(--surface-subtle)] flex items-center justify-center shrink-0 text-[var(--primary-accent)]">
                            <MessageCircle className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[var(--text-main)]">
                                {isAr ? "دعم متميز ومستمر" : "Top-Notch Support"}
                            </h3>
                            <p className="text-sm text-[var(--text-muted)] mt-0.5">
                                {isAr ? "رضاك واستمتاعك أولويتنا الدائمة" : "Your Vape Satisfaction is our Priority"}
                            </p>
                        </div>
                    </div>

                    {/* Authenticity */}
                    <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg">
                        <div className="w-14 h-14 rounded-full bg-[var(--surface-subtle)] flex items-center justify-center shrink-0 text-[var(--primary-accent)]">
                            <ShieldCheck className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[var(--text-main)]">
                                {isAr ? "منتجات أصلية 100%" : "100% Authentic"}
                            </h3>
                            <p className="text-sm text-[var(--text-muted)] mt-0.5">
                                {isAr ? "جميع المنتجات مفحوصة ومضمونة الجودة" : "Direct from trusted certified brands"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
