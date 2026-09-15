import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "Clouds - Leading Online Vape Store in Egypt",
  description: "Discover premium vaping at Clouds. High-quality e-liquids, advanced mods, disposables and hardware.",
  keywords: ["vaping egypt", "clouds", "e-liquid", "vape store", "disposables"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          inter.variable,
          "antialiased min-h-screen flex flex-col bg-white text-slate-900"
        )}
      >
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              {children}
              <CookieConsent />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
