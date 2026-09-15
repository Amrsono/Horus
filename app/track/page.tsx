"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Search,
    Truck,
    Package,
    CheckCircle2,
    Clock,
    MapPin,
    Calendar,
    MessageSquare,
    ArrowRight,
    Loader2,
    AlertCircle,
    Home,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateWhatsAppOrderUrl } from "@/lib/whatsapp";

function TrackContent() {
    const searchParams = useSearchParams();
    const queryOrder = searchParams.get("order") || "";

    const { locale, formatCurrency } = useLanguage();
    const isAr = locale === "ar";

    const [searchCode, setSearchCode] = useState(queryOrder);
    const [order, setOrder] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (queryOrder) {
            handleLookup(queryOrder);
        }
    }, [queryOrder]);

    const handleLookup = async (lookupTerm: string) => {
        const term = lookupTerm.trim();
        if (!term) return;

        setIsSearching(true);
        setNotFound(false);
        setHasSearched(true);

        try {
            // Check by ID (UUID) or search in shipping_address->>order_number or guest_email or phone
            let query = supabase.from("orders").select("*");

            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(term);

            if (isUuid) {
                query = query.eq("id", term);
            } else {
                // Search by order_number in shipping_address JSON or phone
                query = query.or(`shipping_address->>order_number.ilike.%${term}%,shipping_address->>phone.ilike.%${term}%,guest_email.ilike.%${term}%`);
            }

            const { data, error } = await query.limit(1);

            if (error || !data || data.length === 0) {
                // Check local storage fallback
                const localOrders = JSON.parse(localStorage.getItem("clouds_local_orders") || "[]");
                const found = localOrders.find(
                    (o: any) =>
                        o.id === term ||
                        o.order_number?.toLowerCase() === term.toLowerCase() ||
                        o.shipping_address?.order_number?.toLowerCase() === term.toLowerCase() ||
                        o.shipping_address?.phone?.includes(term) ||
                        o.guest_email?.toLowerCase() === term.toLowerCase()
                );

                if (found) {
                    setOrder(found);
                    setOrderItems(found.items || []);
                    setNotFound(false);
                } else {
                    setNotFound(true);
                    setOrder(null);
                    setOrderItems([]);
                }
            } else {
                const foundOrder = data[0];
                setOrder(foundOrder);
                setNotFound(false);

                // Fetch items
                const { data: items } = await supabase
                    .from("order_items")
                    .select("*")
                    .eq("order_id", foundOrder.id);
                setOrderItems(items || []);
            }
        } catch (err) {
            console.error("Tracking lookup error:", err);
            const localOrders = JSON.parse(localStorage.getItem("clouds_local_orders") || "[]");
            const found = localOrders.find(
                (o: any) =>
                    o.id === term ||
                    o.order_number?.toLowerCase() === term.toLowerCase() ||
                    o.shipping_address?.order_number?.toLowerCase() === term.toLowerCase() ||
                    o.shipping_address?.phone?.includes(term) ||
                    o.guest_email?.toLowerCase() === term.toLowerCase()
            );

            if (found) {
                setOrder(found);
                setOrderItems(found.items || []);
                setNotFound(false);
            } else {
                setNotFound(true);
            }
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLookup(searchCode);
    };

    // Determine current progress step: 1 (Confirmed), 2 (Processing), 3 (Out for Delivery), 4 (Delivered)
    const getStatusStep = (status: string) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return 4;
            case "shipped":
            case "out_for_delivery":
                return 3;
            case "processing":
                return 2;
            case "pending":
            default:
                return 1;
        }
    };

    const currentStep = order ? getStatusStep(order.status) : 1;

    const steps = [
        {
            number: 1,
            title: isAr ? "تم تأكيد الطلب" : "Order Confirmed",
            desc: isAr ? "تم استلام الطلب وتأكيده بنجاح" : "Verified & accepted into system",
            icon: CheckCircle2,
        },
        {
            number: 2,
            title: isAr ? "تجهيز الشحنة" : "Processing & Packaging",
            desc: isAr ? "جاري التعبئة وفحص الجودة بالمستودع" : "Quality check in warehouse",
            icon: Package,
        },
        {
            number: 3,
            title: isAr ? "خرج للتوصيل" : "Out for Delivery",
            desc: isAr ? "الشحنة مع مندوب التوصيل في طريقها إليك" : "Handed over to courier driver",
            icon: Truck,
        },
        {
            number: 4,
            title: isAr ? "تم الاستلام" : "Delivered",
            desc: isAr ? "تم تسليم الطلب للعميل بنجاح" : "Successfully handed to customer",
            icon: Home,
        },
    ];

    const orderNumber =
        order?.shipping_address?.order_number || (order?.id ? `CV-${order.id.slice(0, 6).toUpperCase()}` : "");

    const whatsAppHelpUrl = order
        ? generateWhatsAppOrderUrl({
              orderNumber,
              customerName: order.shipping_address?.name || "Customer",
              customerPhone: order.shipping_address?.phone || "",
              city: order.shipping_address?.city || "",
              address: order.shipping_address?.address || "",
              paymentMethod: order.shipping_address?.payment_method || "COD",
              totalAmount: order.total_amount,
              items: orderItems.map((i) => ({
                  name: i.product_name,
                  quantity: i.quantity,
                  price: Number(i.price_at_purchase),
              })),
          })
        : "https://wa.me/201090000000";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir={isAr ? "rtl" : "ltr"}>
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#c91c1c] block mb-2">
                        {isAr ? "تتبع مباشر لشحنتك" : "Real-time Order Tracker"}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        {isAr ? "أين وصل طلبي؟" : "Track Your Order Live"}
                    </h1>
                    <p className="text-slate-500 text-sm mt-2">
                        {isAr
                            ? "أدخل رقم الطلب أو رقم هاتفك لمعرفة حالة الشحنة وموعد وصولها المتوقع"
                            : "Enter your Order Number or phone to see live courier location and status"}
                    </p>

                    {/* Lookup Search Input */}
                    <form onSubmit={handleSubmit} className="mt-8 flex gap-2 max-w-lg mx-auto">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                placeholder={isAr ? "مثال: CV-123456 أو رقم الموبايل..." : "e.g. CV-849201 or 010XXXXXXXX..."}
                                className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-slate-800 shadow-xs font-mono"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        </div>
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="px-6 py-3 bg-[#c91c1c] hover:bg-[#a51616] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : isAr ? "تتبع" : "Track"}
                        </button>
                    </form>
                </div>

                {/* Not Found state */}
                {notFound && hasSearched && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-lg mx-auto shadow-xs"
                    >
                        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-900 mb-1">
                            {isAr ? "لم نتمكن من العثور على هذا الطلب" : "Order Not Found"}
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">
                            {isAr
                                ? "تأكد من كتابة رقم الطلب بصورة صحيحة (مثال: CV-849201) أو ابحث برقم الهاتف المستخدم في الطلب."
                                : "Please double-check your order number or phone number and try again."}
                        </p>
                    </motion.div>
                )}

                {/* Tracking Progress Section */}
                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 space-y-8"
                    >
                        {/* Order Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                            <div>
                                <span className="text-xs text-slate-400 uppercase font-semibold block">
                                    {isAr ? "رقم الشحنة" : "Tracking Order"}
                                </span>
                                <h2 className="text-xl md:text-2xl font-black text-slate-900 font-mono">
                                    #{orderNumber}
                                </h2>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-red-50 text-[#c91c1c] border border-red-200 rounded-full">
                                    {order.status}
                                </span>
                                <a
                                    href={whatsAppHelpUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-md shadow-xs transition-colors"
                                >
                                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                                    <span>{isAr ? "تواصل واتساب" : "WhatsApp"}</span>
                                </a>
                            </div>
                        </div>

                        {/* 4-Step Visual Timeline */}
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                                {steps.map((step) => {
                                    const isComplete = currentStep >= step.number;
                                    const isCurrent = currentStep === step.number;
                                    const Icon = step.icon;

                                    return (
                                        <div
                                            key={step.number}
                                            className={`p-4 rounded-xl border transition-all ${
                                                isCurrent
                                                    ? "bg-red-50/50 border-[#c91c1c] shadow-xs"
                                                    : isComplete
                                                    ? "bg-slate-50 border-slate-200"
                                                    : "bg-white border-slate-200/60 opacity-60"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 mb-2">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                                        isComplete
                                                            ? "bg-[#c91c1c] text-white"
                                                            : "bg-slate-200 text-slate-600"
                                                    }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <span
                                                    className={`text-xs font-bold ${
                                                        isCurrent ? "text-[#c91c1c]" : "text-slate-900"
                                                    }`}
                                                >
                                                    {step.title}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 leading-snug">
                                                {step.desc}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Shipping & Delivery ETA Box */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs">
                            <div className="space-y-1.5">
                                <span className="font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#c91c1c]" />
                                    {isAr ? "وجهة التسليم" : "Delivery Destination"}
                                </span>
                                <p className="text-sm font-bold text-slate-900">
                                    {order.shipping_address?.name}
                                </p>
                                <p className="text-slate-600">{order.shipping_address?.address}</p>
                                <p className="text-slate-600">{order.shipping_address?.city}</p>
                            </div>

                            <div className="space-y-1.5">
                                <span className="font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#c91c1c]" />
                                    {isAr ? "الموعد المتوقع للتسليم" : "Estimated Courier Delivery"}
                                </span>
                                <p className="text-sm font-bold text-emerald-700">
                                    {isAr ? "خلال 24 - 48 ساعة" : "Within 24 - 48 Hours"}
                                </p>
                                <p className="text-slate-500">
                                    {isAr
                                        ? "مندوب الشحن سيتواصل معك هاتفياً قبل الوصول."
                                        : "Courier driver will call your phone prior to arrival."}
                                </p>
                            </div>
                        </div>

                        {/* Items in this order */}
                        {orderItems.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {isAr ? "محتويات الشحنة" : "Package Contents"}
                                </h3>
                                <div className="divide-y divide-slate-100 border-t border-slate-100">
                                    {orderItems.map((item, idx) => (
                                        <div key={idx} className="py-3 flex items-center justify-between text-xs">
                                            <div className="font-bold text-slate-900">
                                                {item.product_name}{" "}
                                                <span className="text-slate-400 font-normal">× {item.quantity}</span>
                                            </div>
                                            <div className="font-mono font-bold text-slate-900">
                                                {formatCurrency(Number(item.price_at_purchase) * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#c91c1c]" /></div>}>
            <TrackContent />
        </Suspense>
    );
}
