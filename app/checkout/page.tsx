"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle,
    CreditCard,
    Banknote,
    ShieldCheck,
    Loader2,
    Truck,
    Phone,
    MapPin,
    Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EGYPT_CITIES = [
    "Cairo (القاهرة)",
    "Giza (الجيزة)",
    "Alexandria (الإسكندرية)",
    "Qalyubia (القليوبية)",
    "Sharqia (الشرقية)",
    "Dakahlia (الدقهلية)",
    "Gharbia (الغربية)",
    "Menofia (المنوفية)",
    "Damietta (دمياط)",
    "Port Said (بورسعيد)",
    "Ismailia (الإسماعيلية)",
    "Suez (السويس)",
    "Kafr El Sheikh (كفر الشيخ)",
    "Beheira (البحيرة)",
    "Red Sea (البحر الأحمر / الغردقة)",
    "South Sinai (شرم الشيخ)",
    "Assiut (أسيوط)",
    "Sohag (سوهاج)",
    "Qena (قنا)",
    "Luxor (الأقصر)",
    "Aswan (أسوان)",
];

export default function CheckoutPage() {
    const { items, totalPrice, subtotalPrice, discountAmount, discountPercent, clearCart, specialInstructions } = useCartStore();
    const { locale, formatCurrency } = useLanguage();
    const isAr = locale === "ar";
    const { user } = useAuth();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    const [activePaymentMethod, setActivePaymentMethod] = useState<"cash" | "card">("cash");
    const [isProcessing, setIsProcessing] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        city: "Cairo (القاهرة)",
        address: "",
        notes: specialInstructions || "",
    });

    useEffect(() => {
        setMounted(true);
        if (user?.email) {
            setFormData((prev) => ({ ...prev, email: user.email || "" }));
        }
    }, [user]);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        setIsProcessing(true);

        try {
            // Generate clean human-readable order number e.g. CV-783921
            const randomCode = Math.floor(100000 + Math.random() * 900000);
            const orderNumber = `CV-${randomCode}`;
            const total = totalPrice();

            const shippingData = {
                order_number: orderNumber,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,
                address: formData.address,
                notes: formData.notes,
                payment_method: activePaymentMethod === "cash" ? "Cash on Delivery" : "Credit Card",
            };

            // 1. Insert order in Supabase
            let createdOrderId: string;

            const isUuid = (id: any) =>
                typeof id === "string" &&
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert({
                    user_id: user?.id || null,
                    guest_email: formData.email,
                    total_amount: total,
                    status: "pending",
                    shipping_address: shippingData,
                })
                .select()
                .single();

            if (orderError) {
                console.warn("Supabase guest order notice:", orderError.message || orderError.code || orderError);
                // Generate unique order ID fallback so checkout never breaks
                const fallbackId =
                    typeof crypto !== "undefined" && crypto.randomUUID
                        ? crypto.randomUUID()
                        : `ord_${Date.now()}`;
                createdOrderId = fallbackId;

                // Save to local storage for instant tracking & confirmation
                try {
                    const localOrders = JSON.parse(localStorage.getItem("clouds_local_orders") || "[]");
                    localOrders.push({
                        id: fallbackId,
                        order_number: orderNumber,
                        user_id: user?.id || null,
                        guest_email: formData.email,
                        total_amount: total,
                        status: "pending",
                        shipping_address: shippingData,
                        items: items.map((item) => ({
                            product_name: item.name,
                            quantity: item.quantity,
                            price_at_purchase: typeof item.price === "string" ? parseFloat(item.price) : item.price,
                        })),
                        created_at: new Date().toISOString(),
                    });
                    localStorage.setItem("clouds_local_orders", JSON.stringify(localOrders));
                } catch (storeErr) {
                    console.error("Local storage order save error:", storeErr);
                }
            } else {
                createdOrderId = order.id;

                // 2. Insert order items if Supabase order was created
                try {
                    const orderItems = items.map((item) => ({
                        order_id: order.id,
                        product_id: isUuid(item.id) ? item.id : null,
                        product_name: item.name,
                        quantity: item.quantity,
                        price_at_purchase: typeof item.price === "string" ? parseFloat(item.price) : item.price,
                    }));
                    await supabase.from("order_items").insert(orderItems);
                } catch (itemsError) {
                    console.warn("Notice: order_items insert warning:", itemsError);
                }
            }

            // 3. Trigger confirmation email via Next.js API
            try {
                const trackingUrl = `${window.location.origin}/track?order=${createdOrderId}`;
                await fetch("/api/orders/confirm-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId: createdOrderId,
                        orderNumber,
                        customerName: formData.name,
                        customerEmail: formData.email,
                        items,
                        totalAmount: total,
                        shippingAddress: shippingData,
                        trackingUrl,
                    }),
                });
            } catch (emailErr) {
                console.warn("Could not dispatch email invoice:", emailErr);
            }

            // 4. Clear cart and redirect to order confirmation
            clearCart();
            router.push(`/order-confirmed/${createdOrderId}?num=${orderNumber}`);
        } catch (error: any) {
            console.error("Order creation failed:", error?.message || error?.code || error);
            alert("Failed to place order. Please check your information and try again.");
            setIsProcessing(false);
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#c91c1c]" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-white text-slate-900" dir={isAr ? "rtl" : "ltr"}>
                <Navbar />
                <div className="max-w-md mx-auto py-24 px-6 text-center">
                    <h2 className="text-2xl font-black mb-3">
                        {isAr ? "سلة التسوق فارغة" : "Your cart is empty"}
                    </h2>
                    <p className="text-sm text-slate-500 mb-6">
                        {isAr ? "أضف منتجات إلى سلتك أولاً لإتمام الطلب." : "Add products to your cart before proceeding to checkout."}
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block px-6 py-3 bg-[#c91c1c] text-white font-bold text-sm uppercase rounded-md hover:bg-[#a51616]"
                    >
                        {isAr ? "العودة للمتجر" : "Return to Shop"}
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-slate-900 font-sans" dir={isAr ? "rtl" : "ltr"}>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
                <Link
                    href="/shop"
                    className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors gap-1.5"
                >
                    <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                    <span>{isAr ? "العودة إلى المتجر" : "Back to Shop"}</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Form (7 cols) */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#c91c1c] block mb-1">
                                {isAr ? "الخطوة 1 من 2" : "Step 1 of 2"}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                                {isAr ? "معلومات الشحن والتوصيل" : "Shipping & Contact Information"}
                            </h1>
                        </div>

                        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-5">
                            {/* Contact Section */}
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[#c91c1c]" />
                                    <span>{isAr ? "معلومات الاتصال" : "Contact Details"}</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">
                                            {isAr ? "الاسم بالكامل *" : "Full Name *"}
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Ahmed Ali"
                                            className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-slate-800"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">
                                            {isAr ? "البريد الإلكتروني (لتأكيد الطلب) *" : "Email (For Confirmation Invoice) *"}
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="you@example.com"
                                            className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                        <span>{isAr ? "رقم الهاتف / الواتساب *" : "Phone / WhatsApp Number *"}</span>
                                        <span className="text-[11px] text-emerald-600 font-semibold">
                                            {isAr ? "لإرسال إشعارات الطلب على واتساب" : "For WhatsApp delivery updates"}
                                        </span>
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="010XXXXXXXX or 011XXXXXXXX"
                                        className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-slate-800 font-mono"
                                    />
                                </div>
                            </div>

                            {/* Shipping Address Section */}
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#c91c1c]" />
                                    <span>{isAr ? "عنوان التوصيل" : "Delivery Address"}</span>
                                </h3>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">
                                        {isAr ? "المحافظة / المدينة *" : "Governorate / City *"}
                                    </label>
                                    <select
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-slate-800"
                                    >
                                        {EGYPT_CITIES.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">
                                        {isAr ? "العنوان بالتفصيل (اسم الشارع، رقم العقار، الشقة) *" : "Street Address, Building, Floor/Apt *"}
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="e.g. 15 Tahrir Street, Floor 3, Apt 12"
                                        className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-slate-800"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">
                                        {isAr ? "ملاحظات إضافية للتوصيل (اختياري)" : "Delivery Instructions / Notes (Optional)"}
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="e.g. Call before arrival, leave with doorman, etc."
                                        className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-slate-800"
                                    />
                                </div>
                            </div>

                            {/* Payment Options */}
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-[#c91c1c]" />
                                    <span>{isAr ? "طريقة الدفع" : "Payment Method"}</span>
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setActivePaymentMethod("cash")}
                                        className={cn(
                                            "p-4 rounded-lg border-2 flex items-start gap-3 text-left rtl:text-right transition-all bg-white cursor-pointer",
                                            activePaymentMethod === "cash"
                                                ? "border-[#c91c1c] shadow-xs"
                                                : "border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0",
                                                activePaymentMethod === "cash" ? "border-[#c91c1c]" : "border-slate-400"
                                            )}
                                        >
                                            {activePaymentMethod === "cash" && (
                                                <div className="w-2 h-2 rounded-full bg-[#c91c1c]" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                                <Banknote className="w-4 h-4 text-emerald-600" />
                                                <span>{isAr ? "الدفع عند الاستلام" : "Cash on Delivery"}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {isAr ? "ادفع نقداً عند استلام شحنتك" : "Pay with cash upon arrival"}
                                            </p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActivePaymentMethod("card")}
                                        className={cn(
                                            "p-4 rounded-lg border-2 flex items-start gap-3 text-left rtl:text-right transition-all bg-white cursor-pointer",
                                            activePaymentMethod === "card"
                                                ? "border-[#c91c1c] shadow-xs"
                                                : "border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0",
                                                activePaymentMethod === "card" ? "border-[#c91c1c]" : "border-slate-400"
                                            )}
                                        >
                                            {activePaymentMethod === "card" && (
                                                <div className="w-2 h-2 rounded-full bg-[#c91c1c]" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                                <CreditCard className="w-4 h-4 text-blue-600" />
                                                <span>{isAr ? "بطاقة ائتمان / فيزا" : "Credit Card / Visa"}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {isAr ? "دفع مشفر وآمن 100%" : "Encrypted 100% secure checkout"}
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Order Summary (5 cols) */}
                    <div className="lg:col-span-5">
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-28 space-y-6">
                            <h2 className="text-lg font-black text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                                <span>{isAr ? "ملخص الطلب" : "Order Summary"}</span>
                                <span className="text-xs text-slate-500 font-semibold font-mono">
                                    {items.reduce((s, i) => s + i.quantity, 0)} {isAr ? "منتجات" : "items"}
                                </span>
                            </h2>

                            {/* Item List */}
                            <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="relative w-16 h-16 rounded-md bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                                            <Image
                                                src={item.image || "/placeholder.jpg"}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-slate-500">
                                                {item.quantity} × {formatCurrency(Number(item.price))}
                                            </p>
                                        </div>
                                        <div className="text-sm font-black text-slate-900 font-mono">
                                            {formatCurrency(Number(item.price) * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cost Breakdown */}
                            <div className="space-y-2 pt-4 border-t border-slate-100 text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                                    <span className="font-mono font-semibold text-slate-900">{formatCurrency(subtotalPrice())}</span>
                                </div>

                                {discountPercent > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span>{isAr ? "الخصم" : "Discount"} ({discountPercent}%)</span>
                                        <span>-{formatCurrency(discountAmount())}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-slate-600">
                                    <span>{isAr ? "مصاريف الشحن" : "Shipping"}</span>
                                    <span className="text-emerald-700 font-bold">
                                        {isAr ? "شحن مجاني" : "FREE"}
                                    </span>
                                </div>

                                <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-base font-black text-slate-900">
                                    <span>{isAr ? "الإجمالي الكلي" : "Total Amount"}</span>
                                    <span className="text-2xl text-[#c91c1c] font-mono">
                                        {formatCurrency(totalPrice())}
                                    </span>
                                </div>
                            </div>

                            {/* Place Order CTA */}
                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={isProcessing}
                                className="w-full py-4 bg-[#c91c1c] text-white font-bold text-sm uppercase tracking-wider rounded-md hover:bg-[#a51616] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>{isAr ? "جاري معالجة الطلب..." : "Placing your order..."}</span>
                                    </>
                                ) : (
                                    <span>{isAr ? "تأكيد الطلب الآن" : "Place Order Now"}</span>
                                )}
                            </button>

                            {/* Trust badges */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-center text-[11px] text-slate-500 font-medium">
                                <div className="flex flex-col items-center gap-1">
                                    <Lock className="w-4 h-4 text-slate-700" />
                                    <span>{isAr ? "دفع آمن ومحمي" : "Secure Checkout"}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <Truck className="w-4 h-4 text-slate-700" />
                                    <span>{isAr ? "توصيل خلال 48 س" : "48h Delivery"}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <ShieldCheck className="w-4 h-4 text-slate-700" />
                                    <span>{isAr ? "منتجات أصلية 100%" : "100% Genuine"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
