"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Flame, ShoppingBag, ArrowRight, ArrowLeft, X, ChevronRight, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SideBanners() {
    const pathname = usePathname();
    const { locale } = useLanguage();
    const isAr = locale === "ar";

    const [leftVisible, setLeftVisible] = useState(true);
    const [rightVisible, setRightVisible] = useState(true);
    const [mobilePromoOpen, setMobilePromoOpen] = useState(false);
    const [mobileDismissed, setMobileDismissed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Do not show on admin dashboard pages
    if (!mounted || pathname?.startsWith("/admin")) {
        return null;
    }

    return (
        <>
            {/* ================= LEFT BANNER ================= */}
            <aside
                aria-label="Promotional banner - Vape Hardware"
                className="hidden min-[1400px]:block fixed left-2 xl:left-3 2xl:left-6 top-24 z-30 w-48 xl:w-56 2xl:w-64 select-none"
            >
                <AnimatePresence mode="wait">
                    {leftVisible ? (
                        <motion.div
                            key="left-expanded"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="relative group rounded-2xl overflow-hidden border border-cyan-500/30 bg-black/60 shadow-[0_0_30px_rgba(0,212,255,0.15)] backdrop-blur-md h-[calc(100vh-8rem)] max-h-[680px] flex flex-col justify-between p-4"
                        >
                            {/* Realistic Vape Image Background */}
                            <div className="absolute inset-0 z-0 overflow-hidden">
                                <img
                                    src="/banners/banner-left.jpg"
                                    alt="CLOUDS Pro Vape Mods"
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                {/* Dual Gradient vignette overlays */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/95 pointer-events-none" />
                                <div className="absolute inset-0 bg-cyan-950/15 mix-blend-color-dodge pointer-events-none" />
                            </div>

                            {/* Top Header & Dismiss Button */}
                            <div className="relative z-10 flex items-start justify-between gap-2">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                                    <span>{isAr ? "أجهزة أصلية ٢٠٢٦" : "NEW HARDWARE"}</span>
                                </div>

                                <button
                                    onClick={() => setLeftVisible(false)}
                                    className="p-1 rounded-lg bg-black/40 text-zinc-400 hover:text-white hover:bg-black/70 transition-colors cursor-pointer"
                                    title={isAr ? "تصغير الإعلان" : "Minimize banner"}
                                    aria-label="Minimize left banner"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Center Tag / Highlight */}
                            <div className="relative z-10 my-auto text-center space-y-1">
                                <div className="inline-block px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-zinc-300 uppercase tracking-widest">
                                    SUB-OHM 80W PRO
                                </div>
                            </div>

                            {/* Bottom Card / CTA */}
                            <div className="relative z-10 space-y-3 pt-4 border-t border-white/10">
                                <div>
                                    <h3 className="font-black text-base 2xl:text-lg text-white leading-tight drop-shadow-md">
                                        {isAr ? "أقوى أجهزة المود والبودات" : "Cyber Mod 80W Series"}
                                    </h3>
                                    <p className="text-[11px] text-zinc-300 mt-1 leading-snug line-clamp-2">
                                        {isAr
                                            ? "أداء استثنائي، بطارية تدوم طويلاً، وتحكم دقيق في سحب الدخان."
                                            : "Instant 0.001s fire rate, military-grade alloy & pure flavor coils."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 pt-1">
                                    <span className="inline-flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                                        {isAr ? "ضمان ١٤ يوماً" : "14-Day Warranty"}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[10px] uppercase">
                                        {isAr ? "كود فحص أصلي" : "Scratch Code"}
                                    </span>
                                </div>

                                <Link
                                    href="/shop"
                                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all hover:scale-[1.02] cursor-pointer"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5 text-black" />
                                    <span>{isAr ? "تصفح الأجهزة" : "Explore Hardware"}</span>
                                    {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="left-collapsed"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onClick={() => setLeftVisible(true)}
                            className="flex items-center gap-2 p-2.5 rounded-r-xl bg-cyan-950/80 border-y border-r border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-lg backdrop-blur-md hover:bg-cyan-900/80 transition-all cursor-pointer group"
                            title={isAr ? "إظهار الإعلان" : "Show banner"}
                        >
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            <span className="[writing-mode:vertical-lr] rotate-180 uppercase tracking-widest text-[10px] font-black">
                                {isAr ? "أجهزة المود الحديثة" : "PRO HARDWARE"}
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </aside>

            {/* ================= RIGHT BANNER ================= */}
            <aside
                aria-label="Promotional banner - E-Liquids"
                className="hidden min-[1400px]:block fixed right-2 xl:right-3 2xl:right-6 top-24 z-30 w-48 xl:w-56 2xl:w-64 select-none"
            >
                <AnimatePresence mode="wait">
                    {rightVisible ? (
                        <motion.div
                            key="right-expanded"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="relative group rounded-2xl overflow-hidden border border-amber-500/30 bg-black/60 shadow-[0_0_30px_rgba(245,158,11,0.15)] backdrop-blur-md h-[calc(100vh-8rem)] max-h-[680px] flex flex-col justify-between p-4"
                        >
                            {/* Realistic Vape Image Background */}
                            <div className="absolute inset-0 z-0 overflow-hidden">
                                <img
                                    src="/banners/banner-right.jpg"
                                    alt="CLOUDS Premium E-Liquids"
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                {/* Dual Gradient vignette overlays */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/95 pointer-events-none" />
                                <div className="absolute inset-0 bg-amber-950/15 mix-blend-color-dodge pointer-events-none" />
                            </div>

                            {/* Top Header & Dismiss Button */}
                            <div className="relative z-10 flex items-start justify-between gap-2">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
                                    <Flame className="w-3 h-3 text-amber-400" />
                                    <span>{isAr ? "نكهات فاخرة أصلية" : "ARTISANAL RESERVE"}</span>
                                </div>

                                <button
                                    onClick={() => setRightVisible(false)}
                                    className="p-1 rounded-lg bg-black/40 text-zinc-400 hover:text-white hover:bg-black/70 transition-colors cursor-pointer"
                                    title={isAr ? "تصغير الإعلان" : "Minimize banner"}
                                    aria-label="Minimize right banner"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Center Tag / Highlight */}
                            <div className="relative z-10 my-auto text-center space-y-1">
                                <div className="inline-block px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-zinc-300 uppercase tracking-widest">
                                    GOLDEN AMBER 30ML
                                </div>
                            </div>

                            {/* Bottom Card / CTA */}
                            <div className="relative z-10 space-y-3 pt-4 border-t border-white/10">
                                <div>
                                    <h3 className="font-black text-base 2xl:text-lg text-white leading-tight drop-shadow-md">
                                        {isAr ? "أرقى السوائل والنكهات" : "Golden Reserve Juices"}
                                    </h3>
                                    <p className="text-[11px] text-zinc-300 mt-1 leading-snug line-clamp-2">
                                        {isAr
                                            ? "نكهات نقية مستوردة مصممة لتقديم تجربة سحب ناعمة وغنية."
                                            : "Artisanal salt & freebase crafted with pharmaceutical purity."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 pt-1">
                                    <span className="inline-flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        {isAr ? "وارد المعامل العالمية" : "Certified Labs"}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-[10px] uppercase">
                                        {isAr ? "نقاء ١٠٠٪" : "Pure Salt Nic"}
                                    </span>
                                </div>

                                <Link
                                    href="/shop"
                                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] cursor-pointer"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5 text-black" />
                                    <span>{isAr ? "تسوق النكهات" : "Browse E-Liquids"}</span>
                                    {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="right-collapsed"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            onClick={() => setRightVisible(true)}
                            className="flex items-center gap-2 p-2.5 rounded-l-xl bg-amber-950/80 border-y border-l border-amber-500/40 text-amber-300 text-xs font-bold shadow-lg backdrop-blur-md hover:bg-amber-900/80 transition-all cursor-pointer group ml-auto"
                            title={isAr ? "إظهار الإعلان" : "Show banner"}
                        >
                            <span className="[writing-mode:vertical-lr] rotate-180 uppercase tracking-widest text-[10px] font-black">
                                {isAr ? "نكهات حصرية" : "RESERVE JUICES"}
                            </span>
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </aside>

            {/* ================= MOBILE / TABLET FLOATING PROMO PILL & MODAL (< 1400px) ================= */}
            <div className="block min-[1400px]:hidden">
                {/* Floating Mobile Promo Pill */}
                <AnimatePresence>
                    {!mobileDismissed && (
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.95 }}
                            transition={{ delay: 1, duration: 0.4 }}
                            className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:w-80 z-40 select-none"
                            dir={isAr ? "rtl" : "ltr"}
                        >
                            <div className="glass p-2.5 rounded-2xl border border-[var(--primary-accent)]/40 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center justify-between gap-3 bg-[var(--surface)]/95 backdrop-blur-md">
                                <button
                                    onClick={() => setMobilePromoOpen(true)}
                                    className="flex items-center gap-2.5 flex-1 min-w-0 text-left rtl:text-right cursor-pointer"
                                >
                                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-cyan-500/40">
                                        <img
                                            src="/banners/banner-left.jpg"
                                            alt="Vape Promo"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-cyan-500/10" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                                            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                                                {isAr ? "عروض حصرية ٢٠٢٦" : "SPECIAL DROPS"}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-[var(--text-main)] truncate">
                                            {isAr ? "أجهزة المود 80W وسوائل فاخرة" : "80W Mods & Artisanal Juices"}
                                        </p>
                                    </div>
                                </button>

                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => setMobilePromoOpen(true)}
                                        className="px-2.5 py-1.5 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] rounded-xl text-[11px] font-extrabold shadow-sm active:scale-95 transition-transform cursor-pointer"
                                    >
                                        {isAr ? "مشاهدة" : "View"}
                                    </button>
                                    <button
                                        onClick={() => setMobileDismissed(true)}
                                        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg cursor-pointer"
                                        aria-label="Dismiss banner"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Full Promo Modal / Bottom Sheet */}
                <AnimatePresence>
                    {mobilePromoOpen && (
                        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4" dir={isAr ? "rtl" : "ltr"}>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setMobilePromoOpen(false)}
                                className="fixed inset-0 bg-black/75 backdrop-blur-sm"
                            />

                            {/* Sheet Content */}
                            <motion.div
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: "100%", opacity: 0 }}
                                transition={{ type: "spring", damping: 26, stiffness: 280 }}
                                className="relative w-full sm:max-w-lg bg-[var(--surface)] border-t sm:border border-[var(--border-subtle)] rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl z-10"
                            >
                                {/* Sheet Header */}
                                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[var(--primary-accent)]" />
                                        <h3 className="font-extrabold text-base text-[var(--text-main)]">
                                            {isAr ? "عروض ومنتجات حصرية" : "Exclusive Featured Banners"}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setMobilePromoOpen(false)}
                                        className="p-1.5 rounded-full bg-[var(--surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Banner 1: Hardware */}
                                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-black p-4 min-h-[190px] flex flex-col justify-between">
                                    <img
                                        src="/banners/banner-left.jpg"
                                        alt="Cyber Mods 80W"
                                        className="absolute inset-0 w-full h-full object-cover opacity-75"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30" />

                                    <div className="relative z-10 flex justify-between items-center">
                                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-300 text-[10px] font-black uppercase">
                                            {isAr ? "أجهزة أصلية ٢٠٢٦" : "PRO HARDWARE"}
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-black/60 px-2 py-0.5 rounded">
                                            SUB-OHM 80W
                                        </span>
                                    </div>

                                    <div className="relative z-10 space-y-2 pt-4">
                                        <div>
                                            <h4 className="font-black text-white text-base">
                                                {isAr ? "أجهزة المود والبودات الاحترافية" : "Cyber Mod 80W Series"}
                                            </h4>
                                            <p className="text-[11px] text-zinc-300 line-clamp-2">
                                                {isAr ? "إشعال فوري 0.001 ثانية مع كود فحص أصلي وضمان ١٤ يوماً." : "Instant firing, military alloy build & scratch authentication."}
                                            </p>
                                        </div>
                                        <Link
                                            href="/shop"
                                            onClick={() => setMobilePromoOpen(false)}
                                            className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-98"
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5" />
                                            <span>{isAr ? "تسوق أجهزة المود" : "Shop Hardware"}</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Banner 2: E-Liquids */}
                                <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-black p-4 min-h-[190px] flex flex-col justify-between">
                                    <img
                                        src="/banners/banner-right.jpg"
                                        alt="Golden Amber Juices"
                                        className="absolute inset-0 w-full h-full object-cover opacity-75"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30" />

                                    <div className="relative z-10 flex justify-between items-center">
                                        <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-black uppercase">
                                            {isAr ? "نكهات فاخرة معتمدة" : "ARTISANAL RESERVE"}
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded">
                                            SALT & FREEBASE
                                        </span>
                                    </div>

                                    <div className="relative z-10 space-y-2 pt-4">
                                        <div>
                                            <h4 className="font-black text-white text-base">
                                                {isAr ? "سوائل جولدن آمبر الفاخرة" : "Golden Amber Reserve Juices"}
                                            </h4>
                                            <p className="text-[11px] text-zinc-300 line-clamp-2">
                                                {isAr ? "وارد المعامل العالمية المعتمدة مع أعلى درجات النقاء الدوائي." : "Direct lab imports with pharmaceutical purity for dense aromatic clouds."}
                                            </p>
                                        </div>
                                        <Link
                                            href="/shop"
                                            onClick={() => setMobilePromoOpen(false)}
                                            className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-98"
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5" />
                                            <span>{isAr ? "تسوق النكهات" : "Browse E-Liquids"}</span>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
