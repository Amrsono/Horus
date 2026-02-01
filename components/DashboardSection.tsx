"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Activity, Users, DollarSign, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const data = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
];

import { useLanguage } from "@/contexts/LanguageContext";

export default function DashboardSection() {
    const { t } = useLanguage();

    const stats = [
        {
            icon: <DollarSign className="w-6 h-6 text-[var(--color-neon-blue)]" />,
            label: t.dashboard.total_revenue,
            value: "$45,231.89",
            change: "+20.1%",
            color: "neon-blue"
        },
        {
            icon: <Users className="w-6 h-6 text-[var(--color-quantum-purple)]" />,
            label: t.dashboard.active_users,
            value: "+2350",
            change: "+180.1%",
            color: "quantum-purple"
        },
        {
            icon: <Activity className="w-6 h-6 text-[var(--color-plasma-pink)]" />,
            label: t.dashboard.sales,
            value: "+12,234",
            change: "+19%",
            color: "plasma-pink"
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-[var(--color-cyber-green)]" />,
            label: t.dashboard.active_now,
            value: "+573",
            change: "+201",
            color: "cyber-green"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[var(--color-neon-blue)]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-[var(--color-electric-cyan)] font-bold tracking-widest uppercase mb-4 text-sm border border-[var(--color-electric-cyan)]/30 px-3 py-1 rounded-full w-fit">
                            {t.dashboard.merchant_portal}
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            {t.dashboard.control} <span className="text-gradient">{t.dashboard.empire}</span>
                        </h3>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            {t.dashboard.description}
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="glass p-6 rounded-xl border-l-2" style={{ borderLeftColor: `var(--color-${stat.color})` }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-gray-400 text-sm">{stat.label}</span>
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl font-bold font-mono text-white mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs text-[var(--color-cyber-green)]">
                                        {stat.change} {t.dashboard.from_last_month}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Interactive Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Window Frame */}
                        <div className="glass-strong rounded-2xl overflow-hidden border border-[var(--color-neon-blue)]/20 shadow-2xl shadow-[var(--color-neon-blue)]/10">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-4 bg-black/20">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <div className="flex-1 text-center text-xs text-gray-500 font-mono">
                                    analytics.horus.sys
                                </div>
                            </div>

                            {/* Chart Area */}
                            <div className="p-8 h-[400px]">
                                <h4 className="text-lg font-bold text-white mb-6">{t.dashboard.revenue_overview}</h4>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--color-obsidian)',
                                                border: '1px solid var(--color-neon-blue)',
                                                borderRadius: '8px'
                                            }}
                                            itemStyle={{ color: '#fff' }}
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill="var(--color-neon-blue)"
                                            radius={[4, 4, 0, 0]}
                                            barSize={40}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 glass p-4 rounded-xl border border-[var(--color-plasma-pink)]/50 z-20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-[var(--color-plasma-pink)] animate-pulse" />
                                <span className="text-xs font-bold text-white">{t.dashboard.live_transaction}</span>
                            </div>
                            <div className="mt-2 text-sm font-mono text-[var(--color-plasma-pink)]">
                                + $1,294.00
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
