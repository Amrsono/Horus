"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { t, locale } = useLanguage();
    const isAr = locale === "ar";
    const [justChanged, setJustChanged] = useState(false);

    const themes = [
        {
            id: "obsidian",
            name: t.admin.settings.theme.options.obsidian,
            color: "#0a0a0f",
            accent: "#00d4ff",
            textColor: "#ffffff"
        },
        {
            id: "brown",
            name: t.admin.settings.theme.options.brown,
            color: "#2a1b15",
            accent: "#f59e0b",
            textColor: "#fef3c7"
        },
        {
            id: "neon-blue",
            name: t.admin.settings.theme.options.neon_blue,
            color: "#050a14",
            accent: "#00d4ff",
            textColor: "#f0f9ff"
        },
        {
            id: "light",
            name: t.admin.settings.theme.options.light || "Pure White",
            color: "#ffffff",
            accent: "#c91c1c",
            textColor: "#0f172a",
            previewBorder: true
        }
    ];

    const handleSelectTheme = (themeId: any) => {
        setTheme(themeId);
        setJustChanged(true);
        setTimeout(() => setJustChanged(false), 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
            dir={isAr ? "rtl" : "ltr"}
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-2 tracking-tight">
                        {t.admin.settings.title}
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm">{t.admin.settings.subtitle}</p>
                </div>

                <AnimatePresence>
                    {justChanged && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary-accent)]/15 border border-[var(--primary-accent)]/30 text-[var(--text-main)] text-sm font-semibold shadow-sm"
                        >
                            <Sparkles className="w-4 h-4 text-[var(--primary-accent)]" />
                            <span>
                                {isAr
                                    ? "تم تطبيق النمط الجديد على كامل المتجر ولوحة التحكم!"
                                    : "Theme updated across the entire store and admin dashboard!"}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="glass p-6 md:p-8 rounded-2xl border border-[var(--border-subtle)] transition-all">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-main)] mb-1">
                        {t.admin.settings.theme.title}
                    </h2>
                    <p className="text-[var(--text-muted)] text-sm">
                        {t.admin.settings.theme.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {themes.map((tItem) => {
                        const isSelected = theme === tItem.id;

                        return (
                            <button
                                key={tItem.id}
                                type="button"
                                onClick={() => handleSelectTheme(tItem.id)}
                                className={`relative p-4 rounded-2xl text-left rtl:text-right transition-all duration-300 group cursor-pointer ${
                                    isSelected
                                        ? "ring-2 ring-[var(--primary-accent)] bg-[var(--surface-subtle)] shadow-xl scale-[1.02]"
                                        : "border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--surface)] hover:scale-[1.01]"
                                }`}
                            >
                                {/* Preview Palette Box */}
                                <div
                                    className="w-full h-32 rounded-xl mb-4 shadow-md flex flex-col justify-between p-4 overflow-hidden relative"
                                    style={{
                                        backgroundColor: tItem.color,
                                        border: tItem.previewBorder ? "1px solid #cbd5e1" : "1px solid rgba(255,255,255,0.1)"
                                    }}
                                >
                                    {/* Preview header simulation */}
                                    <div className="flex items-center justify-between w-full">
                                        <div
                                            className="w-8 h-2 rounded-full"
                                            style={{ backgroundColor: tItem.accent }}
                                        />
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: tItem.accent, opacity: 0.8 }}
                                        />
                                    </div>

                                    {/* Preview lines */}
                                    <div className="space-y-2">
                                        <div
                                            className="h-2 w-3/4 rounded"
                                            style={{
                                                backgroundColor: tItem.id === "light" ? "#334155" : "rgba(255,255,255,0.5)"
                                            }}
                                        />
                                        <div
                                            className="h-2 w-1/2 rounded"
                                            style={{
                                                backgroundColor: tItem.id === "light" ? "#94a3b8" : "rgba(255,255,255,0.25)"
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <span
                                            className={`font-bold text-sm block ${
                                                isSelected ? "text-[var(--primary-accent)]" : "text-[var(--text-main)]"
                                            }`}
                                        >
                                            {tItem.name}
                                        </span>
                                        <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium">
                                            {tItem.id}
                                        </span>
                                    </div>

                                    {isSelected && (
                                        <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md"
                                            style={{ backgroundColor: tItem.accent }}
                                        >
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}
