"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ChevronDown, ChevronUp, Tag, Sparkles, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useEffect, useState, useId } from "react";

interface CartDrawerProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const FREE_SHIPPING_THRESHOLD = 2500;

export default function CartDrawer({ isOpen: externalIsOpen, onClose: externalOnClose }: CartDrawerProps) {
    const {
        items,
        isOpen: storeIsOpen,
        closeCart,
        removeItem,
        updateQuantity,
        totalPrice,
        subtotalPrice,
        discountAmount,
        discountPercent,
        discountCode,
        applyDiscount,
        removeDiscount,
        expiresAt,
        specialInstructions,
        setSpecialInstructions
    } = useCartStore();

    const { t, locale, formatCurrency } = useLanguage();
    const isAr = locale === "ar";
    const [mounted, setMounted] = useState(false);

    // Accordions
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [couponInput, setCouponInput] = useState("");
    const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

    // Live Countdown Timer (e.g. 14:38)
    const [timeLeftFormatted, setTimeLeftFormatted] = useState("14:59");

    const isOpen = externalIsOpen !== undefined ? externalIsOpen : storeIsOpen;
    const handleClose = externalOnClose || closeCart;

    useEffect(() => {
        setMounted(true);
    }, []);

    // Countdown effect
    useEffect(() => {
        if (!isOpen || items.length === 0 || !expiresAt) return;

        const updateTimer = () => {
            const diff = expiresAt - Date.now();
            if (diff <= 0) {
                setTimeLeftFormatted("00:00");
                return;
            }
            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
            setTimeLeftFormatted(formatted);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [isOpen, items.length, expiresAt]);

    if (!mounted) return null;

    const subtotal = subtotalPrice();
    const currentTotal = totalPrice();
    const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponInput.trim()) return;
        const result = applyDiscount(couponInput);
        setCouponFeedback(result);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: isAr ? "-100%" : "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: isAr ? "-100%" : "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 260 }}
                        className={cn(
                            "fixed top-0 bottom-0 z-[101] w-full max-w-md bg-white text-slate-900 shadow-2xl flex flex-col border-slate-200",
                            isAr ? "left-0 border-r" : "right-0 border-l"
                        )}
                        dir={isAr ? "rtl" : "ltr"}
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {isAr ? "سلة التسوق" : "Cart"}
                                </h2>
                                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                                </span>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                aria-label="Close cart"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Free Shipping Progress Bar */}
                        {items.length > 0 && (
                            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 text-xs text-slate-700">
                                <div className="flex items-center justify-between mb-1.5 font-medium">
                                    {freeShippingRemaining > 0 ? (
                                        <span>
                                            {isAr
                                                ? `أضف ${formatCurrency(freeShippingRemaining)} للحصول على شحن مجاني!`
                                                : `Add ${formatCurrency(freeShippingRemaining)} for Free Shipping!`}
                                        </span>
                                    ) : (
                                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            {isAr ? "مبروك! حصلت على شحن مجاني!" : "Congrats! You unlocked Free Shipping!"}
                                        </span>
                                    )}
                                    <span className="font-bold text-slate-900">{freeShippingProgress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#c91c1c] transition-all duration-300 rounded-full"
                                        style={{ width: `${freeShippingProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Items Container */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-400">
                                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                                        <ShoppingBag className="w-10 h-10" />
                                    </div>
                                    <p className="text-lg font-bold text-slate-700 mb-1">
                                        {isAr ? "سلة التسوق فارغة" : "Your cart is empty"}
                                    </p>
                                    <p className="text-sm text-slate-500 mb-6">
                                        {isAr ? "ابدأ باستكشاف أفضل المنتجات وأضفها إلى السلة" : "Discover our top products and add them to your cart"}
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="px-6 py-2.5 bg-[#c91c1c] text-white font-semibold rounded-md text-sm hover:bg-[#a51616] transition-colors"
                                    >
                                        {isAr ? "تسوق الآن" : "Continue Shopping"}
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="p-3.5 bg-white rounded-lg border border-slate-200 relative transition-shadow hover:shadow-xs"
                                    >
                                        <div className="flex gap-3">
                                            {/* Thumbnail */}
                                            <div className="relative w-20 h-20 rounded-md overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                                                <Image
                                                    src={item.image || "/placeholder.jpg"}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            </div>

                                            {/* Details & Urgent Notice */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                                                            {item.name}
                                                        </h3>
                                                        {item.variant && (
                                                            <p className="text-xs text-slate-500 mt-0.5">{item.variant}</p>
                                                        )}
                                                    </div>

                                                    {/* CircleV Stock Urgency Countdown Notification Box */}
                                                    <div className="bg-[#f87171] text-white text-[11px] leading-tight font-medium px-2.5 py-1.5 rounded-md shrink-0 text-center shadow-xs">
                                                        <div>{isAr ? "أكمل الطلب خلال" : "Checkout within"}</div>
                                                        <div className="font-bold text-xs tracking-wider">{timeLeftFormatted}</div>
                                                        <div>{isAr ? "قبل نفاد المخزون" : "so we don't run out"}</div>
                                                    </div>
                                                </div>

                                                {/* Pricing */}
                                                <div className="mt-2 flex items-baseline gap-2">
                                                    <span className="font-bold text-sm text-slate-900">
                                                        {formatCurrency(typeof item.price === "string" ? parseFloat(item.price) : item.price)}
                                                    </span>
                                                    {item.originalPrice && (
                                                        <span className="text-xs text-slate-400 line-through">
                                                            {formatCurrency(typeof item.originalPrice === "string" ? parseFloat(item.originalPrice) : item.originalPrice)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Stepper & Remove */}
                                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                                                    <div className="flex items-center border border-slate-300 rounded-md bg-white">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors rounded-l-md"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-xs font-bold w-7 text-center text-slate-900">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors rounded-r-md"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                                                        title="Remove item"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}

                            {/* Collapsible Accordions (Special Instructions & Discount) */}
                            {items.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    {/* 1. Special Instructions */}
                                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                                        <button
                                            type="button"
                                            onClick={() => setIsNotesOpen(!isNotesOpen)}
                                            className="w-full px-4 py-3 text-xs font-semibold text-slate-800 flex items-center justify-between hover:bg-slate-50"
                                        >
                                            <span>{isAr ? "تعليمات خاصة بالطلب" : "Special instructions"}</span>
                                            {isNotesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                        {isNotesOpen && (
                                            <div className="px-4 pb-3">
                                                <textarea
                                                    value={specialInstructions}
                                                    onChange={(e) => setSpecialInstructions(e.target.value)}
                                                    placeholder={isAr ? "ملاحظات إضافية للتوصيل أو التغليف..." : "Add order notes or delivery instructions..."}
                                                    className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:outline-hidden focus:border-slate-800 resize-y min-h-[60px]"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Discount */}
                                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                                        <button
                                            type="button"
                                            onClick={() => setIsDiscountOpen(!isDiscountOpen)}
                                            className="w-full px-4 py-3 text-xs font-semibold text-slate-800 flex items-center justify-between hover:bg-slate-50"
                                        >
                                            <span className="flex items-center gap-1.5">
                                                <Tag className="w-3.5 h-3.5 text-[#c91c1c]" />
                                                {isAr ? "رمز الخصم" : "Discount"}
                                                {discountCode && (
                                                    <span className="bg-red-50 text-[#c91c1c] text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                        {discountCode} (-{discountPercent}%)
                                                    </span>
                                                )}
                                            </span>
                                            {isDiscountOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                        {isDiscountOpen && (
                                            <div className="px-4 pb-3">
                                                {discountCode ? (
                                                    <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800">
                                                        <span>Code <strong>{discountCode}</strong> applied (-{formatCurrency(discountAmount())})</span>
                                                        <button
                                                            onClick={removeDiscount}
                                                            className="text-red-600 font-bold hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={couponInput}
                                                                onChange={(e) => setCouponInput(e.target.value)}
                                                                placeholder={isAr ? "أدخل كود الخصم (مثل HORUS10)" : "Enter coupon (e.g. HORUS10)"}
                                                                className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-md uppercase focus:outline-hidden focus:border-slate-800"
                                                            />
                                                            <button
                                                                type="submit"
                                                                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-md hover:bg-slate-800"
                                                            >
                                                                {isAr ? "تطبيق" : "Apply"}
                                                            </button>
                                                        </div>
                                                        {couponFeedback && (
                                                            <p className={cn("text-[11px]", couponFeedback.success ? "text-emerald-600" : "text-red-600")}>
                                                                {couponFeedback.message}
                                                            </p>
                                                        )}
                                                    </form>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer / Checkout */}
                        {items.length > 0 && (
                            <div className="p-5 border-t border-slate-200 bg-white space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-sm text-slate-600">
                                        <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                                        <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                                    </div>
                                    {discountPercent > 0 && (
                                        <div className="flex justify-between items-center text-sm text-emerald-600">
                                            <span>{isAr ? "الخصم" : "Discount"} ({discountPercent}%)</span>
                                            <span>-{formatCurrency(discountAmount())}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                                        <span className="text-base font-bold text-slate-900">
                                            {isAr ? "المجموع المقدر" : "Estimated total"}
                                        </span>
                                        <span className="text-xl font-black text-slate-900 font-mono">
                                            {formatCurrency(currentTotal)}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        {isAr
                                            ? "يتم احتساب الضرائب ومصاريف الشحن عند إتمام الطلب."
                                            : "Taxes and shipping calculated at checkout."}
                                    </p>
                                </div>

                                <Link
                                    href="/checkout"
                                    onClick={handleClose}
                                    className="block w-full py-3.5 bg-[#c91c1c] text-white font-bold text-center uppercase tracking-wider rounded-md hover:bg-[#a51616] transition-colors shadow-sm text-sm"
                                >
                                    {isAr ? "إتمام الطلب" : "Check out"}
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
