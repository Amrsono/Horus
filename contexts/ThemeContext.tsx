"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "obsidian" | "brown" | "neon-blue";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("obsidian");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load theme from localStorage on mount
        const savedTheme = localStorage.getItem("horus-theme") as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Apply theme to document element
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("horus-theme", theme);
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
