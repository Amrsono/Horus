"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "obsidian" | "brown" | "neon-blue" | "light";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "obsidian";

    // 1. Try cookie
    const match = document.cookie.match(/(?:^|;\s*)clouds-theme=([^;]*)/);
    if (match && match[1]) {
        const cookieTheme = decodeURIComponent(match[1]) as Theme;
        if (["obsidian", "brown", "neon-blue", "light"].includes(cookieTheme)) {
            return cookieTheme;
        }
    }

    // 2. Try localStorage
    try {
        const saved = (localStorage.getItem("clouds-theme") || localStorage.getItem("horus-theme")) as Theme;
        if (saved && ["obsidian", "brown", "neon-blue", "light"].includes(saved)) {
            return saved;
        }
    } catch {
        // Ignore localStorage error if private browsing
    }

    return "obsidian";
}

function applyThemeToDom(theme: Theme) {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark";
    // Also set cookie so SSR renders the correct theme on next page load
    document.cookie = `clouds-theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    try {
        localStorage.setItem("clouds-theme", theme);
    } catch {
        // Ignore
    }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);
    const [mounted, setMounted] = useState(false);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        applyThemeToDom(newTheme);
        // Dispatch custom event for immediate intra-window reactivity
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("clouds-theme-change", { detail: newTheme }));
        }
    };

    useEffect(() => {
        const current = getInitialTheme();
        setThemeState(current);
        applyThemeToDom(current);
        setMounted(true);

        // Listen for storage changes across tabs
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "clouds-theme" && e.newValue) {
                const incoming = e.newValue as Theme;
                if (["obsidian", "brown", "neon-blue", "light"].includes(incoming)) {
                    setThemeState(incoming);
                    applyThemeToDom(incoming);
                }
            }
        };

        const handleCustomEvent = (e: Event) => {
            const customEvent = e as CustomEvent<Theme>;
            if (customEvent.detail && customEvent.detail !== theme) {
                setThemeState(customEvent.detail);
            }
        };

        window.addEventListener("storage", handleStorage);
        window.addEventListener("clouds-theme-change", handleCustomEvent);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("clouds-theme-change", handleCustomEvent);
        };
    }, []);

    useEffect(() => {
        if (!mounted) return;
        applyThemeToDom(theme);
    }, [theme, mounted]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
