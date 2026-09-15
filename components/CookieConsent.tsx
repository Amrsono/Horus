"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Check, Cookie } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
}

const STORAGE_KEY = "circlev_cookie_consent";

export default function CookieConsent() {
    const { locale } = useLanguage();
    const isAr = locale === "ar";

    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,
        analytics: true,
        marketing: true,
        functional: true,
    });

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            // Small delay for smooth entry
            const timer = setTimeout(() => setIsVisible(true), 800);
            return () => clearTimeout(timer);
        } else {
            try {
                setPreferences(JSON.parse(stored));
            } catch {
                // Keep default
            }
        }
    }, []);

    const handleAcceptAll = () => {
        const allApproved: CookiePreferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true,
        };
        setPreferences(allApproved);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allApproved));
        setIsVisible(false);
        setIsModalOpen(false);
    };

    const handleDeclineAll = () => {
        const minimal: CookiePreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false,
        };
        setPreferences(minimal);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
        setIsVisible(false);
        setIsModalOpen(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        setIsVisible(false);
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Bottom Cookie Banner */}
            <AnimatePresence>
                {isVisible && !isModalOpen && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="fixed bottom-0 inset-x-0 z-[90] bg-white border-t border-slate-200 shadow-xl px-4 py-4 md:py-5"
                        dir={isAr ? "rtl" : "ltr"}
                    >
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex-1 pr-4">
                                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                                    <Cookie className="w-4 h-4 text-[#c91c1c]" />
                                    {isAr ? "نحن نهتم بخصوصيتك" : "We value your privacy"}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {isAr
                                        ? "نستخدم ملفات تعريف الارتباط والتقنيات المماثلة لتخصيص تجربتك وتحسين موقعنا وتقديم إعلانات ملائمة. يمكنك معرفة المزيد في "
                                        : "We use cookies and other technologies to personalize your experience, perform marketing, and collect analytics. Learn more in our "}
                                    <Link href="/privacy" className="text-[#c91c1c] underline hover:text-[#991b1b]">
                                        {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
                                    </Link>
                                    .
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="text-xs md:text-sm font-medium text-slate-700 underline hover:text-slate-900 px-2 py-2"
                                >
                                    {isAr ? "إدارة التفضيلات" : "Manage preferences"}
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="px-6 py-2.5 bg-[#c91c1c] text-white hover:bg-[#a51616] text-xs md:text-sm font-semibold rounded-md transition-colors shadow-sm"
                                >
                                    {isAr ? "قبول" : "Accept"}
                                </button>
                                <button
                                    onClick={handleDeclineAll}
                                    className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs md:text-sm font-semibold rounded-md transition-colors"
                                >
                                    {isAr ? "رفض" : "Decline"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Manage Preferences Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 15 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
                            dir={isAr ? "rtl" : "ltr"}
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-[#c91c1c]" />
                                    <h3 className="font-bold text-slate-900 text-lg">
                                        {isAr ? "تفضيلات ملفات تعريف الارتباط" : "Cookie Preferences"}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto space-y-6">
                                <p className="text-sm text-slate-600">
                                    {isAr
                                        ? "عند زيارتك لأي موقع ويب، قد يتم تخزين معلومات على متصفحك أو استردادها منه، وذلك في الغالب في شكل ملفات تعريف ارتباط. يمكنك اختيار تعطيل بعض أنواع ملفات تعريف الارتباط أدناه."
                                        : "When you visit our store, we may store or retrieve information on your browser, mostly in the form of cookies. You can manage your preferences below for different categories."}
                                </p>

                                {/* 1. Necessary */}
                                <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200/70">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-slate-900">
                                                {isAr ? "ملفات تعريف الارتباط الضرورية" : "Strictly Necessary Cookies"}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                                                {isAr ? "نشط دائماً" : "Always Active"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {isAr
                                                ? "هذه الملفات ضرورية لتمكين وظائف المتجر الأساسية مثل سلة التسوق وتسجيل الدخول والدفع الآمن."
                                                : "These cookies are required for fundamental store operations like cart storage, session checkout, and security."}
                                        </p>
                                    </div>
                                    <div className="pt-1">
                                        <div className="w-10 h-6 bg-slate-300 rounded-full flex items-center px-1 cursor-not-allowed">
                                            <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Analytics */}
                                <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-white border border-slate-200">
                                    <div>
                                        <span className="font-bold text-sm text-slate-900">
                                            {isAr ? "ملفات تعريف الارتباط التحليلية" : "Analytics & Performance"}
                                        </span>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {isAr
                                                ? "تساعدنا على فهم كيفية تفاعل الزوار مع المتجر لنتمكن من تحسين الأداء وتجربة التسوق."
                                                : "Allows us to count visits and traffic sources so we can measure and improve store performance."}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                                        className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${preferences.analytics ? "bg-[#c91c1c]" : "bg-slate-200"}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${preferences.analytics ? (isAr ? "-translate-x-5" : "translate-x-5") : ""}`} />
                                    </button>
                                </div>

                                {/* 3. Marketing */}
                                <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-white border border-slate-200">
                                    <div>
                                        <span className="font-bold text-sm text-slate-900">
                                            {isAr ? "ملفات تعريف الارتباط التسويقية" : "Marketing & Personalization"}
                                        </span>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {isAr
                                                ? "تستخدم لتقديم عروض ترويجية ومنتجات مخصصة تناسب اهتماماتك عبر الإنترنت."
                                                : "Used to present relevant promotional offers and tailored product recommendations."}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                                        className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${preferences.marketing ? "bg-[#c91c1c]" : "bg-slate-200"}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${preferences.marketing ? (isAr ? "-translate-x-5" : "translate-x-5") : ""}`} />
                                    </button>
                                </div>

                                {/* 4. Functional */}
                                <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-white border border-slate-200">
                                    <div>
                                        <span className="font-bold text-sm text-slate-900">
                                            {isAr ? "ملفات تعريف الارتباط الوظيفية" : "Functional Cookies"}
                                        </span>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {isAr
                                                ? "تمكن الموقع من توفير وظائف وميزات مخصصة إضافية مثل تفضيلات العملة واللغة."
                                                : "Enables enhanced functionality and personalization like saved language or currency preferences."}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPreferences(prev => ({ ...prev, functional: !prev.functional }))}
                                        className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${preferences.functional ? "bg-[#c91c1c]" : "bg-slate-200"}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${preferences.functional ? (isAr ? "-translate-x-5" : "translate-x-5") : ""}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                                <button
                                    onClick={handleDeclineAll}
                                    className="text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
                                >
                                    {isAr ? "رفض الكل" : "Reject All"}
                                </button>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleSavePreferences}
                                        className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs md:text-sm rounded-md transition-colors"
                                    >
                                        {isAr ? "حفظ التفضيلات" : "Save Preferences"}
                                    </button>
                                    <button
                                        onClick={handleAcceptAll}
                                        className="px-5 py-2 bg-[#c91c1c] text-white hover:bg-[#a51616] font-semibold text-xs md:text-sm rounded-md transition-colors"
                                    >
                                        {isAr ? "قبول الكل" : "Accept All"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
