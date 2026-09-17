"use client";

import { motion } from "framer-motion";
import {
    ShieldCheck,
    Truck,
    Headphones,
    Award,
    Sparkles,
    Target,
    ArrowLeft,
    CheckCircle2,
    MessageCircle,
    ShoppingBag,
    Flame,
    Users,
    ShieldAlert
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/contexts/SiteContentContext";

export default function AboutPage() {
    const { locale } = useLanguage();
    const isAr = locale === "ar";
    const { content } = useSiteContent();
    const about = content.about;
    const contact = content.contact;

    const title = isAr ? about.title_ar : about.title_en;
    const subtitle = isAr ? about.subtitle_ar : about.subtitle_en;
    const storyTitle = isAr ? about.story_title_ar : about.story_title_en;
    const storyText = isAr ? about.story_ar : about.story_en;
    const mission = isAr ? about.mission_ar : about.mission_en;
    const vision = isAr ? about.vision_ar : about.vision_en;

    const storyParagraphs = storyText.split("\n\n").filter(Boolean);
    const cleanWaNumber = contact.whatsapp.replace(/[^0-9]/g, "");

    const pillars = [
        {
            icon: ShieldCheck,
            title: isAr ? "أجهزة أصلية ١٠٠٪" : "100% Authentic Hardware",
            desc: isAr
                ? "جميع الأجهزة والبودات بختم المصنع وأكواد التحقق الأصلية دون أي تنازل."
                : "All devices and pods feature factory seal & scratch authentication codes."
        },
        {
            icon: Flame,
            title: isAr ? "سوائل ونكهات معتمدة" : "Certified Premium Liquids",
            desc: isAr
                ? "تشكيلة مختارة من أرقى العلامات العالمية والمحلية المصنوعة بأعلى معايير النقاء."
                : "Curated selections from top international & local labs meeting safety standards."
        },
        {
            icon: Truck,
            title: isAr ? "توصيل سريع لكافة المحافظات" : "Fast Nationwide Delivery",
            desc: isAr
                ? "شحن آمن ومغلف بعناية خلال 24 - 48 ساعة فقط إلى باب منزلك."
                : "Carefully packaged, trackable shipping delivered within 24 - 48 hours."
        },
        {
            icon: Headphones,
            title: isAr ? "دعم فني واستشارات متخصصة" : "Expert 1-on-1 Guidance",
            desc: isAr
                ? "فريق شغوف ومتمرس لمساعدتك في اختيار المقاومة والنكهة الأنسب لاحتياجك."
                : "Knowledgeable team to help you find the exact device, coil, and flavor."
        }
    ];

    const stats = [
        { value: "100%", label: isAr ? "منتجات أصلية معتمدة" : "Genuine & Certified" },
        { value: "24-48h", label: isAr ? "سرعة التوصيل" : "Delivery Speed" },
        { value: "14 Days", label: isAr ? "ضمان عيوب الصناعة" : "Defect Warranty" },
        { value: "21+", label: isAr ? "معايير سلامة للبالغين" : "Adult Verification" }
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans" dir={isAr ? "rtl" : "ltr"}>
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20 space-y-16">
                {/* Back to Home Breadcrumb */}
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--primary-accent)] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                        <span>{isAr ? "العودة للرئيسية" : "Back to Home"}</span>
                    </Link>
                </div>

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto space-y-5"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary-accent)]/15 border border-[var(--primary-accent)]/30 text-[var(--primary-accent)] text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>{isAr ? "تعرف على كلودز" : "Meet The CLOUDS Brand"}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-main)] leading-tight">
                        {title}
                    </h1>

                    <p className="text-base md:text-lg text-[var(--text-muted)] leading-relaxed">
                        {subtitle}
                    </p>

                    {/* Age Restriction Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] font-medium">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isAr ? "مخصص حصرياً للبالغين (٢١+ فقط)" : "Strictly 21+ Only • Responsible Vaping"}</span>
                    </div>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 glass rounded-2xl border border-[var(--border-subtle)] shadow-lg"
                >
                    {stats.map((stat, idx) => (
                        <div key={idx} className="text-center p-3 border-r last:border-r-0 border-[var(--border-subtle)] rtl:border-r-0 rtl:border-l rtl:last:border-l-0">
                            <div className="text-2xl md:text-3xl font-black text-[var(--primary-accent)] mb-1">
                                {stat.value}
                            </div>
                            <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Core Pillars Grid */}
                <div className="space-y-6">
                    <div className="text-center max-w-xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-2">
                            {isAr ? "لماذا يختارنا عشاق الفيب؟" : "The Pillars of Our Promise"}
                        </h2>
                        <p className="text-xs md:text-sm text-[var(--text-muted)]">
                            {isAr ? "معايير ثابتة وضعناها لتضمن راحة بالك وتجربة vaping لا تضاهى" : "Uncompromising principles built for your peace of mind and satisfaction"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {pillars.map((pillar, i) => {
                            const Icon = pillar.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.05 }}
                                    className="glass p-6 rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--primary-accent)]/50 transition-all hover:shadow-xl group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-[var(--primary-accent)]/10 text-[var(--primary-accent)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-base text-[var(--text-main)] mb-2">
                                            {pillar.title}
                                        </h3>
                                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                            {pillar.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Brand Story Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-3xl p-8 md:p-12 border border-[var(--border-subtle)] shadow-xl relative overflow-hidden"
                >
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--surface-subtle)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--primary-accent)] uppercase">
                            <Award className="w-3.5 h-3.5" />
                            <span>{isAr ? "رسالتنا وقصتنا" : "Our Journey"}</span>
                        </div>

                        <h2 className="text-2xl md:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
                            {storyTitle}
                        </h2>

                        <div className="space-y-4 text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
                            {storyParagraphs.map((para, idx) => (
                                <p key={idx}>{para}</p>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Mission & Vision 2-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mission */}
                    <motion.div
                        initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="glass p-8 rounded-2xl border border-[var(--border-subtle)] space-y-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-main)]">
                            {isAr ? "مهمتنا (Mission)" : "Our Mission"}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                            {mission}
                        </p>
                    </motion.div>

                    {/* Vision */}
                    <motion.div
                        initial={{ opacity: 0, x: isAr ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="glass p-8 rounded-2xl border border-[var(--border-subtle)] space-y-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-main)]">
                            {isAr ? "رؤيتنا (Vision)" : "Our Vision"}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                            {vision}
                        </p>
                    </motion.div>
                </div>

                {/* Authenticity Guarantee Callout */}
                <div className="glass p-6 md:p-8 rounded-2xl border border-[var(--primary-accent)]/30 bg-[var(--primary-accent)]/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[var(--primary-accent)] text-[var(--primary-accent-text)] flex items-center justify-center shrink-0 shadow-md">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-[var(--text-main)] mb-1">
                                {isAr ? "تعهد الأصالة والضمان الفوري" : "Authenticity Guarantee & Support"}
                            </h4>
                            <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
                                {isAr
                                    ? "نضمن لك أن كل منتج يتم طلبه عبر كلودز أصلي تماماً ويمكن التحقق منه عبر الموقع الرسمي للمصنع. استبدال فوري في حال وجود أي عيب مصنعي."
                                    : "Every unit purchased from CLOUDS can be verified on manufacturer security websites. Includes a 14-day warranty against manufacturer faults."}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                        <Link
                            href="/shop"
                            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-[var(--primary-accent)] text-[var(--primary-accent-text)] text-xs font-bold hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-2 shadow-md"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>{isAr ? "تصفح المتجر" : "Browse Shop"}</span>
                        </Link>
                        {cleanWaNumber && (
                            <a
                                href={`https://wa.me/${cleanWaNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors text-center flex items-center justify-center gap-2 shadow-md"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>{isAr ? "تواصل واتساب" : "WhatsApp"}</span>
                            </a>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
