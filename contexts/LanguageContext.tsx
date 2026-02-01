"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "@/locales/en";
import { ar } from "@/locales/ar";

type Locale = "en" | "ar";
type Translations = typeof en;

interface LanguageContextType {
    locale: Locale;
    t: Translations;
    switchLanguage: (lang: Locale) => void;
    isRTL: boolean;
    formatCurrency: (amount: number) => string;
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>("en");
    const [isRTL, setIsRTL] = useState(false);

    // Load saved preference
    useEffect(() => {
        const saved = localStorage.getItem("horus-locale") as Locale;
        if (saved) {
            setLocale(saved);
            setIsRTL(saved === "ar");
            document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
            document.documentElement.lang = saved;
        }
    }, []);

    const switchLanguage = (lang: Locale) => {
        setLocale(lang);
        setIsRTL(lang === "ar");
        localStorage.setItem("horus-locale", lang);
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lang;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
            style: 'currency',
            currency: 'EGP',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
        return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', options).format(num);
    };

    const t = locale === "en" ? en : ar;

    return (
        <LanguageContext.Provider value={{ locale, t, switchLanguage, isRTL, formatCurrency, formatNumber }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
