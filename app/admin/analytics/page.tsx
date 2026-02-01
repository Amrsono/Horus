"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, Package, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type TimePeriod = "today" | "month" | "year";

interface CustomerMetric {
    email: string;
    total_spent: number;
    order_count: number;
}

interface ProductMetric {
    product_id: string;
    product_name: string;
    units_sold: number;
    revenue: number;
}

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<TimePeriod>("month");
    const [isLoading, setIsLoading] = useState(true);
    const [topCustomers, setTopCustomers] = useState<CustomerMetric[]>([]);
    const [topProducts, setTopProducts] = useState<ProductMetric[]>([]);
    const [leastProducts, setLeastProducts] = useState<ProductMetric[]>([]);

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const getDateFilter = () => {
        const now = new Date();
        switch (period) {
            case "today":
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                return today.toISOString();
            case "month":
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                return monthStart.toISOString();
            case "year":
                const yearStart = new Date(now.getFullYear(), 0, 1);
                return yearStart.toISOString();
        }
    };

    const fetchAnalytics = async () => {
        setIsLoading(true);
        const dateFilter = getDateFilter();

        // Fetch top customers
        const { data: customerData } = await supabase
            .from('orders')
            .select('guest_email, total_amount')
            .gte('created_at', dateFilter)
            .order('created_at', { ascending: false });

        if (customerData) {
            const customerMap = new Map<string, { total: number; count: number }>();
            customerData.forEach(order => {
                const email = order.guest_email || 'Unknown';
                const existing = customerMap.get(email) || { total: 0, count: 0 };
                customerMap.set(email, {
                    total: existing.total + Number(order.total_amount),
                    count: existing.count + 1
                });
            });

            const customers = Array.from(customerMap.entries())
                .map(([email, data]) => ({
                    email,
                    total_spent: data.total,
                    order_count: data.count
                }))
                .sort((a, b) => b.total_spent - a.total_spent)
                .slice(0, 5);

            setTopCustomers(customers);
        }

        // Fetch product metrics
        const { data: orderItemsData } = await supabase
            .from('order_items')
            .select(`
                product_id,
                product_name,
                quantity,
                price_at_purchase,
                order_id,
                orders!inner(created_at)
            `)
            .gte('orders.created_at', dateFilter);

        if (orderItemsData) {
            const productMap = new Map<string, { name: string; units: number; revenue: number }>();

            orderItemsData.forEach((item: any) => {
                const id = item.product_id || 'unknown';
                const existing = productMap.get(id) || { name: item.product_name, units: 0, revenue: 0 };
                productMap.set(id, {
                    name: item.product_name,
                    units: existing.units + item.quantity,
                    revenue: existing.revenue + (item.quantity * Number(item.price_at_purchase))
                });
            });

            const products = Array.from(productMap.entries())
                .map(([id, data]) => ({
                    product_id: id,
                    product_name: data.name,
                    units_sold: data.units,
                    revenue: data.revenue
                }));

            setTopProducts(products.sort((a, b) => b.units_sold - a.units_sold).slice(0, 5));
            setLeastProducts(products.sort((a, b) => a.units_sold - b.units_sold).slice(0, 5));
        }

        setIsLoading(false);
    };

    const periodLabels = {
        today: "Today",
        month: "This Month",
        year: "This Year"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                    <p className="text-gray-400">Customer and product performance metrics</p>
                </div>

                {/* Period Selector */}
                <div className="flex gap-2 p-1 glass rounded-lg border border-white/10">
                    {(["today", "month", "year"] as TimePeriod[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${period === p
                                    ? "bg-[var(--color-neon-blue)] text-black"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {periodLabels[p]}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-[var(--color-neon-blue)]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Customers */}
                    <div className="glass p-6 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-lg bg-[var(--color-neon-blue)]/10">
                                <Users className="w-6 h-6 text-[var(--color-neon-blue)]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Top Customers</h3>
                                <p className="text-sm text-gray-400">Highest spending customers</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {topCustomers.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No customer data available</p>
                            ) : (
                                topCustomers.map((customer, index) => (
                                    <div
                                        key={customer.email}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-neon-blue)] to-[var(--color-quantum-purple)] flex items-center justify-center text-white font-bold text-sm">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">{customer.email}</div>
                                                <div className="text-xs text-gray-400">{customer.order_count} orders</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[var(--color-neon-blue)] font-mono font-bold">
                                                {customer.total_spent.toFixed(2)} EGP
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div className="glass p-6 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-lg bg-[var(--color-cyber-green)]/10">
                                <TrendingUp className="w-6 h-6 text-[var(--color-cyber-green)]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Top Selling Products</h3>
                                <p className="text-sm text-gray-400">Best performing products</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {topProducts.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No product data available</p>
                            ) : (
                                topProducts.map((product, index) => (
                                    <div
                                        key={product.product_id}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[var(--color-cyber-green)]/20 flex items-center justify-center text-[var(--color-cyber-green)] font-bold text-sm">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">{product.product_name}</div>
                                                <div className="text-xs text-gray-400">{product.units_sold} units sold</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[var(--color-cyber-green)] font-mono font-bold">
                                                {product.revenue.toFixed(2)} EGP
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Least Selling Products */}
                    <div className="glass p-6 rounded-xl border border-white/5 lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-lg bg-[var(--color-plasma-pink)]/10">
                                <TrendingDown className="w-6 h-6 text-[var(--color-plasma-pink)]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Least Selling Products</h3>
                                <p className="text-sm text-gray-400">Products needing attention</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {leastProducts.length === 0 ? (
                                <p className="text-gray-500 text-center py-8 col-span-full">No product data available</p>
                            ) : (
                                leastProducts.map((product, index) => (
                                    <div
                                        key={product.product_id}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[var(--color-plasma-pink)]/20 flex items-center justify-center text-[var(--color-plasma-pink)] font-bold text-sm">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium text-sm">{product.product_name}</div>
                                                <div className="text-xs text-gray-400">{product.units_sold} units</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
