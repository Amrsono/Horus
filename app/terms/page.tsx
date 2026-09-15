"use client";

import { motion } from "framer-motion";
import { FileText, Calendar, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/contexts/SiteContentContext";

export default function TermsPage() {
    const { locale } = useLanguage();
    const isAr = locale === "ar";
    const { content } = useSiteContent();
    const terms = content.terms;

    const title = isAr ? terms.title_ar : terms.title_en;
    const bodyText = isAr ? terms.content_ar : terms.content_en;

    const paragraphs = bodyText.split("\n\n").filter(Boolean);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans" dir={isAr ? "rtl" : "ltr"}>
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
                {/* Navigation Back */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--primary-accent)] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                        <span>{isAr ? "العودة للرئيسية" : "Back to Home"}</span>
                    </Link>
                </div>

                {/* Header Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-2xl mx-auto mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary-accent)]/15 border border-[var(--primary-accent)]/30 text-[var(--primary-accent)] text-xs font-bold uppercase tracking-wider mb-4">
                        <FileText className="w-4 h-4" />
                        <span>{isAr ? "اتفاقية الاستخدام والبيع" : "Customer Agreement & Policies"}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text-main)] mb-4">
                        {title}
                    </h1>

                    <div className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                            {isAr ? "آخر تحديث: " : "Last Updated: "}
                            {terms.last_updated}
                        </span>
                    </div>
                </motion.div>

                {/* Age Notice Callout */}
                <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                    <div className="text-xs md:text-sm leading-relaxed">
                        <span className="font-bold block mb-0.5">
                            {isAr ? "تنبيه هام للسن القانوني (٢١ عاماً فأكثر):" : "Strict Age Restriction (21+ Only):"}
                        </span>
                        <span>
                            {isAr
                                ? "يُحظر بيع منتجات الفيب لمن هم دون سن ٢١ عاماً. جميع المنتجات مخصصة للبالغين فقط."
                                : "The sale of e-liquids and vape hardware to individuals under 21 is strictly prohibited by law."}
                        </span>
                    </div>
                </div>

                {/* Content Body */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-6 md:p-12 border border-[var(--border-subtle)] shadow-xl space-y-6"
                >
                    {paragraphs.map((para, idx) => {
                        const lines = para.split("\n");
                        const isHeading = lines[0].match(/^\d+\./) || lines[0].match(/^[١-٩]+\./);

                        if (isHeading) {
                            return (
                                <div key={idx} className="space-y-2 pt-3 first:pt-0">
                                    <h2 className="text-lg md:text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[var(--primary-accent)] inline-block"></span>
                                        {lines[0]}
                                    </h2>
                                    {lines.slice(1).map((subLine, sIdx) => (
                                        <p key={sIdx} className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
                                            {subLine}
                                        </p>
                                    ))}
                                </div>
                            );
                        }

                        return (
                            <p key={idx} className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
                                {para}
                            </p>
                        );
                    })}
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
