"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, Search, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const totalItems = useCartStore((state) => state.totalItems());
    const { t, locale, switchLanguage } = useLanguage();
    const { user, signOut } = useAuth();

    // Prevent hydration mismatch for persisted store
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleLanguage = () => {
        switchLanguage(locale === "en" ? "ar" : "en");
    };

    const navLinks = [
        { name: t.nav.home, href: "/" },
        { name: t.nav.shop, href: "/shop" },
        { name: t.nav.features, href: "#features" },
        { name: t.nav.about, href: "/about" },
    ];

    return (
        <>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12",
                    isScrolled ? "glass-strong py-2" : "bg-transparent"
                )}
                dir={locale === "ar" ? "rtl" : "ltr"}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group">
                        <h1 className="text-2xl font-bold tracking-tighter">
                            <span className="text-white group-hover:neon-text-blue transition-all duration-300">
                                HORUS
                            </span>
                            <span className="text-gradient ml-2 neon-text-purple">SMOKING</span>
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-300 hover:text-white transition-colors relative group text-sm uppercase tracking-wider font-medium"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-quantum-purple)] transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
                        <button
                            onClick={toggleLanguage}
                            className="text-gray-300 hover:text-[var(--color-neon-blue)] transition-colors flex items-center gap-1 text-xs uppercase font-bold"
                        >
                            <Globe className="w-4 h-4" />
                            {locale === "en" ? "AR" : "EN"}
                        </button>

                        <button className="text-gray-300 hover:text-[var(--color-neon-blue)] transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative text-gray-300 hover:text-[var(--color-plasma-pink)] transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {mounted && totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--color-neon-blue)] text-black text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse-slow">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.email === 'admin@horus.com' && (
                                    <Link
                                        href="/admin"
                                        className="text-sm font-semibold text-[var(--color-neon-blue)] hover:text-white transition-colors"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <Link
                                    href="/profile"
                                    className="text-sm font-semibold text-white hover:text-[var(--color-neon-blue)] transition-colors"
                                >
                                    {t.nav.profile || "Profile"}
                                </Link>
                                <button
                                    onClick={signOut}
                                    className="px-6 py-2 glass border border-red-500/30 rounded-full text-sm font-semibold hover:bg-red-500 hover:text-white transition-all duration-300"
                                >
                                    {t.nav.logout || "Logout"}
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-6 py-2 glass border border-[var(--color-neon-blue)]/30 rounded-full text-sm font-semibold hover:bg-[var(--color-neon-blue)] hover:text-black transition-all duration-300 hover:neon-glow-blue"
                            >
                                {t.nav.login}
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden glass-strong absolute top-full left-0 right-0 border-t border-white/10 overflow-hidden"
                        >
                            <div className="flex flex-col p-6 space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-lg text-gray-300 hover:text-[var(--color-neon-blue)] transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="h-px bg-white/10 my-2" />
                                <button
                                    onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                                    className="text-left text-lg text-gray-300 hover:text-[var(--color-neon-blue)] transition-colors flex items-center gap-2"
                                >
                                    <Globe className="w-5 h-5" />
                                    {locale === "en" ? "Switch to Arabic" : "Switch to English"}
                                </button>
                                <Link
                                    href="/login"
                                    className="text-center py-3 bg-[var(--color-neon-blue)] text-black font-bold rounded-lg hover:bg-[var(--color-electric-cyan)] transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t.nav.login}
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
}
