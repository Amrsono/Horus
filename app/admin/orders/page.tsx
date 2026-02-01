"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreHorizontal, Eye, Truck, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const orders = [
    { id: "ORD-2077-001", customer: "John Doe", date: "2070-05-12", total: "$129.99", status: "Delivered", items: 3 },
    { id: "ORD-2077-002", customer: "Jane Smith", date: "2070-05-12", total: "$49.99", status: "Processing", items: 1 },
    { id: "ORD-2077-003", customer: "Alex Ray", date: "2070-05-11", total: "$24.99", status: "Shipped", items: 2 },
    { id: "ORD-2077-004", customer: "Sarah Connor", date: "2070-05-10", total: "$399.99", status: "Cancelled", items: 5 },
    { id: "ORD-2077-005", customer: "Kyle Reese", date: "2070-05-09", total: "$89.99", status: "Delivered", items: 2 },
];

const statusColors: Record<string, string> = {
    Delivered: "cyber-green",
    Processing: "solar-yellow",
    Shipped: "neon-blue",
    Cancelled: "red-500",
};

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredOrders = orders.filter(
        (order) =>
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase())
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
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-white font-mono">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                                                {order.customer.charAt(0)}
                                            </div>
                                            <span className="text-white">{order.customer}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={cn(
                                                "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
                                                `bg-[var(--color-${statusColors[order.status]})]/10 text-[var(--color-${statusColors[order.status]})]`
                                            )}
                                            style={order.status === "Cancelled" ? { color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)" } : {}}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-white font-mono">{order.total}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
