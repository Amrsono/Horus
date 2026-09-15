"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    MessageSquare,
    Truck,
    Mail,
    ArrowRight,
    MapPin,
    Calendar,
    ShoppingBag,
    Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { generateWhatsAppOrderUrl } from "@/lib/whatsapp";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function OrderConfirmedPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const orderId = resolvedParams.id;
    const searchParams = useSearchParams();
    const queryOrderNumber = searchParams.get("num");

    const { locale, formatCurrency } = useLanguage();
    const isAr = locale === "ar";

    const [order, setOrder] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            setIsLoading(true);
            try {
                const { data: orderData, error: orderErr } = await supabase
                    .from("orders")
                    .select("*")
                    .eq("id", orderId)
                    .single();

                if (!orderErr && orderData) {
                    setOrder(orderData);

                    const { data: itemsData } = await supabase
                        .from("order_items")
                        .select("*")
                        .eq("order_id", orderId);

                    setOrderItems(itemsData || []);
                } else {
                    // Check local storage fallback
                    const localOrders = JSON.parse(localStorage.getItem("clouds_local_orders") || "[]");
                    const found = localOrders.find((o: any) => o.id === orderId || o.order_number === queryOrderNumber);
                    if (found) {
                        setOrder(found);
                        setOrderItems(found.items || []);
                    }
                }
            } catch (err) {
                console.error("Error fetching order:", err);
                const localOrders = JSON.parse(localStorage.getItem("clouds_local_orders") || "[]");
                const found = localOrders.find((o: any) => o.id === orderId || o.order_number === queryOrderNumber);
                if (found) {
                    setOrder(found);
                    setOrderItems(found.items || []);
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const orderNumber =
        order?.shipping_address?.order_number || queryOrderNumber || `CV-${orderId?.slice(0, 6).toUpperCase()}`;

    const customerName = order?.shipping_address?.name || "Valued Customer";
    const customerPhone = order?.shipping_address?.phone || "";
    const customerCity = order?.shipping_address?.city || "Cairo";
    const customerAddress = order?.shipping_address?.address || "";
    const totalAmount = order?.total_amount || 0;

    const trackingUrl = typeof window !== "undefined" ? `${window.location.origin}/track?order=${orderId}` : "";

    const whatsAppUrl = generateWhatsAppOrderUrl({
        orderNumber,
        customerName,
        customerPhone,
        city: customerCity,
        address: customerAddress,
        paymentMethod: order?.shipping_address?.payment_method || "Cash on Delivery",
        totalAmount,
        trackingUrl,
        items: orderItems.map((i) => ({
            name: i.product_name,
            quantity: i.quantity,
            price: Number(i.price_at_purchase),
        })),
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#c91c1c]" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans" dir={isAr ? "rtl" : "ltr"}>
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
                {/* Celebration Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 text-center mb-8"
                >
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                        <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full inline-block mb-3">
                        {isAr ? "تم تأكيد طلبك بنجاح" : "Order Placed Successfully"}
                    </span>

                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                        {isAr ? `شكراً لك، ${customerName}!` : `Thank you, ${customerName}!`}
                    </h1>

                    <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                        {isAr
                            ? "تم استلام طلبك وجاري تحضيره الآن للشحن السريع. تم إرسال فاتورة وتفاصيل الطلب إلى بريدك الإلكتروني."
                            : "Your order has been received and is being prepared for fast delivery. A confirmation invoice has been sent to your email."}
                    </p>

                    <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg text-sm text-slate-700 font-mono font-bold border border-slate-200 mb-8">
                        <span>{isAr ? "رقم الطلب:" : "Order Number:"}</span>
                        <span className="text-[#c91c1c] text-base">#{orderNumber}</span>
                    </div>

                    {/* Action Buttons: WhatsApp and Live Tracker */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                        <a
                            href={whatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2.5 py-3.5 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm rounded-lg transition-all shadow-sm"
                        >
                            <MessageSquare className="w-5 h-5 fill-current" />
                            <span>{isAr ? "تأكيد عبر واتساب" : "Confirm on WhatsApp"}</span>
                        </a>

                        <Link
                            href={`/track?order=${orderId}`}
                            className="flex items-center justify-center gap-2.5 py-3.5 px-6 bg-slate-900 hover:bg-[#c91c1c] text-white font-bold text-sm rounded-lg transition-all shadow-sm"
                        >
                            <Truck className="w-5 h-5" />
                            <span>{isAr ? "تتبع الشحنة لايف" : "Track Order Live"}</span>
                        </Link>
                    </div>
                </motion.div>

                {/* Order Summary & Delivery Details */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                        <ShoppingBag className="w-5 h-5 text-[#c91c1c]" />
                        <span>{isAr ? "تفاصيل الطلب والعنوان" : "Order Summary & Destination"}</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                        <div className="space-y-2">
                            <span className="font-bold text-slate-400 uppercase tracking-wider block">
                                {isAr ? "عنوان التوصيل" : "Delivery Address"}
                            </span>
                            <div className="text-slate-800 text-sm font-medium">
                                <p className="font-bold">{customerName}</p>
                                <p className="text-slate-600">{customerAddress}</p>
                                <p className="text-slate-600">{customerCity}</p>
                                <p className="font-mono text-slate-700 mt-1">{customerPhone}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="font-bold text-slate-400 uppercase tracking-wider block">
                                {isAr ? "طريقة الدفع والتوصيل" : "Payment & Delivery"}
                            </span>
                            <div className="text-slate-800 text-sm font-medium">
                                <p className="font-bold">
                                    {order?.shipping_address?.payment_method || "Cash on Delivery (COD)"}
                                </p>
                                <p className="text-slate-600">
                                    {isAr ? "المدة المتوقعة: خلال 24 - 48 ساعة" : "Estimated ETA: Within 24 - 48 Hours"}
                                </p>
                                <p className="text-emerald-600 font-semibold mt-1">
                                    {isAr ? "شحن مجاني متوفر" : "Free Shipping Included"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    {orderItems.length > 0 && (
                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                {isAr ? "المنتجات المطلوبة" : "Ordered Items"}
                            </h3>
                            <div className="divide-y divide-slate-100">
                                {orderItems.map((item, idx) => (
                                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
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

                    {/* Total */}
                    <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between">
                        <span className="text-sm font-bold text-slate-700">
                            {isAr ? "المبلغ الإجمالي:" : "Total Paid:"}
                        </span>
                        <span className="text-2xl font-black text-[#c91c1c] font-mono">
                            {formatCurrency(totalAmount)}
                        </span>
                    </div>

                    <div className="pt-4 text-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#c91c1c] transition-colors"
                        >
                            <span>{isAr ? "متابعة التسوق" : "Continue Shopping"}</span>
                            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
