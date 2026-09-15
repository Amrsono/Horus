"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, ArrowLeft, Package, Globe, BarChart3, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminSidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const { t, locale, switchLanguage } = useLanguage();
    const { signOut } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    // Detect screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
                {isMobileMenuOpen && isMobile && (
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
                    x: isMobile ? (isMobileMenuOpen ? 0 : "-100%") : 0
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-64 h-screen glass-strong border-r border-[var(--border-subtle)] flex flex-col fixed left-0 top-0 z-50"
            >
                <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--primary-accent)] to-[var(--color-quantum-purple)] bg-clip-text text-transparent">
                        CLOUDS ADMIN
                    </h2>
                    {/* Close button for mobile */}
                    <button
                        onClick={closeMobileMenu}
                        className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
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
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                                    isActive
                                        ? "bg-[var(--primary-accent)]/15 text-[var(--primary-accent)] border border-[var(--primary-accent)]/30 font-bold shadow-xs"
                                        : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-main)]"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[var(--border-subtle)] space-y-2">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-3 px-4 py-3 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors w-full rounded-xl hover:bg-[var(--surface-subtle)] font-medium"
                    >
                        <Globe className="w-5 h-5" />
                        <span>{locale === "en" ? "العربية" : "English"}</span>
                    </button>
                    <Link
                        href="/"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-4 py-3 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors rounded-xl hover:bg-[var(--surface-subtle)] font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                        <span>{t.admin.sidebar.back_to_store}</span>
                    </Link>


                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors w-full rounded-xl hover:bg-red-400/5"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>{t.admin.sidebar.logout}</span>
                    </button>
                </div>
            </motion.div>
        </>
    );
}
