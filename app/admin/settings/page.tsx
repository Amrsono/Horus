"use client";

import { motion } from "framer-motion";
import { Palette, Check, Monitor, Layout, Type, Loader2, Save, RefreshCw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { t } = useLanguage();
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [glassmorphismIntensity, setGlassmorphismIntensity] = useState(50);
    const [fontSizeMode, setFontSizeMode] = useState<'standard' | 'high_visibility'>('standard');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Load settings from Supabase
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('site_config')
                    .select('key, value')
                    .in('key', ['maintenance_mode', 'interface_options']);

                if (data) {
                    data.forEach(item => {
                        if (item.key === 'maintenance_mode') {
                            setMaintenanceMode(item.value === 'true');
                        }
                        if (item.key === 'interface_options') {
                            try {
                                const options = JSON.parse(item.value);
                                if (options.glassmorphism) setGlassmorphismIntensity(options.glassmorphism);
                                if (options.fontSize) setFontSizeMode(options.fontSize);
                            } catch (e) {
                                console.error("Error parsing interface options", e);
                            }
                        }
                    });
                }
            } catch (err) {
                console.error("Error loading settings:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const toggleMaintenanceMode = async () => {
        // Optimistic update
        const newValue = !maintenanceMode;
        setMaintenanceMode(newValue);

        try {
            await supabase
                .from('site_config')
                .upsert({ key: 'maintenance_mode', value: String(newValue) });

            document.cookie = `horus_maintenance_mode=${newValue}; path=/; max-age=${60 * 60 * 24 * 30}`;
        } catch (err) {
            console.error("Failed to toggle maintenance mode:", err);
            // Revert on error could be implemented here
        }
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        setSuccessMessage(null);

        try {
            // Save Interface Options
            const interfaceOptions = {
                glassmorphism: glassmorphismIntensity,
                fontSize: fontSizeMode
            };

            await supabase
                .from('site_config')
                .upsert({
                    key: 'interface_options',
                    value: JSON.stringify(interfaceOptions)
                });

            // Theme is already managed by ThemeContext but could be saved here if we want persistence across devices

            // Maintenance mode is saved on toggle, so we just confirm

            setSuccessMessage("Settings saved successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error("Error saving settings:", err);
            alert("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset all settings to default?")) {
            setTheme('obsidian');
            setGlassmorphismIntensity(50);
            setFontSizeMode('standard');
            setMaintenanceMode(false);

            // Trigger save to persist defaults
            // We do this individually to ensure state consistency
        }
    };

    const themes = [
        {
            id: "obsidian",
            name: "Current Black",
            description: "Deep obsidian backdrop with neon accents",
            bg: "bg-[#0a0a0f]",
            text: "text-white",
            border: "border-[var(--color-neon-blue)]"
        },
        {
            id: "pale-white",
            name: "Pale White",
            description: "Clean, professional light mode with high contrast",
            bg: "bg-[#f8f9fa]",
            text: "text-gray-900",
            border: "border-gray-200"
        },
        {
            id: "fluorescent-green",
            name: "Fluorescent Green",
            description: "High-energy cyber green for maximum impact",
            bg: "bg-[#00ff88]",
            text: "text-black",
            border: "border-black"
        }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-neon-blue)]" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Settings</h1>
                <p className="text-[var(--text-muted)]">Manage your website's appearance and configuration</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Identity Section */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="glass p-8 rounded-2xl border border-white/5 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Palette className="w-6 h-6 text-[var(--color-neon-blue)]" />
                            <h2 className="text-xl font-bold text-[var(--foreground)]">Visual Identity</h2>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Website Color Theme</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id as any)}
                                        className={cn(
                                            "relative group p-4 rounded-xl border-2 transition-all duration-300 text-left",
                                            theme === t.id
                                                ? "border-[var(--color-neon-blue)] bg-white/5"
                                                : "border-white/5 hover:border-white/20 bg-black/20"
                                        )}
                                    >
                                        <div className={cn("w-full h-24 rounded-lg mb-4 flex items-center justify-center overflow-hidden", t.bg)}>
                                            <div className={cn("text-xs font-bold px-3 py-1 rounded border", t.text, t.border)}>
                                                Aa
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-bold text-white text-sm">{t.name}</div>
                                                <div className="text-[10px] text-gray-500 leading-tight mt-1">{t.description}</div>
                                            </div>
                                            {theme === t.id && (
                                                <div className="w-5 h-5 bg-[var(--color-neon-blue)] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,212,255,0.5)]">
                                                    <Check className="w-3 h-3 text-black font-bold" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Interface Options</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Layout className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm text-gray-300">Glassmorphism Intensity</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={glassmorphismIntensity}
                                        onChange={(e) => setGlassmorphismIntensity(Number(e.target.value))}
                                        className="accent-[var(--color-neon-blue)] w-24 h-1.5"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Type className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm text-gray-300">Default Font Size</span>
                                    </div>
                                    <select
                                        value={fontSizeMode}
                                        onChange={(e) => setFontSizeMode(e.target.value as any)}
                                        className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none"
                                    >
                                        <option value="standard">Standard</option>
                                        <option value="high_visibility">High Visibility</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="glass p-8 rounded-2xl border border-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                            <Monitor className="w-6 h-6 text-[var(--color-quantum-purple)]" />
                            <h2 className="text-xl font-bold text-white">Store Availability</h2>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                            <div>
                                <div className="text-sm font-bold text-white">Maintenance Mode</div>
                                <div className="text-xs text-gray-500">Show a "coming soon" page to all visitors</div>
                            </div>
                            <button
                                onClick={toggleMaintenanceMode}
                                className={cn(
                                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                                    maintenanceMode ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-gray-700 hover:bg-gray-600"
                                )}
                            >
                                <motion.div
                                    animate={{ x: maintenanceMode ? 24 : 4 }}
                                    className="w-4 h-4 bg-white rounded-full absolute top-1 left-0"
                                />
                            </button>
                        </div>
                    </section>
                </div>

                {/* Preview Sidebar */}
                <div className="space-y-6">
                    <div className="glass p-6 rounded-2xl border border-white/5 sticky top-8">
                        <h3 className="font-bold text-white mb-4">Aesthetics Preview</h3>
                        <div className={cn("aspect-video rounded-xl border border-white/10 p-4 transition-all duration-500 relative overflow-hidden",
                            theme === 'obsidian' ? "bg-[#0a0a0f]" :
                                theme === 'pale-white' ? "bg-[#f8f9fa]" : "bg-[#00ff88]"
                        )}>
                            <div className="absolute inset-0 bg-white/5" style={{ backdropFilter: `blur(${glassmorphismIntensity * 0.1}px)` }} />
                            <div className="relative z-10">
                                <div className={cn("w-full h-2 rounded-full mb-2 opacity-20", theme === 'obsidian' ? "bg-white" : "bg-black")} />
                                <div className={cn("w-2/3 h-2 rounded-full mb-4 opacity-20", theme === 'obsidian' ? "bg-white" : "bg-black")} />
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="aspect-square glass rounded-lg" />
                                    <div className="aspect-square glass rounded-lg" />
                                </div>
                            </div>

                            {fontSizeMode === 'high_visibility' && (
                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-[10px] text-white">
                                    High Vis
                                </div>
                            )}
                        </div>

                        <div className="mt-6 space-y-2">
                            <button
                                onClick={handleSaveAll}
                                disabled={isSaving}
                                className="w-full py-2.5 bg-[var(--color-neon-blue)] text-black font-bold rounded-lg text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save All Changes
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={isSaving}
                                className="w-full py-2.5 bg-white/5 text-gray-400 rounded-lg text-sm border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset to Default
                            </button>
                        </div>

                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center"
                            >
                                {successMessage}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
