"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { t } = useLanguage();

    const themes = [
        { id: "obsidian", name: t.admin.settings.theme.options.obsidian, color: "#0a0a0f" },
        { id: "brown", name: t.admin.settings.theme.options.brown, color: "#2a1b15" },
        { id: "neon-blue", name: t.admin.settings.theme.options.neon_blue, color: "#050a14" }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">{t.admin.settings.title}</h1>
                <p className="text-gray-400">{t.admin.settings.subtitle}</p>
            </div>

            <div className="glass p-6 rounded-xl border border-white/5">
                <h2 className="text-xl font-bold text-white mb-4">{t.admin.settings.theme.title}</h2>
                <p className="text-gray-400 mb-6">{t.admin.settings.theme.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {themes.map((tItem) => (
                        <button
                            key={tItem.id}
                            onClick={() => setTheme(tItem.id as any)}
                            className={`relative p-4 rounded-xl border-2 transition-all ${theme === tItem.id
                                    ? "border-[var(--color-neon-blue)] bg-white/5"
                                    : "border-transparent hover:border-white/10 bg-black/20"
                                }`}
                        >
                            <div
                                className="w-full h-32 rounded-lg mb-4 shadow-lg flex flex-col justify-center items-center overflow-hidden"
                                style={{ backgroundColor: tItem.color }}
                            >
                                {/* Preview elements */}
                                <div className="w-full h-full p-4 space-y-2 opacity-50">
                                    <div className="h-2 w-1/2 bg-white/40 rounded"></div>
                                    <div className="h-2 w-3/4 bg-white/20 rounded"></div>
                                    <div className="h-2 w-2/3 bg-white/20 rounded"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`font-medium ${theme === tItem.id ? "text-[var(--color-neon-blue)]" : "text-gray-400"}`}>
                                    {tItem.name}
                                </span>
                                {theme === tItem.id && (
                                    <div className="w-2 h-2 rounded-full bg-[var(--color-neon-blue)] shadow-[0_0_10px_var(--color-neon-blue)]"></div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
