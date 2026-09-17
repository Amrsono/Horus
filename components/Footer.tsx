"use client";

import Link from "next/link";
import { Twitter, Instagram, Mail, Phone, MapPin, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
    const { locale } = useLanguage();
    const isAr = locale === "ar";

    return (
        <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-muted)] text-sm transition-colors" dir={isAr ? "rtl" : "ltr"}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand & About */}
                    <div className="md:col-span-1 space-y-4">
                        <Link href="/" className="inline-block">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-[var(--surface-subtle)] flex items-center justify-center border border-[var(--border-subtle)] overflow-hidden">
                                    <img src="/clouds-logo.jpg" alt="Clouds" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-2xl font-black text-[var(--text-main)] tracking-tight">
                                    CLOUD<span className="text-[var(--primary-accent)]">S</span>
                                </span>
                            </div>
                        </Link>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                            {isAr
                                ? "متجر كلودز هو وجهتك الموثوقة لأفضل أجهزة الفيب والسوائل المستوردة والمحلية الأصلية في مصر."
                                : "Your premier certified destination for genuine vape devices, e-liquids, pods, and accessories in Egypt."}
                        </p>
                        <div className="flex gap-2.5 pt-1">
                            <a href="#" className="w-8 h-8 rounded-full bg-[var(--surface-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--primary-accent)] hover:text-white transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-[var(--surface-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--primary-accent)] hover:text-white transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="mailto:support@clouds.com" className="w-8 h-8 rounded-full bg-[var(--surface-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--primary-accent)] hover:text-white transition-colors">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[var(--text-main)] font-bold text-xs uppercase tracking-wider mb-4">
                            {isAr ? "روابط سريعة" : "Quick Links"}
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium">
                            <li><Link href="/" className="hover:text-[var(--primary-accent)] transition-colors">{isAr ? "الرئيسية" : "Home"}</Link></li>
                            <li><Link href="/shop" className="hover:text-[var(--primary-accent)] transition-colors">{isAr ? "المتجر" : "Shop All"}</Link></li>
                            <li><Link href="/about" className="hover:text-[var(--primary-accent)] transition-colors">{isAr ? "من نحن" : "About Us"}</Link></li>
                            <li><Link href="/#sale" className="hover:text-[var(--primary-accent)] transition-colors">{isAr ? "عروض التخفيضات" : "Sale Offers"}</Link></li>
                            <li><Link href="/track" className="hover:text-[var(--primary-accent)] transition-colors font-bold text-[var(--text-main)] flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[var(--primary-accent)]" />{isAr ? "تتبع طلبك" : "Track Your Order"}</Link></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className="text-[var(--text-main)] font-bold text-xs uppercase tracking-wider mb-4">
                            {isAr ? "خدمة العملاء" : "Customer Care"}
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium">
                            <li><Link href="/track" className="hover:text-[var(--primary-accent)] transition-colors">{isAr ? "تتبع الشحنة" : "Shipping & Tracking"}</Link></li>
                            <li><Link href="/privacy" className="hover:text-[var(--primary-accent)] transition-colors">{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</Link></li>
                            <li><Link href="/terms" className="hover:text-[var(--primary-accent)] transition-colors">{isAr ? "الشروط والأحكام" : "Terms of Service"}</Link></li>
                            <li><Link href="/contact" className="hover:text-[var(--primary-accent)] transition-colors">{isAr ? "تواصل معنا" : "Contact Us"}</Link></li>
                        </ul>
                    </div>

                    {/* Trust & Safe Payment */}
                    <div>
                        <h4 className="text-[var(--text-main)] font-bold text-xs uppercase tracking-wider mb-4">
                            {isAr ? "طرق الدفع والتوصيل" : "Payment & Delivery"}
                        </h4>
                        <p className="text-xs text-[var(--text-muted)] mb-3">
                            {isAr
                                ? "دفع عند الاستلام، بطاقات بنكية، ومحافظ إلكترونية مع توصيل سريع خلال 48 ساعة."
                                : "Cash on Delivery, Credit Cards, and fast courier dispatch nationwide."}
                        </p>
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase text-[var(--text-muted)]">
                            <span className="px-2 py-1 bg-[var(--surface-subtle)] rounded border border-[var(--border-subtle)]">COD</span>
                            <span className="px-2 py-1 bg-[var(--surface-subtle)] rounded border border-[var(--border-subtle)]">Visa / MC</span>
                            <span className="px-2 py-1 bg-[var(--surface-subtle)] rounded border border-[var(--border-subtle)]">Apple Pay</span>
                            <span className="px-2 py-1 bg-[var(--surface-subtle)] rounded border border-[var(--border-subtle)]">Instapay</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)] opacity-80">
                    <p>© {new Date().getFullYear()} CLOUDS Store. All rights reserved.</p>
                    <p className="text-[11px]">Strictly 21+ only. Vaping products contain nicotine which is an addictive chemical.</p>
                </div>
            </div>
        </footer>
    );
}
