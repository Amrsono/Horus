"use client";

import Link from "next/link";
import { Twitter, Instagram, Mail, Phone, MapPin, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
    const { locale } = useLanguage();
    const isAr = locale === "ar";

    return (
        <footer className="border-t border-slate-200 bg-white text-slate-600 text-sm" dir={isAr ? "rtl" : "ltr"}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand & About */}
                    <div className="md:col-span-1 space-y-4">
                        <Link href="/" className="inline-block">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                                    <img src="/clouds-logo.jpg" alt="Clouds" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-2xl font-black text-slate-900 tracking-tight">
                                    CLOUD<span className="text-[#c91c1c]">S</span>
                                </span>
                            </div>
                        </Link>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            {isAr
                                ? "متجر كلودز هو وجهتك الموثوقة لأفضل أجهزة الفيب والسوائل المستوردة والمحلية الأصلية في مصر."
                                : "Your premier certified destination for genuine vape devices, e-liquids, pods, and accessories in Egypt."}
                        </p>
                        <div className="flex gap-2.5 pt-1">
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#c91c1c] hover:text-white transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#c91c1c] hover:text-white transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="mailto:support@clouds.com" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#c91c1c] hover:text-white transition-colors">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">
                            {isAr ? "روابط سريعة" : "Quick Links"}
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium">
                            <li><Link href="/" className="hover:text-[#c91c1c] transition-colors">{isAr ? "الرئيسية" : "Home"}</Link></li>
                            <li><Link href="/shop" className="hover:text-[#c91c1c] transition-colors">{isAr ? "المتجر" : "Shop All"}</Link></li>
                            <li><Link href="/#sale" className="hover:text-[#c91c1c] transition-colors">{isAr ? "عروض التخفيضات" : "Sale Offers"}</Link></li>
                            <li><Link href="/track" className="hover:text-[#c91c1c] transition-colors font-bold text-slate-900 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[#c91c1c]" />{isAr ? "تتبع طلبك" : "Track Your Order"}</Link></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">
                            {isAr ? "خدمة العملاء" : "Customer Care"}
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium">
                            <li><Link href="/track" className="hover:text-[#c91c1c] transition-colors">{isAr ? "تتبع الشحنة" : "Shipping & Tracking"}</Link></li>
                            <li><Link href="/privacy" className="hover:text-[#c91c1c] transition-colors">{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</Link></li>
                            <li><Link href="/terms" className="hover:text-[#c91c1c] transition-colors">{isAr ? "الشروط والأحكام" : "Terms of Service"}</Link></li>
                            <li><Link href="/contact" className="hover:text-[#c91c1c] transition-colors">{isAr ? "تواصل معنا" : "Contact Us"}</Link></li>
                        </ul>
                    </div>

                    {/* Trust & Safe Payment */}
                    <div>
                        <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4">
                            {isAr ? "طرق الدفع والتوصيل" : "Payment & Delivery"}
                        </h4>
                        <p className="text-xs text-slate-500 mb-3">
                            {isAr
                                ? "دفع عند الاستلام، بطاقات بنكية، ومحافظ إلكترونية مع توصيل سريع خلال 48 ساعة."
                                : "Cash on Delivery, Credit Cards, and fast courier dispatch nationwide."}
                        </p>
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase text-slate-600">
                            <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200">COD</span>
                            <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200">Visa / MC</span>
                            <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200">Apple Pay</span>
                            <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200">Instapay</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <p>© {new Date().getFullYear()} CLOUDS Store. All rights reserved.</p>
                    <p className="text-[11px]">Strictly 21+ only. Vaping products contain nicotine which is an addictive chemical.</p>
                </div>
            </div>
        </footer>
    );
}
