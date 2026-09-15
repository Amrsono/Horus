"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/contexts/SiteContentContext";

export default function ContactPage() {
    const { locale } = useLanguage();
    const isAr = locale === "ar";
    const { content } = useSiteContent();
    const contact = content.contact;

    const title = isAr ? contact.title_ar : contact.title_en;
    const subtitle = isAr ? contact.subtitle_ar : contact.subtitle_en;
    const address = isAr ? contact.address_ar : contact.address_en;
    const workingHours = isAr ? contact.working_hours_ar : contact.working_hours_en;

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        // Also open WhatsApp if user wants to chat right away
        setTimeout(() => {
            const cleanPhone = contact.whatsapp.replace(/[^0-9]/g, "");
            const text = encodeURIComponent(
                `Hello CLOUDS Support,\nName: ${formData.name}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\nMessage: ${formData.message}`
            );
            window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
        }, 800);
    };

    const cleanWaNumber = contact.whatsapp.replace(/[^0-9]/g, "");

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans" dir={isAr ? "rtl" : "ltr"}>
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
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
                    className="text-center max-w-2xl mx-auto mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary-accent)]/15 border border-[var(--primary-accent)]/30 text-[var(--primary-accent)] text-xs font-bold uppercase tracking-wider mb-4">
                        <MessageSquare className="w-4 h-4" />
                        <span>{isAr ? "خدمة العملاء على مدار الساعة" : "Customer Support & Inquiries"}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text-main)] mb-4">
                        {title}
                    </h1>

                    <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
                        {subtitle}
                    </p>
                </motion.div>

                {/* Main Grid: Contact Cards & Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Direct Action Cards */}
                    <div className="space-y-4">
                        {/* WhatsApp Card */}
                        <div className="glass p-6 rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--primary-accent)]/40 transition-all flex flex-col justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-[var(--text-main)] mb-1">
                                        {isAr ? "دردشة واتساب الفورية" : "Live WhatsApp Support"}
                                    </h3>
                                    <p className="text-xs text-[var(--text-muted)] mb-3">
                                        {isAr ? "رد سريع خلال دقائق لأي استفسار" : "Instant answers for orders & advice"}
                                    </p>
                                    <a
                                        href={`https://wa.me/${cleanWaNumber}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{contact.whatsapp}</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Phone & Email Card */}
                        <div className="glass p-6 rounded-2xl border border-[var(--border-subtle)] space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--surface-subtle)] text-[var(--primary-accent)] flex items-center justify-center shrink-0 border border-[var(--border-subtle)]">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[11px] text-[var(--text-muted)] block font-medium">
                                        {isAr ? "الهاتف المباشر" : "Direct Phone"}
                                    </span>
                                    <a href={`tel:${contact.phone}`} className="font-bold text-sm text-[var(--text-main)] hover:text-[var(--primary-accent)] transition-colors">
                                        {contact.phone}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-3 border-t border-[var(--border-subtle)]">
                                <div className="w-10 h-10 rounded-xl bg-[var(--surface-subtle)] text-[var(--primary-accent)] flex items-center justify-center shrink-0 border border-[var(--border-subtle)]">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[11px] text-[var(--text-muted)] block font-medium">
                                        {isAr ? "البريد الإلكتروني" : "Support Email"}
                                    </span>
                                    <a href={`mailto:${contact.email}`} className="font-bold text-sm text-[var(--text-main)] hover:text-[var(--primary-accent)] transition-colors">
                                        {contact.email}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Location & Hours Card */}
                        <div className="glass p-6 rounded-2xl border border-[var(--border-subtle)] space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--surface-subtle)] text-[var(--primary-accent)] flex items-center justify-center shrink-0 border border-[var(--border-subtle)]">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[11px] text-[var(--text-muted)] block font-medium">
                                        {isAr ? "مقر المتجر والتوزيع" : "Store Location"}
                                    </span>
                                    <span className="font-semibold text-sm text-[var(--text-main)]">
                                        {address}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 pt-3 border-t border-[var(--border-subtle)]">
                                <div className="w-10 h-10 rounded-xl bg-[var(--surface-subtle)] text-[var(--primary-accent)] flex items-center justify-center shrink-0 border border-[var(--border-subtle)]">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[11px] text-[var(--text-muted)] block font-medium">
                                        {isAr ? "أوقات العمل والتوصيل" : "Operating Hours"}
                                    </span>
                                    <span className="font-semibold text-sm text-[var(--text-main)]">
                                        {workingHours}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Message Form */}
                    <div className="lg:col-span-2">
                        <div className="glass rounded-2xl p-6 md:p-10 border border-[var(--border-subtle)] shadow-xl">
                            <h2 className="text-xl md:text-2xl font-bold text-[var(--text-main)] mb-2">
                                {isAr ? "أرسل لنا رسالة مباشرة" : "Send Us a Message"}
                            </h2>
                            <p className="text-xs md:text-sm text-[var(--text-muted)] mb-8">
                                {isAr
                                    ? "املأ النموذج وسيقوم فريق الدعم بالتواصل معك فوراً عبر الواتساب أو الهاتف."
                                    : "Fill out the form below and our customer care team will respond promptly."}
                            </p>

                            {formSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                                    <h3 className="text-lg font-bold text-[var(--text-main)]">
                                        {isAr ? "تم إرسال رسالتك بنجاح!" : "Message Sent Successfully!"}
                                    </h3>
                                    <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                                        {isAr
                                            ? "شكراً لتواصلك معنا. جاري تحويلك لدردشة الواتساب المباشرة للمتابعة الفورية."
                                            : "Thank you for reaching out. You are being redirected to live WhatsApp support."}
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5">
                                                {isAr ? "الاسم الكريم *" : "Your Name *"}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder={isAr ? "أحمد محمد" : "John Doe"}
                                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5">
                                                {isAr ? "رقم الهاتف / واتساب *" : "Phone / WhatsApp *"}
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="010XXXXXXXX"
                                                className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5">
                                            {isAr ? "موضوع الاستفسار" : "Subject"}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder={isAr ? "استفسار عن جهاز / نكهة / حالة طلب" : "Question about device, juice, or order"}
                                            className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5">
                                            {isAr ? "تفاصيل الرسالة *" : "Your Message *"}
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder={isAr ? "اكتب استفسارك هنا بكل تفصيل..." : "Write your message or inquiry here..."}
                                            className="w-full bg-[var(--surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3.5 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Send className="w-4 h-4 rtl:rotate-180" />
                                        <span>{isAr ? "إرسال الرسالة وبدء المحادثة" : "Send Message & Start Chat"}</span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
