"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreHorizontal, Eye, Truck, CheckCircle, XCircle, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

interface Order {
    id: string;
    guest_email: string;
    total_amount: number;
    status: string;
    created_at: string;
    item_count?: number;
}

const statusColors: Record<string, string> = {
    delivered: "cyber-green",
    processing: "solar-yellow",
    shipped: "neon-blue",
    cancelled: "red-500",
    pending: "plasma-pink",
};



export default function OrdersPage() {
    const { t, locale, formatCurrency } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const statusOptions = [
        { value: "pending", label: t.admin.orders.status.pending },
        { value: "processing", label: t.admin.orders.status.processing },
        { value: "shipped", label: t.admin.orders.status.shipped },
        { value: "delivered", label: t.admin.orders.status.delivered },
        { value: "cancelled", label: t.admin.orders.status.cancelled },
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);

        const { data: ordersData, error } = await supabase
            .from('orders')
            .select(`
                id,
                guest_email,
                total_amount,
                status,
                created_at
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
        } else if (ordersData) {
            // Fetch item counts for each order
            const ordersWithCounts = await Promise.all(
                ordersData.map(async (order) => {
                    const { count } = await supabase
                        .from('order_items')
                        .select('*', { count: 'exact', head: true })
                        .eq('order_id', order.id);

                    return {
                        ...order,
                        item_count: count || 0
                    };
                })
            );

            setOrders(ordersWithCounts);
        }

        setIsLoading(false);
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', orderId);

        if (error) {
            console.error("Error updating order status:", error);
            alert("Failed to update order status");
        } else {
            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
            setEditingOrderId(null);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.guest_email && order.guest_email.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusCount = (status: string) => {
        if (status === "all") return orders.length;
        return orders.filter(order => order.status === status).length;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{t.admin.orders.title}</h1>
                    <p className="text-gray-400">{t.admin.orders.subtitle}</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t.admin.orders.search_placeholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-neon-blue)]"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {showFilterDropdown && (
                            <div className="absolute right-0 mt-2 w-56 glass rounded-lg border border-white/10 shadow-xl z-50">
                                <div className="p-2">
                                    <button
                                        onClick={() => {
                                            setStatusFilter("all");
                                            setShowFilterDropdown(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
                                            statusFilter === "all"
                                                ? "bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)]"
                                                : "text-gray-300 hover:bg-white/5"
                                        )}
                                    >
                                        <span>{t.admin.orders.status.all}</span>
                                        <span className="text-xs opacity-60">{getStatusCount("all")}</span>
                                    </button>
                                    {statusOptions.map((status) => (
                                        <button
                                            key={status.value}
                                            onClick={() => {
                                                setStatusFilter(status.value);
                                                setShowFilterDropdown(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
                                                statusFilter === status.value
                                                    ? "bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)]"
                                                    : "text-gray-300 hover:bg-white/5"
                                            )}
                                        >
                                            <span>{status.label}</span>
                                            <span className="text-xs opacity-60">{getStatusCount(status.value)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Filter Badge */}
            {statusFilter !== "all" && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Active filter:</span>
                    <span className="px-3 py-1 bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] rounded-full text-xs font-medium border border-[var(--color-neon-blue)]/20">
                        {statusOptions.find(s => s.value === statusFilter)?.label}
                    </span>
                    <button
                        onClick={() => setStatusFilter("all")}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                        {t.admin.orders.clear}
                    </button>
                </div>
            )}

            <div className="glass rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 uppercase font-bold text-xs tracking-wider text-gray-300">
                            <tr>
                                <th className="px-6 py-4">{t.admin.orders.table.order_id}</th>
                                <th className="px-6 py-4">{t.admin.orders.table.customer}</th>
                                <th className="px-6 py-4">{t.admin.orders.table.date}</th>
                                <th className="px-6 py-4">{t.admin.orders.table.status}</th>
                                <th className="px-6 py-4">{t.admin.orders.table.total}</th>
                                <th className="px-6 py-4 text-right">{t.admin.orders.table.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--color-neon-blue)]" />
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        {t.admin.orders.table.no_orders}
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-white font-mono">#{order.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                                                    {order.guest_email?.charAt(0).toUpperCase() || 'G'}
                                                </div>
                                                <span className="text-white">{order.guest_email || 'Guest'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString(locale)}</td>
                                        <td className="px-6 py-4">
                                            {editingOrderId === order.id ? (
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    onBlur={() => setEditingOrderId(null)}
                                                    autoFocus
                                                    className="bg-black/40 border border-[var(--color-neon-blue)] rounded px-2 py-1 text-xs text-white focus:outline-none"
                                                >
                                                    {statusOptions.map((status) => (
                                                        <option key={status.value} value={status.value}>
                                                            {status.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <button
                                                    onClick={() => setEditingOrderId(order.id)}
                                                    className={cn(
                                                        "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider hover:opacity-80 transition-opacity",
                                                        `bg-[var(--color-${statusColors[order.status]})]/10 text-[var(--color-${statusColors[order.status]})]`
                                                    )}
                                                    style={order.status === "cancelled" ? { color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)" } : {}}
                                                >
                                                    {statusOptions.find(s => s.value === order.status)?.label || order.status}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-white font-mono">{formatCurrency(order.total_amount)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                    <span>{t.admin.orders.table.showing} {filteredOrders.length} {t.admin.orders.table.of} {orders.length} {t.admin.orders.table.orders}</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-50">{t.admin.orders.table.previous}</button>
                        <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10">{t.admin.orders.table.next}</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
