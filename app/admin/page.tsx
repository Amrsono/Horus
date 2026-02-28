"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    newCustomers: number;
    growth: number;
}

interface RevenueData {
    name: string;
    revenue: number;
    orders: number;
}

interface RecentOrder {
    id: string;
    guest_email: string;
    total_amount: number;
    created_at: string;
}


import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminDashboardPage() {
    const { t, formatCurrency, formatNumber } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalOrders: 0,
        newCustomers: 0,
        growth: 0
    });
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

    useEffect(() => {
        setMounted(true);
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);

        // Fetch total revenue and orders
        const { data: ordersData } = await supabase
            .from('orders')
            .select('total_amount, created_at');

        if (ordersData) {
            const totalRevenue = ordersData.reduce((sum, order) => sum + Number(order.total_amount), 0);
            const totalOrders = ordersData.length;

            // Calculate new customers this month
            const monthStart = new Date();
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);

            const newCustomers = ordersData.filter(order =>
                new Date(order.created_at) >= monthStart
            ).length;

            // Calculate growth (simplified - comparing this month to last month)
            const lastMonthStart = new Date(monthStart);
            lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

            const thisMonthRevenue = ordersData
                .filter(order => new Date(order.created_at) >= monthStart)
                .reduce((sum, order) => sum + Number(order.total_amount), 0);

            const lastMonthRevenue = ordersData
                .filter(order => {
                    const date = new Date(order.created_at);
                    return date >= lastMonthStart && date < monthStart;
                })
                .reduce((sum, order) => sum + Number(order.total_amount), 0);

            const growth = lastMonthRevenue > 0
                ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
                : 0;

            setStats({
                totalRevenue,
                totalOrders,
                newCustomers,
                growth
            });

            // Prepare revenue chart data (last 7 days)
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                return date;
            });

            const chartData = last7Days.map(date => {
                const dayOrders = ordersData.filter(order => {
                    const orderDate = new Date(order.created_at);
                    return orderDate.toDateString() === date.toDateString();
                });

                return {
                    name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    revenue: dayOrders.reduce((sum, order) => sum + Number(order.total_amount), 0),
                    orders: dayOrders.length
                };
            });

            setRevenueData(chartData);
        }

        // Fetch recent orders
        const { data: recentOrdersData } = await supabase
            .from('orders')
            .select('id, guest_email, total_amount, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        if (recentOrdersData) {
            setRecentOrders(recentOrdersData);
        }

        setIsLoading(false);
    };

    if (!mounted) return null;

    const statsDisplay = [
        {
            label: t.admin.dashboard.stats.total_revenue,
            value: formatCurrency(stats.totalRevenue),
            icon: DollarSign,
            color: "neon-blue"
        },
        {
            label: t.admin.dashboard.stats.total_orders,
            value: formatNumber(stats.totalOrders),
            icon: ShoppingBag,
            color: "quantum-purple"
        },
        {
            label: t.admin.dashboard.stats.new_customers,
            value: formatNumber(stats.newCustomers),
            icon: Users,
            color: "plasma-pink"
        },
        {
            label: t.admin.dashboard.stats.growth,
            value: `${stats.growth >= 0 ? '+' : ''}${formatNumber(stats.growth, { maximumFractionDigits: 1 })}%`,
            icon: TrendingUp,
            color: "cyber-green"
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{t.admin.dashboard.title}</h1>
                    <p className="text-gray-400">{t.admin.dashboard.welcome}</p>
                </div>
                <div className="px-4 py-2 bg-[var(--color-neon-blue)]/10 border border-[var(--color-neon-blue)] rounded-lg text-[var(--color-neon-blue)] text-sm font-mono">
                    {t.admin.dashboard.system_online}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-[var(--color-neon-blue)]" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statsDisplay.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="glass p-6 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-lg bg-[var(--color-${stat.color})]/10 text-[var(--color-${stat.color})]`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        {stat.label === t.admin.dashboard.stats.growth && (
                                            <span className={`text-xs px-2 py-1 rounded ${stats.growth >= 0
                                                ? 'text-green-400 bg-green-400/10'
                                                : 'text-red-400 bg-red-400/10'
                                                }`}>
                                                {stat.value}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="glass p-6 rounded-xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6">{t.admin.dashboard.revenue_over_time}</h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-neon-blue)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--color-neon-blue)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid #333' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="var(--color-neon-blue)" fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6">{t.admin.dashboard.recent_orders}</h3>
                            <div className="space-y-4">
                                {recentOrders.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">{t.admin.dashboard.no_orders}</p>
                                ) : (
                                    recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[var(--color-quantum-purple)]/20 flex items-center justify-center text-[var(--color-quantum-purple)] font-bold">
                                                    {order.guest_email?.charAt(0).toUpperCase() || 'G'}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">{order.guest_email || t.admin.dashboard.labels.guest}</div>
                                                    <div className="text-xs text-gray-400">#{order.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[var(--color-neon-blue)] font-mono">{formatCurrency(order.total_amount)}</div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
}
