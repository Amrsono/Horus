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
    const { t, locale, switchLanguage, formatNumber } = useLanguage();
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
        { name: t.nav.shop, href: "/products" },
        { name: t.nav.sale_offers, href: "#sale" },
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
                        <div className="flex items-center gap-2">
                            <img src="/smoking-house-logo.png" alt="Smoking House Logo" className="w-10 h-10 object-contain" />
                            <h1 className="text-2xl font-bold tracking-tighter">
                                <span className="text-white group-hover:neon-text-blue transition-all duration-300">
                                    SMOKING
                                </span>
                                <span className="text-gradient ml-2 neon-text-purple">HOUSE</span>
                            </h1>
                        </div>
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

                        <motion.button
                            onClick={() => setIsCartOpen(true)}
                            className="relative group p-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className={cn(
                                "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                                totalItems > 0
                                    ? "bg-[var(--color-plasma-pink)]/20 border border-[var(--color-plasma-pink)] shadow-[0_0_15px_rgba(255,42,109,0.3)]"
                                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                            )}>
                                <ShoppingCart className={cn(
                                    "w-6 h-6 transition-colors duration-300",
                                    totalItems > 0 ? "text-[var(--color-plasma-pink)]" : "text-gray-300 group-hover:text-white"
                                )} />
                            </div>

                            {mounted && totalItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    key={totalItems} // Triggers animation on change
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--color-neon-blue)] text-black text-xs font-bold flex items-center justify-center rounded-full shadow-lg border-2 border-[var(--color-obsidian)]"
                                >
                                    {formatNumber(totalItems)}
                                </motion.span>
                            )}
                        </motion.button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.email === 'admin@smokinghouse.com' && (
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

                                <button
                                    onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
                                    className="text-left text-lg text-gray-300 hover:text-[var(--color-plasma-pink)] transition-colors flex items-center gap-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {t.nav.cart || "Cart"} {mounted && totalItems > 0 && `(${totalItems})`}
                                </button>

                                {user ? (
                                    <>
                                        {user.email === 'admin@horus.com' && (
                                            <Link
                                                href="/admin"
                                                className="text-center py-3 bg-[var(--color-neon-blue)] text-black font-bold rounded-lg hover:bg-[var(--color-electric-cyan)] transition-colors"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            href="/profile"
                                            className="text-center py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {t.nav.profile || "Profile"}
                                        </Link>
                                        <button
                                            onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                                            className="text-center py-3 bg-red-500/20 text-red-400 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            {t.nav.logout || "Logout"}
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="text-center py-3 bg-[var(--color-neon-blue)] text-black font-bold rounded-lg hover:bg-[var(--color-electric-cyan)] transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {t.nav.login}
                                    </Link>
                                )}

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
}
