"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, ArrowLeft, Package, Globe, BarChart3, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminSidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { t, locale, switchLanguage } = useLanguage();

    const toggleLanguage = () => {
        switchLanguage(locale === "en" ? "ar" : "en");
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const links = [
        { name: t.admin.sidebar.overview, href: "/admin", icon: LayoutDashboard },
        { name: t.admin.sidebar.orders, href: "/admin/orders", icon: ShoppingBag },
        { name: t.admin.sidebar.customers, href: "/admin/customers", icon: Users },
        { name: t.admin.sidebar.products, href: "/admin/products", icon: Package },
        { name: t.admin.sidebar.analytics, href: "/admin/analytics", icon: BarChart3 },
        { name: t.admin.sidebar.settings, href: "/admin/settings", icon: Settings },
    ];

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={toggleMobileMenu}
                className="md:hidden fixed top-4 left-4 z-50 p-3 bg-[var(--color-deep-space)] border border-white/10 rounded-xl text-white hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Backdrop Overlay for Mobile */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={closeMobileMenu}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                initial={false}
                animate={{
                    x: isMobileMenuOpen ? 0 : "-100%"
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={cn(
                    "w-64 h-screen glass-strong border-r border-white/10 flex flex-col fixed left-0 top-0 z-50",
                    "md:translate-x-0" // Always visible on desktop
                )}
            >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-quantum-purple)] bg-clip-text text-transparent">
                        HORUS ADMIN
                    </h2>
                    {/* Close button for mobile */}
                    <button
                        onClick={closeMobileMenu}
                        className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMobileMenu}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                                    isActive
                                        ? "bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/30"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors w-full rounded-xl hover:bg-white/5"
                    >
                        <Globe className="w-5 h-5" />
                        <span className="font-medium">{locale === "en" ? "العربية" : "English"}</span>
                    </button>
                    <Link
                        href="/"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>{t.admin.sidebar.back_to_store}</span>
                    </Link>
                    <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors w-full rounded-xl hover:bg-red-400/5">
                        <LogOut className="w-5 h-5" />
                        <span>{t.admin.sidebar.logout}</span>
                    </button>
                </div>
            </motion.div>
        </>
    );
}
