"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, Globe, User, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import CartDrawer from "./CartDrawer";
import AnnouncementBar from "./AnnouncementBar";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const { openCart, totalItems } = useCartStore();
    const count = totalItems();
    const { t, locale, switchLanguage, formatNumber } = useLanguage();
    const isAr = locale === "ar";
    const { user } = useAuth();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleLanguage = () => {
        switchLanguage(locale === "en" ? "ar" : "en");
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const navLinks = [
        { name: isAr ? "الرئيسية" : "Home", href: "/" },
        { name: isAr ? "المتجر" : "Shop", href: "/shop" },
        { name: isAr ? "عروض التخفيضات" : "Sale Offers", href: "/#sale" },
        { name: isAr ? "تتبع طلبك" : "Track Order", href: "/track", icon: true },
        { name: isAr ? "من نحن" : "About", href: "/about" },
    ];

    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-[var(--surface)] transition-colors" dir={isAr ? "rtl" : "ltr"}>
            <AnnouncementBar />

            <CartDrawer />

            <div
                className={cn(
                    "w-full bg-[var(--surface)] transition-all duration-300 border-b border-[var(--border-subtle)]",
                    isScrolled ? "shadow-md" : ""
                )}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
                    {/* Mobile menu trigger */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-md"
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--surface-subtle)] flex items-center justify-center border border-[var(--border-subtle)]">
                            <img
                                src="/clouds-logo.jpg"
                                alt="Clouds Logo"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    // fallback if image not found
                                    (e.target as HTMLElement).style.display = "none";
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-black tracking-tight text-[var(--text-main)] leading-none">
                                CLOUD<span className="text-[var(--primary-accent)]">S</span>
                            </span>
                            <span className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase font-semibold">
                                Premium Vape
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-7 rtl:space-x-reverse">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--primary-accent)] transition-colors relative py-1 flex items-center gap-1.5"
                            >
                                {link.icon && <Truck className="w-4 h-4 text-[var(--primary-accent)]" />}
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions: Search, Account, Language, Cart */}
                    <div className="flex items-center space-x-3 md:space-x-4 rtl:space-x-reverse">
                        {/* Search Icon */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 text-[var(--text-muted)] hover:text-[var(--primary-accent)] hover:bg-[var(--surface-subtle)] rounded-full transition-colors"
                            aria-label="Search store"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Language Switch */}
                        <button
                            onClick={toggleLanguage}
                            className="hidden sm:flex items-center gap-1 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary-accent)] px-2.5 py-1.5 rounded-md hover:bg-[var(--surface-subtle)] transition-colors uppercase"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            {locale === "en" ? "AR" : "EN"}
                        </button>

                        {/* User Profile / Admin */}
                        {user ? (
                            <div className="flex items-center gap-2">
                                {(user.email === "admin@clouds.com" || user.email === "admin@smokinghouse.com") && (
                                    <Link
                                        href="/admin"
                                        className="text-xs font-bold px-2.5 py-1 bg-[var(--primary-accent)]/15 text-[var(--primary-accent)] border border-[var(--primary-accent)]/30 rounded-md hover:bg-[var(--primary-accent)]/25 transition-colors"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <Link
                                    href="/profile"
                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--primary-accent)] hover:bg-[var(--surface-subtle)] rounded-full transition-colors"
                                    title={user.email || "Profile"}
                                >
                                    <User className="w-5 h-5" />
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="p-2 text-[var(--text-muted)] hover:text-[var(--primary-accent)] hover:bg-[var(--surface-subtle)] rounded-full transition-colors"
                                title="Sign in"
                            >
                                <User className="w-5 h-5" />
                            </Link>
                        )}

                        {/* Cart Icon with numeric count badge */}
                        <button
                            onClick={openCart}
                            className="relative p-2 text-[var(--text-main)] hover:text-[var(--primary-accent)] transition-colors rounded-full hover:bg-[var(--surface-subtle)]"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {mounted && count > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-[var(--primary-accent)] text-[var(--primary-accent-text)] text-[11px] font-black rounded-full flex items-center justify-center px-1 shadow-xs animate-in zoom-in-75">
                                    {formatNumber(count)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Inline Expandable Search Bar */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-slate-200 bg-slate-50 px-4 py-3 overflow-hidden"
                        >
                            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={isAr ? "ابحث عن السوائل، الأجهزة، الكويلات..." : "Search e-liquids, hardware, disposables..."}
                                        autoFocus
                                        className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-hidden focus:border-slate-800"
                                    />
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                                </div>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-[#c91c1c] text-white text-xs font-bold uppercase rounded-md hover:bg-[#a51616] transition-colors"
                                >
                                    {isAr ? "بحث" : "Search"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-700"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-4 space-y-3"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-sm font-bold uppercase tracking-wider text-[var(--text-main)] hover:text-[var(--primary-accent)] py-2 border-b border-[var(--border-subtle)] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-2 flex items-center justify-between">
                                <button
                                    onClick={toggleLanguage}
                                    className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary-accent)] uppercase transition-colors"
                                >
                                    <Globe className="w-4 h-4" />
                                    {locale === "en" ? "العربية (AR)" : "English (EN)"}
                                </button>
                                {user && (
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-xs font-bold text-[var(--primary-accent)]"
                                    >
                                        {isAr ? "حسابي" : "My Profile"}
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
