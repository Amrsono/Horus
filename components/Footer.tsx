"use client";

import Link from "next/link";
import { Twitter, Instagram, Linkedin, Github, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="border-t border-white/5 bg-[var(--color-obsidian)] text-white/60">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-1">
                        <Link href="/" className="group inline-block mb-6">
                            <div className="flex items-center gap-2">
                                <img src="/smoking-house-logo.png" alt="Smoking House Logo" className="w-8 h-8 object-contain" />
                                <h2 className="text-2xl font-bold text-white tracking-tighter">
                                    SMOKING <span className="text-[var(--color-neon-blue)]">HOUSE</span>
                                </h2>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6">
                            {t.footer.description}
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[var(--color-neon-blue)] hover:text-black transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[var(--color-plasma-pink)] hover:text-black transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[var(--color-quantum-purple)] hover:text-black transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">{t.footer.sections.shop.title}</h4>
                        <ul className="space-y-4 text-sm">
                            {t.footer.sections.shop.links.map((link, index) => (
                                <li key={index}><Link href="#" className="hover:text-[var(--color-neon-blue)] transition-colors">{link}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">{t.footer.sections.support.title}</h4>
                        <ul className="space-y-4 text-sm">
                            {t.footer.sections.support.links.map((link, index) => (
                                <li key={index}><Link href="#" className="hover:text-[var(--color-neon-blue)] transition-colors">{link}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">{t.footer.newsletter}</h4>
                        <p className="text-sm mb-4">{t.footer.newsletter_desc}</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder={t.footer.placeholders.email}
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-neon-blue)] w-full"
                            />
                            <button type="submit" className="bg-[var(--color-neon-blue)] text-black px-4 py-2 rounded-lg hover:bg-[var(--color-electric-cyan)] transition-colors">
                                <Mail className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>{t.footer.rights}</p>
                    <div className="flex gap-6">
                        {t.footer.sections.legal.map((link, index) => (
                            <Link key={index} href="#" className="hover:text-white transition-colors">{link}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
