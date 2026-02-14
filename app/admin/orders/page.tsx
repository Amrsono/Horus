"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreHorizontal, Eye, Truck, CheckCircle, XCircle, Loader2, ChevronDown, Download } from "lucide-react";
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

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [viewOrderOpen, setViewOrderOpen] = useState(false);
    const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

    const handleExportCSV = () => {
        const headers = ["Order ID", "Customer Email", "Total Amount", "Status", "Items", "Date"];
        const rows = orders.map(order => [
            order.id,
            order.guest_email || 'Guest',
            order.total_amount,
            order.status,
            order.item_count || 0,
            new Date(order.created_at).toISOString().split('T')[0]
        ].join(","));

        const csvContent = [
            headers.join(","),
            ...rows
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleViewOrder = async (order: Order) => {
        setSelectedOrder(order);
        setViewOrderOpen(true);
        setActiveActionMenu(null);

        // Fetch order items
        const { data, error } = await supabase
            .from('order_items')
            .select(`
                *,
                products (
                    name,
                    price,
                    image_url
                )
            `)
            .eq('order_id', order.id);

        if (error) {
            console.error("Error fetching order items:", error);
        } else {
            setOrderItems(data || []);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">{t.admin.orders.title}</h1>
                    <p className="text-[var(--text-muted)]">{t.admin.orders.subtitle}</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder={t.admin.orders.search_placeholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--color-neon-blue)]"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[var(--foreground)] hover:bg-white/10 transition-colors"
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
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/50 rounded-lg hover:bg-[var(--color-neon-blue)]/20 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
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

            <div className="glass rounded-xl border border-white/5 overflow-visible pb-32">
                <div className="overflow-x-visible">
                    <table className="w-full text-left text-sm text-[var(--text-muted)]">
                        <thead className="bg-white/5 uppercase font-bold text-xs tracking-wider text-[var(--foreground)]">
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
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                                        <td className="px-6 py-4 text-[var(--foreground)] font-mono">#{order.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-[var(--foreground)] border border-white/10">
                                                    {order.guest_email?.charAt(0).toUpperCase() || 'G'}
                                                </div>
                                                <span className="text-[var(--foreground)]">{order.guest_email || 'Guest'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[var(--text-muted)]">{new Date(order.created_at).toLocaleDateString(locale)}</td>
                                        <td className="px-6 py-4">
                                            {editingOrderId === order.id ? (
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    onBlur={() => setEditingOrderId(null)}
                                                    autoFocus
                                                    className="bg-black/40 border border-[var(--color-neon-blue)] rounded px-2 py-1 text-xs text-[var(--foreground)] focus:outline-none"
                                                >
                                                    {statusOptions.map((status) => (
                                                        <option key={status.value} value={status.value} className="bg-black">
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
                                        <td className="px-6 py-4 text-[var(--foreground)] font-mono">{formatCurrency(order.total_amount)}</td>
                                        <td className="px-6 py-4 text-right relative">
                                            <div className="flex justify-end order-action-container">
                                                <button
                                                    onClick={() => setActiveActionMenu(activeActionMenu === order.id ? null : order.id)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--foreground)]"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>

                                                {activeActionMenu === order.id && (
                                                    <div className="absolute right-8 top-8 w-48 bg-[#0a0a0f] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => handleViewOrder(order)}
                                                                className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                {t.admin.orders.table.view}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingOrderId(order.id);
                                                                    setActiveActionMenu(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                                                            >
                                                                <Truck className="w-4 h-4" />
                                                                Update Status
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
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

            {/* View Order Modal */}
            {viewOrderOpen && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0f1115] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Order #{selectedOrder.id.slice(0, 8)}</h2>
                                <p className="text-sm text-gray-400">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => setViewOrderOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <XCircle className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            {/* Order Status & Customer */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Customer</p>
                                    <p className="text-white font-medium">{selectedOrder.guest_email || 'Guest User'}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Order Status</p>
                                    <span className={cn(
                                        "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
                                        `bg-[var(--color-${statusColors[selectedOrder.status]})]/10 text-[var(--color-${statusColors[selectedOrder.status]})]`
                                    )}
                                        style={selectedOrder.status === "cancelled" ? { color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)" } : {}}
                                    >
                                        {statusOptions.find(s => s.value === selectedOrder.status)?.label || selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-300 uppercase mb-4">Ordered Items</h3>
                                <div className="space-y-3">
                                    {orderItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                                            {item.products?.image_url ? (
                                                <img
                                                    src={item.products.image_url}
                                                    alt={item.products.name}
                                                    className="w-12 h-12 object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center">
                                                    <span className="text-xs text-gray-500">No img</span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-white">{item.products?.name || 'Unknown Product'}</h4>
                                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-mono text-[var(--color-neon-blue)]">
                                                    {formatCurrency(item.unit_price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="flex justify-end pt-4 border-t border-white/10">
                                <div className="text-right">
                                    <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                                    <p className="text-2xl font-bold text-[var(--color-neon-blue)] font-mono">
                                        {formatCurrency(selectedOrder.total_amount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
