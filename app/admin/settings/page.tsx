"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent, PrivacyContent, TermsContent, ContactContent, AboutContent } from "@/contexts/SiteContentContext";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Palette, ShieldCheck, FileText, PhoneCall, Info, Save, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

type SettingsTab = "theme" | "privacy" | "terms" | "contact" | "about";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { t, locale } = useLanguage();
    const isAr = locale === "ar";
    const { content, updateSection } = useSiteContent();

    const [activeTab, setActiveTab] = useState<SettingsTab>("theme");
    const [themeNotice, setThemeNotice] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

    // Form states
    const [privacyForm, setPrivacyForm] = useState<PrivacyContent>(content.privacy);
    const [termsForm, setTermsForm] = useState<TermsContent>(content.terms);
    const [contactForm, setContactForm] = useState<ContactContent>(content.contact);
    const [aboutForm, setAboutForm] = useState<AboutContent>(content.about);

    const themes = [
        {
            id: "obsidian",
            name: t.admin.settings.theme.options.obsidian,
            color: "#0a0a0f",
            accent: "#00d4ff",
            textColor: "#ffffff"
        },
        {
            id: "brown",
            name: t.admin.settings.theme.options.brown,
            color: "#2a1b15",
            accent: "#f59e0b",
            textColor: "#fef3c7"
        },
        {
            id: "neon-blue",
            name: t.admin.settings.theme.options.neon_blue,
            color: "#050a14",
            accent: "#00d4ff",
            textColor: "#f0f9ff"
        },
        {
            id: "light",
            name: t.admin.settings.theme.options.light || "Pure White",
            color: "#ffffff",
            accent: "#c91c1c",
            textColor: "#0f172a",
            previewBorder: true
        }
    ];

    const handleSelectTheme = (themeId: any) => {
        setTheme(themeId);
        setThemeNotice(true);
        setTimeout(() => setThemeNotice(false), 3000);
    };

    const handleSavePrivacy = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const ok = await updateSection("privacy", privacyForm);
        setIsSaving(false);
        if (ok) {
            setSaveSuccess(isAr ? "تم حفظ وتحديث سياسة الخصوصية بنجاح!" : "Privacy Policy updated successfully!");
            setTimeout(() => setSaveSuccess(null), 3500);
        }
    };

    const handleSaveTerms = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const ok = await updateSection("terms", termsForm);
        setIsSaving(false);
        if (ok) {
            setSaveSuccess(isAr ? "تم حفظ وتحديث الشروط والأحكام بنجاح!" : "Terms of Service updated successfully!");
            setTimeout(() => setSaveSuccess(null), 3500);
        }
    };

    const handleSaveContact = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const ok = await updateSection("contact", contactForm);
        setIsSaving(false);
        if (ok) {
            setSaveSuccess(isAr ? "تم حفظ وتحديث بيانات التواصل بنجاح!" : "Contact and store information updated successfully!");
            setTimeout(() => setSaveSuccess(null), 3500);
        }
    };

    const handleSaveAbout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const ok = await updateSection("about", aboutForm);
        setIsSaving(false);
        if (ok) {
            setSaveSuccess(isAr ? "تم حفظ وتحديث صفحة من نحن بنجاح!" : "About Us page updated successfully!");
            setTimeout(() => setSaveSuccess(null), 3500);
        }
    };

    const tabs: { id: SettingsTab; name: string; icon: any }[] = [
        { id: "theme", name: t.admin.settings.tabs?.theme || (isAr ? "المظهر والألوان" : "Theme & Aesthetics"), icon: Palette },
        { id: "about", name: isAr ? "صفحة من نحن" : "About Us Page", icon: Info },
        { id: "privacy", name: t.admin.settings.tabs?.privacy || (isAr ? "سياسة الخصوصية" : "Privacy Policy"), icon: ShieldCheck },
        { id: "terms", name: t.admin.settings.tabs?.terms || (isAr ? "الشروط والأحكام" : "Terms of Service"), icon: FileText },
        { id: "contact", name: t.admin.settings.tabs?.contact || (isAr ? "بيانات التواصل والمتجر" : "Contact & Store Info"), icon: PhoneCall },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
            dir={isAr ? "rtl" : "ltr"}
        >
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-1 tracking-tight">
                        {t.admin.settings.title}
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm">{t.admin.settings.subtitle}</p>
                </div>

                <AnimatePresence>
                    {(themeNotice || saveSuccess) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold shadow-sm"
                        >
                            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>
                                {saveSuccess || (isAr ? "تم تطبيق النمط الجديد على كامل المتجر!" : "Theme updated across the entire store!")}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 glass rounded-2xl border border-[var(--border-subtle)]">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                                isActive
                                    ? "bg-[var(--primary-accent)] text-[var(--primary-accent-text)] shadow-md"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-subtle)]"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* 1. Theme Tab */}
            {activeTab === "theme" && (
                <div className="glass p-6 md:p-8 rounded-2xl border border-[var(--border-subtle)] transition-all space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-[var(--text-main)] mb-1">
                            {t.admin.settings.theme.title}
                        </h2>
                        <p className="text-[var(--text-muted)] text-sm">
                            {t.admin.settings.theme.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {themes.map((tItem) => {
                            const isSelected = theme === tItem.id;

                            return (
                                <button
                                    key={tItem.id}
                                    type="button"
                                    onClick={() => handleSelectTheme(tItem.id)}
                                    className={`relative p-4 rounded-2xl text-left rtl:text-right transition-all duration-300 group cursor-pointer ${
                                        isSelected
                                            ? "ring-2 ring-[var(--primary-accent)] bg-[var(--surface-subtle)] shadow-xl scale-[1.02]"
                                            : "border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--surface)] hover:scale-[1.01]"
                                    }`}
                                >
                                    <div
                                        className="w-full h-32 rounded-xl mb-4 shadow-md flex flex-col justify-between p-4 overflow-hidden relative"
                                        style={{
                                            backgroundColor: tItem.color,
                                            border: tItem.previewBorder ? "1px solid #cbd5e1" : "1px solid rgba(255,255,255,0.1)"
                                        }}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div
                                                className="w-8 h-2 rounded-full"
                                                style={{ backgroundColor: tItem.accent }}
                                            />
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: tItem.accent, opacity: 0.8 }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div
                                                className="h-2 w-3/4 rounded"
                                                style={{
                                                    backgroundColor: tItem.id === "light" ? "#334155" : "rgba(255,255,255,0.5)"
                                                }}
                                            />
                                            <div
                                                className="h-2 w-1/2 rounded"
                                                style={{
                                                    backgroundColor: tItem.id === "light" ? "#94a3b8" : "rgba(255,255,255,0.25)"
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span
                                                className={`font-bold text-sm block ${
                                                    isSelected ? "text-[var(--primary-accent)]" : "text-[var(--text-main)]"
                                                }`}
                                            >
                                                {tItem.name}
                                            </span>
                                            <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium">
                                                {tItem.id}
                                            </span>
                                        </div>

                                        {isSelected && (
                                            <div
                                                className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md"
                                                style={{ backgroundColor: tItem.accent }}
                                            >
                                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* About Us Tab */}
            {activeTab === "about" && (
                <form onSubmit={handleSaveAbout} className="glass p-6 md:p-8 rounded-2xl border border-[var(--border-subtle)] space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
                        <div>
                            <h2 className="text-xl font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
                                <Info className="w-5 h-5 text-[var(--primary-accent)]" />
                                <span>{isAr ? "تعديل صفحة من نحن" : "Edit About Us Page"}</span>
                            </h2>
                            <p className="text-xs md:text-sm text-[var(--text-muted)]">
                                {isAr ? "عدّل قصة المتجر ورؤيته ومحتوى صفحة /about" : "Customize brand story, mission, and content shown on /about"}
                            </p>
                        </div>

                        <Link
                            href="/about"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary-accent)] hover:underline self-start sm:self-auto"
                        >
                            <span>{isAr ? "معاينة الصفحة المباشرة" : "View Live Page"}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "عنوان الصفحة (بالإنجليزية)" : "Page Title (English)"}
                            </label>
                            <input
                                type="text"
                                value={aboutForm.title_en}
                                onChange={(e) => setAboutForm({ ...aboutForm, title_en: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "عنوان الصفحة (بالعربية)" : "Page Title (Arabic)"}
                            </label>
                            <input
                                type="text"
                                dir="rtl"
                                value={aboutForm.title_ar}
                                onChange={(e) => setAboutForm({ ...aboutForm, title_ar: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "الوصف التمهيدي (بالإنجليزية)" : "Hero Subtitle (English)"}
                            </label>
                            <textarea
                                rows={3}
                                value={aboutForm.subtitle_en}
                                onChange={(e) => setAboutForm({ ...aboutForm, subtitle_en: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "الوصف التمهيدي (بالعربية)" : "Hero Subtitle (Arabic)"}
                            </label>
                            <textarea
                                rows={3}
                                dir="rtl"
                                value={aboutForm.subtitle_ar}
                                onChange={(e) => setAboutForm({ ...aboutForm, subtitle_ar: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "عنوان قصة المتجر (بالإنجليزية)" : "Story Title (English)"}
                            </label>
                            <input
                                type="text"
                                value={aboutForm.story_title_en}
                                onChange={(e) => setAboutForm({ ...aboutForm, story_title_en: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "عنوان قصة المتجر (بالعربية)" : "Story Title (Arabic)"}
                            </label>
                            <input
                                type="text"
                                dir="rtl"
                                value={aboutForm.story_title_ar}
                                onChange={(e) => setAboutForm({ ...aboutForm, story_title_ar: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "نص القصة (بالإنجليزية)" : "Story Content (English)"}
                            </label>
                            <textarea
                                rows={6}
                                value={aboutForm.story_en}
                                onChange={(e) => setAboutForm({ ...aboutForm, story_en: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "نص القصة (بالعربية)" : "Story Content (Arabic)"}
                            </label>
                            <textarea
                                rows={6}
                                dir="rtl"
                                value={aboutForm.story_ar}
                                onChange={(e) => setAboutForm({ ...aboutForm, story_ar: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "المهمة (Mission - English)" : "Mission (English)"}
                            </label>
                            <textarea
                                rows={3}
                                value={aboutForm.mission_en}
                                onChange={(e) => setAboutForm({ ...aboutForm, mission_en: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "المهمة (Mission - بالعربية)" : "Mission (Arabic)"}
                            </label>
                            <textarea
                                rows={3}
                                dir="rtl"
                                value={aboutForm.mission_ar}
                                onChange={(e) => setAboutForm({ ...aboutForm, mission_ar: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "الرؤية (Vision - English)" : "Vision (English)"}
                            </label>
                            <textarea
                                rows={3}
                                value={aboutForm.vision_en}
                                onChange={(e) => setAboutForm({ ...aboutForm, vision_en: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "الرؤية (Vision - بالعربية)" : "Vision (Arabic)"}
                            </label>
                            <textarea
                                rows={3}
                                dir="rtl"
                                value={aboutForm.vision_ar}
                                onChange={(e) => setAboutForm({ ...aboutForm, vision_ar: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-bold rounded-xl transition-all shadow-md hover:opacity-90 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{isAr ? "حفظ التغييرات ونشرها" : "Save & Publish Changes"}</span>
                        </button>
                    </div>
                </form>
            )}

            {/* 2. Privacy Policy Tab */}
            {activeTab === "privacy" && (
                <form onSubmit={handleSavePrivacy} className="glass p-6 md:p-8 rounded-2xl border border-[var(--border-subtle)] space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
                        <div>
                            <h2 className="text-xl font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-[var(--primary-accent)]" />
                                <span>{isAr ? "تعديل صفحة سياسة الخصوصية" : "Edit Privacy Policy Page"}</span>
                            </h2>
                            <p className="text-xs md:text-sm text-[var(--text-muted)]">
                                {isAr ? "عدّل نصوص وسياسات الخصوصية التي تظهر في صفحة /privacy" : "Customize the privacy policy content displayed at /privacy"}
                            </p>
                        </div>

                        <Link
                            href="/privacy"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary-accent)] hover:underline self-start sm:self-auto"
                        >
                            <span>{isAr ? "معاينة الصفحة المباشرة" : "View Live Page"}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "العنوان بالإنجليزية" : "Title (English)"}
                            </label>
                            <input
                                type="text"
                                value={privacyForm.title_en}
                                onChange={(e) => setPrivacyForm({ ...privacyForm, title_en: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "العنوان بالعربية" : "Title (Arabic)"}
                            </label>
                            <input
                                type="text"
                                value={privacyForm.title_ar}
                                onChange={(e) => setPrivacyForm({ ...privacyForm, title_ar: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "تاريخ التحديث" : "Last Updated Text"}
                            </label>
                            <input
                                type="text"
                                value={privacyForm.last_updated}
                                onChange={(e) => setPrivacyForm({ ...privacyForm, last_updated: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "نص الخصوصية (الإنجليزية)" : "Privacy Content (English)"}
                            </label>
                            <textarea
                                rows={14}
                                value={privacyForm.content_en}
                                onChange={(e) => setPrivacyForm({ ...privacyForm, content_en: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-4 text-sm text-[var(--text-main)] font-mono leading-relaxed focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "نص الخصوصية (العربية)" : "Privacy Content (Arabic)"}
                            </label>
                            <textarea
                                rows={14}
                                dir="rtl"
                                value={privacyForm.content_ar}
                                onChange={(e) => setPrivacyForm({ ...privacyForm, content_ar: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-4 text-sm text-[var(--text-main)] leading-relaxed focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-bold rounded-xl transition-all shadow-md hover:opacity-90 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{isAr ? "حفظ التغييرات ونشرها" : "Save & Publish Changes"}</span>
                        </button>
                    </div>
                </form>
            )}

            {/* 3. Terms of Service Tab */}
            {activeTab === "terms" && (
                <form onSubmit={handleSaveTerms} className="glass p-6 md:p-8 rounded-2xl border border-[var(--border-subtle)] space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
                        <div>
                            <h2 className="text-xl font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[var(--primary-accent)]" />
                                <span>{isAr ? "تعديل صفحة الشروط والأحكام" : "Edit Terms of Service Page"}</span>
                            </h2>
                            <p className="text-xs md:text-sm text-[var(--text-muted)]">
                                {isAr ? "عدّل شروط الاستخدام وسياسة السن القانوني التي تظهر في صفحة /terms" : "Customize terms, warranty, and 21+ age policies displayed at /terms"}
                            </p>
                        </div>

                        <Link
                            href="/terms"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary-accent)] hover:underline self-start sm:self-auto"
                        >
                            <span>{isAr ? "معاينة الصفحة المباشرة" : "View Live Page"}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "العنوان بالإنجليزية" : "Title (English)"}
                            </label>
                            <input
                                type="text"
                                value={termsForm.title_en}
                                onChange={(e) => setTermsForm({ ...termsForm, title_en: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "العنوان بالعربية" : "Title (Arabic)"}
                            </label>
                            <input
                                type="text"
                                value={termsForm.title_ar}
                                onChange={(e) => setTermsForm({ ...termsForm, title_ar: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "تاريخ التحديث" : "Last Updated Text"}
                            </label>
                            <input
                                type="text"
                                value={termsForm.last_updated}
                                onChange={(e) => setTermsForm({ ...termsForm, last_updated: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "نص الشروط (الإنجليزية)" : "Terms Content (English)"}
                            </label>
                            <textarea
                                rows={14}
                                value={termsForm.content_en}
                                onChange={(e) => setTermsForm({ ...termsForm, content_en: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-4 text-sm text-[var(--text-main)] font-mono leading-relaxed focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "نص الشروط (العربية)" : "Terms Content (Arabic)"}
                            </label>
                            <textarea
                                rows={14}
                                dir="rtl"
                                value={termsForm.content_ar}
                                onChange={(e) => setTermsForm({ ...termsForm, content_ar: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-4 text-sm text-[var(--text-main)] leading-relaxed focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-bold rounded-xl transition-all shadow-md hover:opacity-90 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{isAr ? "حفظ التغييرات ونشرها" : "Save & Publish Changes"}</span>
                        </button>
                    </div>
                </form>
            )}

            {/* 4. Contact Us Tab */}
            {activeTab === "contact" && (
                <form onSubmit={handleSaveContact} className="glass p-6 md:p-8 rounded-2xl border border-[var(--border-subtle)] space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
                        <div>
                            <h2 className="text-xl font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
                                <PhoneCall className="w-5 h-5 text-[var(--primary-accent)]" />
                                <span>{isAr ? "تعديل بيانات التواصل والمتجر" : "Edit Contact & Store Information"}</span>
                            </h2>
                            <p className="text-xs md:text-sm text-[var(--text-muted)]">
                                {isAr ? "عدّل أرقام الهواتف، الواتساب، والبريد وعنوان المتجر التي تظهر في صفحة /contact والتذييل" : "Update phone, WhatsApp, email, hours and physical address displayed at /contact and footer"}
                            </p>
                        </div>

                        <Link
                            href="/contact"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary-accent)] hover:underline self-start sm:self-auto"
                        >
                            <span>{isAr ? "معاينة الصفحة المباشرة" : "View Live Page"}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "البريد الإلكتروني للدعم" : "Support Email"}
                            </label>
                            <input
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "رقم الهاتف المباشر" : "Direct Phone"}
                            </label>
                            <input
                                type="text"
                                value={contactForm.phone}
                                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "رقم الواتساب" : "WhatsApp Number"}
                            </label>
                            <input
                                type="text"
                                value={contactForm.whatsapp}
                                onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "العنوان (بالإنجليزية)" : "Address (English)"}
                            </label>
                            <input
                                type="text"
                                value={contactForm.address_en}
                                onChange={(e) => setContactForm({ ...contactForm, address_en: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "العنوان (بالعربية)" : "Address (Arabic)"}
                            </label>
                            <input
                                type="text"
                                dir="rtl"
                                value={contactForm.address_ar}
                                onChange={(e) => setContactForm({ ...contactForm, address_ar: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "أوقات العمل (بالإنجليزية)" : "Working Hours (English)"}
                            </label>
                            <input
                                type="text"
                                value={contactForm.working_hours_en}
                                onChange={(e) => setContactForm({ ...contactForm, working_hours_en: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "أوقات العمل (بالعربية)" : "Working Hours (Arabic)"}
                            </label>
                            <input
                                type="text"
                                dir="rtl"
                                value={contactForm.working_hours_ar}
                                onChange={(e) => setContactForm({ ...contactForm, working_hours_ar: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "وصف مختصر (بالإنجليزية)" : "Intro Subtitle (English)"}
                            </label>
                            <textarea
                                rows={3}
                                value={contactForm.subtitle_en}
                                onChange={(e) => setContactForm({ ...contactForm, subtitle_en: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mb-1.5">
                                {isAr ? "وصف مختصر (بالعربية)" : "Intro Subtitle (Arabic)"}
                            </label>
                            <textarea
                                rows={3}
                                dir="rtl"
                                value={contactForm.subtitle_ar}
                                onChange={(e) => setContactForm({ ...contactForm, subtitle_ar: e.target.value })}
                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-bold rounded-xl transition-all shadow-md hover:opacity-90 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{isAr ? "حفظ التغييرات ونشرها" : "Save & Publish Changes"}</span>
                        </button>
                    </div>
                </form>
            )}
        </motion.div>
    );
}

