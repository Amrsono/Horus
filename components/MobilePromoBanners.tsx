"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Flame, ShoppingBag, ArrowRight, ArrowLeft, Sparkles, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MobilePromoBanners() {
    const { locale } = useLanguage();
    const isAr = locale === "ar";

    return (
        <section
            aria-label="Featured Vape Banners"
            className="w-full py-6 md:py-10 px-4 md:px-8 border-b border-[var(--border-subtle)] bg-[var(--surface-subtle)]/40 overflow-hidden"
            dir={isAr ? "rtl" : "ltr"}
        >
            <div className="max-w-7xl mx-auto space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--primary-accent)] animate-pulse" />
                        <span className="text-[11px] md:text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
                            {isAr ? "تشكيلات كلودز الحصرية" : "Featured Collections & Drops"}
                        </span>
                    </div>
                    <Link
                        href="/shop"
                        className="text-[11px] md:text-xs font-bold text-[var(--primary-accent)] hover:underline flex items-center gap-1"
                    >
                        <span>{isAr ? "عرض الكل" : "View All"}</span>
                        {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                    </Link>
                </div>

                {/* Banner Cards Grid: Stacks on mobile, 2 columns on tablet/desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* 1. Hardware Banner Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-black/60 shadow-[0_0_25px_rgba(0,212,255,0.12)] min-h-[220px] sm:min-h-[260px] flex flex-col justify-between p-5 group"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <img
                                src="/banners/banner-left.jpg"
                                alt="CLOUDS Pro Hardware"
                                loading="lazy"
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-75"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/40" />
                            <div className="absolute inset-0 bg-cyan-950/20 mix-blend-color-dodge" />
                        </div>

                        {/* Top Badge */}
                        <div className="relative z-10 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/25 border border-cyan-400/50 text-cyan-300 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
                                <Zap className="w-3 h-3 text-cyan-300" />
                                <span>{isAr ? "أجهزة أصلية ٢٠٢٦" : "PRO HARDWARE"}</span>
                            </span>
                            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-black/50 px-2 py-0.5 rounded border border-cyan-500/30">
                                80W SUB-OHM
                            </span>
                        </div>

                        {/* Bottom Content & CTA */}
                        <div className="relative z-10 space-y-2.5 pt-6">
                            <div>
                                <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md">
                                    {isAr ? "سلسلة أجهزة المود الاحترافية" : "Cyber Mod 80W Series"}
                                </h3>
                                <p className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                                    {isAr
                                        ? "استجابة إشعال 0.001 ثانية، سبائك معدنية فائقة التحمل، وبطارية طويلة الأمد مع كود فحص أصلي."
                                        : "Instant 0.001s fire rate, military-grade alloy body, and genuine scratch-code verification."}
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-1">
                                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>{isAr ? "ضمان ١٤ يوماً ضد عيوب الصناعة" : "14-Day Warranty"}</span>
                                </div>

                                <Link
                                    href="/shop"
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all shrink-0 active:scale-95"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5 text-black" />
                                    <span>{isAr ? "تسوق الأجهزة" : "Shop Mods"}</span>
                                    {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. E-Liquids Banner Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-black/60 shadow-[0_0_25px_rgba(245,158,11,0.12)] min-h-[220px] sm:min-h-[260px] flex flex-col justify-between p-5 group"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <img
                                src="/banners/banner-right.jpg"
                                alt="CLOUDS Artisanal E-Liquids"
                                loading="lazy"
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-75"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/40" />
                            <div className="absolute inset-0 bg-amber-950/20 mix-blend-color-dodge" />
                        </div>

                        {/* Top Badge */}
                        <div className="relative z-10 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/25 border border-amber-400/50 text-amber-300 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
                                <Flame className="w-3 h-3 text-amber-300" />
                                <span>{isAr ? "نكهات وسوائل مستوردة" : "ARTISANAL RESERVE"}</span>
                            </span>
                            <span className="text-[10px] font-mono font-bold text-amber-400 bg-black/50 px-2 py-0.5 rounded border border-amber-500/30">
                                30ML / 60ML
                            </span>
                        </div>

                        {/* Bottom Content & CTA */}
                        <div className="relative z-10 space-y-2.5 pt-6">
                            <div>
                                <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md">
                                    {isAr ? "سوائل جولدن آمبر الفاخرة" : "Golden Amber Reserve"}
                                </h3>
                                <p className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                                    {isAr
                                        ? "نكهات نقية وارد المعامل العالمية المعتمدة، تركيزات سولت وفريباس متوازنة لسحب سلس وغني."
                                        : "Direct certified lab imports. Premium salt & freebase formulations for supreme cloud density."}
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-1">
                                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>{isAr ? "أصلية ومعتمدة ١٠٠٪" : "100% Pure Certified"}</span>
                                </div>

                                <Link
                                    href="/shop"
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all shrink-0 active:scale-95"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5 text-black" />
                                    <span>{isAr ? "تسوق النكهات" : "Shop Juices"}</span>
                                    {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
