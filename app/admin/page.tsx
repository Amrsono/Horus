"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";

const data = [
    { name: 'Mon', revenue: 4000, orders: 24 },
    { name: 'Tue', revenue: 3000, orders: 18 },
    { name: 'Wed', revenue: 2000, orders: 12 },
    { name: 'Thu', revenue: 2780, orders: 20 },
    { name: 'Fri', revenue: 1890, orders: 15 },
    { name: 'Sat', revenue: 2390, orders: 19 },
    { name: 'Sun', revenue: 3490, orders: 22 },
];

const stats = [
    { label: "Total Revenue", value: "$45,231.89", icon: DollarSign, color: "neon-blue" },
    { label: "Total Orders", value: "1,203", icon: ShoppingBag, color: "quantum-purple" },
    { label: "New Customers", value: "342", icon: Users, color: "plasma-pink" },
    { label: "Growth", value: "+24%", icon: TrendingUp, color: "cyber-green" },
];

export default function AdminDashboardPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Welcome back, Admin</p>
                </div>
                <div className="px-4 py-2 bg-[var(--color-neon-blue)]/10 border border-[var(--color-neon-blue)] rounded-lg text-[var(--color-neon-blue)] text-sm font-mono">
                    System Online
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="glass p-6 rounded-xl border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg bg-[var(--color-${stat.color})]/10 text-[var(--color-${stat.color})]`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">+12%</span>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-6">Revenue Over Time</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-neon-blue)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-neon-blue)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid #333' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="var(--color-neon-blue)" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass p-6 rounded-xl border border-white/5 wait">
                    <h3 className="text-lg font-bold text-white mb-6">Recent Orders</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-quantum-purple)]/20 flex items-center justify-center text-[var(--color-quantum-purple)] font-bold">
                                        JD
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">John Doe</div>
                                        <div className="text-xs text-gray-400">#ORD-2077-{i}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[var(--color-neon-blue)] font-mono">$129.99</div>
                                    <div className="text-xs text-gray-500">Just now</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
