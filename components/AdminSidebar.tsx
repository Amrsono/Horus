"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, ArrowLeft, Package, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminSidebar() {
    const pathname = usePathname();
    const { t, locale, switchLanguage } = useLanguage();

    const toggleLanguage = () => {
        switchLanguage(locale === "en" ? "ar" : "en");
    };

    const links = [
        { name: t.admin.sidebar.overview, href: "/admin", icon: LayoutDashboard },
        { name: t.admin.sidebar.orders, href: "/admin/orders", icon: ShoppingBag },
        { name: t.admin.sidebar.customers, href: "/admin/customers", icon: Users },
        { name: t.admin.sidebar.products, href: "/admin/products", icon: Package },
        { name: t.admin.sidebar.settings, href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="w-64 h-screen glass-strong border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-quantum-purple)] bg-clip-text text-transparent">
                    HORUS ADMIN
                </h2>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
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
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{t.admin.sidebar.back_to_store}</span>
                </Link>
                <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors w-full">
                    <LogOut className="w-5 h-5" />
                    <span>{t.admin.sidebar.logout}</span>
                </button>
            </div>
        </div>
    );
}
