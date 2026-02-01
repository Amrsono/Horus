"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Wind, Smartphone, Globe, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";



const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

import { useLanguage } from "@/contexts/LanguageContext";

export default function FeaturesSection() {
    const { t } = useLanguage();

    const features = [
        {
            icon: <Zap className="w-8 h-8 text-[var(--color-neon-blue)]" />,
            title: t.features.items.quantum_ignition.title,
            description: t.features.items.quantum_ignition.desc,
            gradient: "from-[var(--color-neon-blue)]/20 to-transparent",
        },
        {
            icon: <Shield className="w-8 h-8 text-[var(--color-quantum-purple)]" />,
            title: t.features.items.bio_lock.title,
            description: t.features.items.bio_lock.desc,
            gradient: "from-[var(--color-quantum-purple)]/20 to-transparent",
        },
        {
            icon: <Wind className="w-8 h-8 text-[var(--color-plasma-pink)]" />,
            title: t.features.items.zero_g.title,
            description: t.features.items.zero_g.desc,
            gradient: "from-[var(--color-plasma-pink)]/20 to-transparent",
        },
        {
            icon: <Smartphone className="w-8 h-8 text-[var(--color-electric-cyan)]" />,
            title: t.features.items.neural_synergy.title,
            description: t.features.items.neural_synergy.desc,
            gradient: "from-[var(--color-electric-cyan)]/20 to-transparent",
        },
        {
            icon: <Globe className="w-8 h-8 text-[var(--color-solar-yellow)]" />,
            title: t.features.items.universal_charging.title,
            description: t.features.items.universal_charging.desc,
            gradient: "from-[var(--color-solar-yellow)]/20 to-transparent",
        },
        {
            icon: <Cpu className="w-8 h-8 text-[var(--color-cyber-green)]" />,
            title: t.features.items.ai_optimization.title,
            description: t.features.items.ai_optimization.desc,
            gradient: "from-[var(--color-cyber-green)]/20 to-transparent",
        },
    ];

    return (
        <section id="features" className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[var(--color-quantum-purple)]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[var(--color-neon-blue)]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[var(--color-neon-blue)] font-bold tracking-widest uppercase mb-4 text-sm"
                    >
                        {t.features.section_title}
                    </motion.h2>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-black mb-6"
                    >
                        {t.features.main_title} <span className="text-gradient hover:neon-text-purple transition-all duration-300">{t.features.main_title_highlight}</span>
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="max-w-2xl mx-auto text-gray-400 text-lg"
                    >
                        {t.features.description}
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group relative p-8 glass hover:glass-strong rounded-xl transition-all duration-500 border border-white/5 hover:border-[var(--color-neon-blue)]/30 hover-lift"
                        >
                            {/* Card Gradient Background */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl",
                                feature.gradient
                            )} />

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-lg bg-black/50 flex items-center justify-center mb-6 border border-white/10 group-hover:border-[var(--color-neon-blue)]/50 transition-colors duration-500 shadow-lg group-hover:neon-glow-blue">
                                    {feature.icon}
                                </div>

                                <h4 className="text-xl font-bold mb-3 text-white group-hover:text-[var(--color-neon-blue)] transition-colors duration-300">
                                    {feature.title}
                                </h4>

                                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
