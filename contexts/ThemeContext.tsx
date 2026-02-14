"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "obsidian" | "pale-white" | "fluorescent-green";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("obsidian");
    const [mounted, setMounted] = useState(false);

    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("horus-theme") as Theme;
        if (savedTheme && ["obsidian", "pale-white", "fluorescent-green"].includes(savedTheme)) {
            setThemeState(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme);
        } else {
            document.documentElement.setAttribute("data-theme", "obsidian");
        }
        setMounted(true);
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("horus-theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    // Prevent hydration mismatch by rendering children only after mounting
    // (Optional: can also just return the provider with the initial state)
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
