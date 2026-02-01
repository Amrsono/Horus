"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreHorizontal, Eye, Truck, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const filteredOrders = orders.filter(
        (order) =>
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.guest_email && order.guest_email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
                    <p className="text-gray-400">Manage customer orders and shipments</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-neon-blue)]"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            <div className="glass rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 uppercase font-bold text-xs tracking-wider text-gray-300">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4 text-right">Actions</th>
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
                                        No orders found.
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
                                        <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={cn(
                                                    "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
                                                    `bg-[var(--color-${statusColors[order.status]})]/10 text-[var(--color-${statusColors[order.status]})]`
                                                )}
                                                style={order.status === "cancelled" ? { color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)" } : {}}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white font-mono">{Number(order.total_amount).toFixed(2)} EGP</td>
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
                    <span>Showing {filteredOrders.length} of {orders.length} orders</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-50">Previous</button>
                        <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10">Next</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
