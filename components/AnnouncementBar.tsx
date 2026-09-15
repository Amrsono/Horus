"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AnnouncementBar() {
    const { locale } = useLanguage();
    const isAr = locale === "ar";

    const messages = isAr ? [
        "شحن مجاني للطلبات أكثر من 2500 جنيه",
        "لا تقلق.. كل ما تحتاجه متوفر لدينا",
        "توصيل سريع خلال 24 - 48 ساعة لجميع المحافظات",
    ] : [
        "Free shipping for orders over 2500 EGP",
        "Don't Worry we have it",
        "Fast 24-48 Hours Delivery Across Egypt",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % messages.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [messages.length]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
    };

    return (
        <div className="bg-slate-900 text-white text-xs font-medium py-2 px-4 select-none relative z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <button
                    onClick={handlePrev}
                    className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Previous announcement"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex-1 overflow-hidden text-center h-5 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentIndex}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="inline-block tracking-wide"
                        >
                            {messages[currentIndex]}
                        </motion.span>
                    </AnimatePresence>
                </div>

                <button
                    onClick={handleNext}
                    className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Next announcement"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
