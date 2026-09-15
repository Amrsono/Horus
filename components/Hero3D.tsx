"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Truck, MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero3D() {
    const { locale } = useLanguage();
    const isAr = locale === "ar";

    return (
        <div className="w-full bg-white text-slate-900 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            {/* Hero Main Banner */}
            <div className="relative w-full min-h-[480px] md:min-h-[560px] bg-slate-950 flex items-center justify-center overflow-hidden">
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
                        className="inline-block px-3 py-1 bg-white/10 backdrop-blur-xs text-white/90 text-xs uppercase font-bold tracking-widest rounded-full mb-6 border border-white/15"
                    >
                        {isAr ? "المتجر الأول للفيب في مصر" : "Egypt's Premier Vaping Destination"}
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6"
                    >
                        {isAr ? "تصفح أحدث منتجاتنا" : "Browse our latest products"}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-slate-300 text-base md:text-xl max-w-2xl mb-10 leading-relaxed font-normal"
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
                            className="px-8 py-3.5 bg-[#c91c1c] text-white hover:bg-[#a51616] font-bold text-sm uppercase tracking-wider rounded-md transition-all shadow-lg hover:shadow-red-900/30 flex items-center gap-2"
                        >
                            <span>{isAr ? "تسوق الآن" : "Shop Now"}</span>
                            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        </Link>
                        <Link
                            href="/track"
                            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-md transition-all border border-white/20 backdrop-blur-xs flex items-center gap-2"
                        >
                            <Truck className="w-4 h-4 text-[#c91c1c]" />
                            <span>{isAr ? "تتبع طلبك" : "Track Order"}</span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Value Propositions Strip (CircleV style) */}
            <div className="border-b border-slate-200 bg-white py-10 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left rtl:md:text-right">
                    {/* Fast Delivery */}
                    <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                            <Truck className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">
                                {isAr ? "توصيل سريع" : "Fast Delivery"}
                            </h3>
                            <p className="text-sm text-slate-500 mt-0.5">
                                {isAr ? "استلم طلبك خلال 24 - 48 ساعة" : "Get your order within 48 Hrs"}
                            </p>
                        </div>
                    </div>

                    {/* Support */}
                    <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                            <MessageCircle className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">
                                {isAr ? "دعم متميز ومستمر" : "Top-Notch Support"}
                            </h3>
                            <p className="text-sm text-slate-500 mt-0.5">
                                {isAr ? "رضاك واستمتاعك أولويتنا الدائمة" : "Your Vape Satisfaction is our Priority"}
                            </p>
                        </div>
                    </div>

                    {/* Authenticity */}
                    <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                            <ShieldCheck className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">
                                {isAr ? "منتجات أصلية 100%" : "100% Authentic"}
                            </h3>
                            <p className="text-sm text-slate-500 mt-0.5">
                                {isAr ? "جميع المنتجات مفحوصة ومضمونة الجودة" : "Direct from trusted certified brands"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
