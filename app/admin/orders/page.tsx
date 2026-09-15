"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Filter, MoreHorizontal, Eye, Truck, CheckCircle,
    XCircle, Loader2, ChevronDown, X, Package, MapPin, Phone,
    Mail, Clock, ChevronRight, AlertTriangle, Download, Copy, Check,
    RefreshCw, PrinterIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import * as XLSX from "xlsx";

interface Order {
    id: string;
    guest_email: string;
    total_amount: number;
    status: string;
    created_at: string;
    item_count?: number;
    shipping_address?: {
        full_name?: string;
        phone?: string;
        city?: string;
        address?: string;
    };
}

interface OrderItem {
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
}

const STATUS_STYLES: Record<string, { text: string; bg: string; border: string }> = {
    pending:    { text: "text-pink-400",    bg: "bg-pink-400/10",    border: "border-pink-400/30" },
    processing: { text: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/30" },
    shipped:    { text: "text-cyan-400",    bg: "bg-cyan-400/10",    border: "border-cyan-400/30" },
    delivered:  { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" },
    cancelled:  { text: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/30" },
};

export default function OrdersPage() {
    const { t, locale, formatCurrency } = useLanguage();
    const [searchTerm, setSearchTerm]       = useState("");
    const [statusFilter, setStatusFilter]   = useState<string>("all");
    const [orders, setOrders]               = useState<Order[]>([]);
    const [isLoading, setIsLoading]         = useState(true);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    // Detail panel
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems]       = useState<OrderItem[]>([]);
    const [loadingItems, setLoadingItems]   = useState(false);
    const [itemsCache, setItemsCache]       = useState<Record<string, OrderItem[]>>({});

    // Actions dropdown
    const [openMenuId, setOpenMenuId]       = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Status editing (inline in panel)
    const [editingStatus, setEditingStatus] = useState(false);
    const [savingStatus, setSavingStatus]   = useState(false);

    // Toast
    const [toast, setToast]                 = useState<{ msg: string; type: "success" | "error" } | null>(null);

    // Copy feedback
    const [copied, setCopied]               = useState<string | null>(null);

    // Delete confirm
    const [deleteTarget, setDeleteTarget]   = useState<string | null>(null);

    const statusOptions = [
        { value: "pending",    label: t.admin.orders.status.pending },
        { value: "processing", label: t.admin.orders.status.processing },
        { value: "shipped",    label: t.admin.orders.status.shipped },
        { value: "delivered",  label: t.admin.orders.status.delivered },
        { value: "cancelled",  label: t.admin.orders.status.cancelled },
    ];

    useEffect(() => { fetchOrders(); }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilterDropdown(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("orders")
            .select("id, guest_email, total_amount, status, created_at, shipping_address")
            .order("created_at", { ascending: false });

        if (error) { console.error(error); setIsLoading(false); return; }

        const withCounts = await Promise.all(
            (data || []).map(async (order) => {
                const { count } = await supabase
                    .from("order_items")
                    .select("*", { count: "exact", head: true })
                    .eq("order_id", order.id);
                return { ...order, item_count: count || 0 };
            })
        );
        setOrders(withCounts);
        setIsLoading(false);
    };

    const fetchOrderItems = useCallback(async (orderId: string) => {
        if (itemsCache[orderId]) { setOrderItems(itemsCache[orderId]); return; }
        setLoadingItems(true);
        const { data, error } = await supabase
            .from("order_items")
            .select("id, product_name, quantity, unit_price")
            .eq("order_id", orderId);

        if (error) { console.error(error); setLoadingItems(false); return; }
        setItemsCache(prev => ({ ...prev, [orderId]: data || [] }));
        setOrderItems(data || []);
        setLoadingItems(false);
    }, [itemsCache]);

    const openDetail = (order: Order) => {
        setSelectedOrder(order);
        setOpenMenuId(null);
        setEditingStatus(false);
        fetchOrderItems(order.id);
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        setSavingStatus(true);
        const { error } = await supabase
            .from("orders")
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq("id", orderId);

        setSavingStatus(false);
        if (error) { showToast("Failed to update status", "error"); return; }

        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        setEditingStatus(false);
        showToast("Order status updated");
    };

    const handleCopy = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleExportOrder = (order: Order) => {
        const items = itemsCache[order.id] || [];
        const wb = XLSX.utils.book_new();

        // Sheet 1 – Summary
        const summary = [
            ["Field", "Value"],
            ["Order ID", order.id],
            ["Customer", order.guest_email],
            ["Date", new Date(order.created_at).toLocaleString()],
            ["Status", order.status],
            ["Total (EGP)", order.total_amount],
            ["Name", order.shipping_address?.full_name || ""],
            ["Phone", order.shipping_address?.phone || ""],
            ["City", order.shipping_address?.city || ""],
            ["Address", order.shipping_address?.address || ""],
        ];
        const s1 = XLSX.utils.aoa_to_sheet(summary);
        s1["!cols"] = [{ wch: 18 }, { wch: 42 }];
        XLSX.utils.book_append_sheet(wb, s1, "Order Summary");

        // Sheet 2 – Items
        const itemRows: (string | number)[][] = [["Product", "Qty", "Unit Price", "Subtotal"]];
        items.forEach(i => itemRows.push([i.product_name, i.quantity, i.unit_price, i.unit_price * i.quantity]));
        const s2 = XLSX.utils.aoa_to_sheet(itemRows);
        s2["!cols"] = [{ wch: 36 }, { wch: 6 }, { wch: 14 }, { wch: 14 }];
        XLSX.utils.book_append_sheet(wb, s2, "Items");

        XLSX.writeFile(wb, `order_${order.id.slice(0, 8)}.xlsx`);
        setOpenMenuId(null);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            setOrders(prev => prev.filter(o => o.id !== deleteTarget));
            if (selectedOrder?.id === deleteTarget) setSelectedOrder(null);
        }
        setDeleteTarget(null);
        showToast("Order removed from view");
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.guest_email && order.guest_email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusCount = (status: string) =>
        status === "all" ? orders.length : orders.filter(o => o.status === status).length;

    const StatusBadge = ({ status, size = "sm" }: { status: string; size?: "sm" | "md" }) => {
        const s = STATUS_STYLES[status] || { text: "text-gray-400", bg: "bg-white/5", border: "border-white/10" };
        return (
            <span className={cn(
                "inline-flex items-center font-bold uppercase tracking-wider rounded-md border",
                s.text, s.bg, s.border,
                size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"
            )}>
                {statusOptions.find(o => o.value === status)?.label || status}
            </span>
        );
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{t.admin.orders.title}</h1>
                    <p className="text-gray-400">{t.admin.orders.subtitle}</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
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
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", showFilterDropdown && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                            {showFilterDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="absolute right-0 mt-2 w-56 glass rounded-xl border border-white/10 shadow-xl z-50 p-2"
                                >
                                    {[{ value: "all", label: t.admin.orders.status.all }, ...statusOptions].map(s => (
                                        <button
                                            key={s.value}
                                            onClick={() => { setStatusFilter(s.value); setShowFilterDropdown(false); }}
                                            className={cn(
                                                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
                                                statusFilter === s.value
                                                    ? "bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)]"
                                                    : "text-gray-300 hover:bg-white/5"
                                            )}
                                        >
                                            <span>{s.label}</span>
                                            <span className="text-xs opacity-60">{getStatusCount(s.value)}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Active Filter */}
            {statusFilter !== "all" && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{t.admin.orders.active_filter}:</span>
                    <span className="px-3 py-1 bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] rounded-full text-xs font-medium border border-[var(--color-neon-blue)]/20">
                        {statusOptions.find(s => s.value === statusFilter)?.label}
                    </span>
                    <button onClick={() => setStatusFilter("all")} className="text-xs text-gray-400 hover:text-white transition-colors">
                        {t.admin.orders.clear}
                    </button>
                </div>
            )}

            {/* Table */}
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
                                    <td colSpan={6} className="text-center py-8 text-gray-500">{t.admin.orders.table.no_orders}</td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const s = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                                    return (
                                        <tr
                                            key={order.id}
                                            onClick={() => openDetail(order)}
                                            className={cn(
                                                "hover:bg-white/5 transition-colors cursor-pointer",
                                                selectedOrder?.id === order.id && "bg-white/5 border-l-2 border-[var(--color-neon-blue)]"
                                            )}
                                        >
                                            <td className="px-6 py-4 text-white font-mono" onClick={e => e.stopPropagation()}>
                                                #{order.id.slice(0, 8)}
                                            </td>
                                            <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                        {order.guest_email?.charAt(0).toUpperCase() || "G"}
                                                    </div>
                                                    <span className="text-white truncate max-w-[140px]">{order.guest_email || "Guest"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                                {new Date(order.created_at).toLocaleDateString(locale)}
                                            </td>
                                            <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-6 py-4 text-white font-mono" onClick={e => e.stopPropagation()}>
                                                {formatCurrency(order.total_amount)}
                                            </td>
                                            <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center justify-end" ref={openMenuId === order.id ? menuRef : null}>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                                        >
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                        <AnimatePresence>
                                                            {openMenuId === order.id && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                                                    transition={{ duration: 0.12 }}
                                                                    className="absolute right-0 top-full mt-1 w-52 glass border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                                >
                                                                    <button
                                                                        onClick={() => openDetail(order)}
                                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                                                                    >
                                                                        <Eye className="w-4 h-4 text-[var(--color-neon-blue)]" />
                                                                        {t.admin.orders.table.view_details}
                                                                    </button>

                                                                    <div className="px-2 pb-1">
                                                                        <p className="text-xs text-gray-500 px-2 pt-2 pb-1 uppercase tracking-wider">Change Status</p>
                                                                        {statusOptions.map(s => (
                                                                            <button
                                                                                key={s.value}
                                                                                onClick={() => { updateStatus(order.id, s.value); setOpenMenuId(null); }}
                                                                                className={cn(
                                                                                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors text-left",
                                                                                    order.status === s.value
                                                                                        ? "bg-white/10 text-white font-semibold"
                                                                                        : "text-gray-300 hover:bg-white/5"
                                                                                )}
                                                                            >
                                                                                <span className={cn("w-2 h-2 rounded-full", STATUS_STYLES[s.value]?.bg.replace("bg-", "bg-").replace("/10", ""))} />
                                                                                {s.label}
                                                                                {order.status === s.value && <Check className="w-3 h-3 ml-auto text-emerald-400" />}
                                                                            </button>
                                                                        ))}
                                                                    </div>

                                                                    <div className="border-t border-white/5" />

                                                                    <button
                                                                        onClick={() => { handleExportOrder(order); if (!itemsCache[order.id]) fetchOrderItems(order.id); }}
                                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                                                                    >
                                                                        <Download className="w-4 h-4 text-amber-400" />
                                                                        Export as Excel
                                                                    </button>

                                                                    <button
                                                                        onClick={() => { handleCopy(order.id, `copy-${order.id}`); setOpenMenuId(null); }}
                                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                                                                    >
                                                                        {copied === `copy-${order.id}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                                                        Copy Order ID
                                                                    </button>

                                                                    <div className="border-t border-white/5" />

                                                                    <button
                                                                        onClick={() => { setDeleteTarget(order.id); setOpenMenuId(null); }}
                                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                                                                    >
                                                                        <XCircle className="w-4 h-4" />
                                                                        Remove from View
                                                                    </button>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                    <span>{t.admin.orders.table.showing} {filteredOrders.length} {t.admin.orders.table.of} {orders.length} {t.admin.orders.table.orders}</span>
                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* ─── Order Detail Side Panel ─── */}
            <AnimatePresence>
                {selectedOrder && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            onClick={() => setSelectedOrder(null)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 h-full w-full max-w-xl bg-[var(--background)] border-l border-white/10 shadow-2xl z-50 flex flex-col"
                        >
                            {/* Panel Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <Package className="w-5 h-5 text-[var(--color-neon-blue)]" />
                                        <h2 className="text-white font-bold text-lg">Order #{selectedOrder.id.slice(0, 8).toUpperCase()}</h2>
                                        <StatusBadge status={selectedOrder.status} size="md" />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {new Date(selectedOrder.created_at).toLocaleString(locale, {
                                            year: "numeric", month: "long", day: "numeric",
                                            hour: "2-digit", minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Quick Actions Bar */}
                            <div className="flex gap-2 px-6 py-3 border-b border-white/10 shrink-0 flex-wrap">
                                <button
                                    onClick={() => setEditingStatus(!editingStatus)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-neon-blue)]/10 border border-[var(--color-neon-blue)]/30 text-[var(--color-neon-blue)] hover:bg-[var(--color-neon-blue)]/20 transition-colors text-xs"
                                >
                                    <Truck className="w-3.5 h-3.5" />
                                    Update Status
                                </button>
                                <button
                                    onClick={() => handleExportOrder(selectedOrder)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 hover:bg-amber-400/20 transition-colors text-xs"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Export Excel
                                </button>
                                <button
                                    onClick={() => handleCopy(selectedOrder.id, "panel-id")}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-xs"
                                >
                                    {copied === "panel-id" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied === "panel-id" ? "Copied!" : "Copy ID"}
                                </button>
                                <button
                                    onClick={() => { setDeleteTarget(selectedOrder.id); setSelectedOrder(null); }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-xs ml-auto"
                                >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Remove
                                </button>
                            </div>

                            {/* Status Editor */}
                            <AnimatePresence>
                                {editingStatus && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-b border-white/10 shrink-0 overflow-hidden"
                                    >
                                        <div className="px-6 py-4">
                                            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Select new status</p>
                                            <div className="flex flex-wrap gap-2">
                                                {statusOptions.map(s => {
                                                    const st = STATUS_STYLES[s.value];
                                                    return (
                                                        <button
                                                            key={s.value}
                                                            onClick={() => updateStatus(selectedOrder.id, s.value)}
                                                            disabled={savingStatus}
                                                            className={cn(
                                                                "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all",
                                                                selectedOrder.status === s.value
                                                                    ? `${st.text} ${st.bg} ${st.border} ring-1 ring-current`
                                                                    : "text-gray-400 bg-white/5 border-white/10 hover:bg-white/10"
                                                            )}
                                                        >
                                                            {savingStatus && selectedOrder.status === s.value
                                                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                                                : <CheckCircle className="w-3 h-3" />}
                                                            {s.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                                {/* Customer & Shipping */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer & Delivery</h3>
                                    <div className="glass border border-white/5 rounded-xl divide-y divide-white/5">
                                        <div className="flex items-center gap-3 px-4 py-3">
                                            <Mail className="w-4 h-4 text-[var(--color-neon-blue)] shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-white text-sm truncate">{selectedOrder.guest_email || "—"}</p>
                                            </div>
                                            <button onClick={() => handleCopy(selectedOrder.guest_email, "email")} className="text-gray-500 hover:text-white transition-colors shrink-0">
                                                {copied === "email" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                        {selectedOrder.shipping_address?.phone && (
                                            <div className="flex items-center gap-3 px-4 py-3">
                                                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500">Phone</p>
                                                    <p className="text-white text-sm">{selectedOrder.shipping_address.phone}</p>
                                                </div>
                                                <a href={`https://wa.me/${selectedOrder.shipping_address.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                                                    className="text-xs px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors">
                                                    WhatsApp
                                                </a>
                                            </div>
                                        )}
                                        {(selectedOrder.shipping_address?.city || selectedOrder.shipping_address?.address) && (
                                            <div className="flex items-start gap-3 px-4 py-3">
                                                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Delivery Address</p>
                                                    <p className="text-white text-sm">{[selectedOrder.shipping_address?.address, selectedOrder.shipping_address?.city].filter(Boolean).join(", ")}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        Items
                                        {!loadingItems && <span className="bg-white/10 px-2 py-0.5 rounded-full text-white text-xs">{orderItems.length}</span>}
                                    </h3>
                                    {loadingItems ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="w-6 h-6 animate-spin text-[var(--color-neon-blue)]" />
                                        </div>
                                    ) : orderItems.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No items found.</p>
                                    ) : (
                                        <div className="glass border border-white/5 rounded-xl divide-y divide-white/5">
                                            {orderItems.map((item, idx) => (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0, x: 8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.04 }}
                                                    className="flex items-center gap-3 px-4 py-3"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-[var(--color-neon-blue)]/10 border border-[var(--color-neon-blue)]/20 flex items-center justify-center shrink-0">
                                                        <Package className="w-4 h-4 text-[var(--color-neon-blue)]" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white text-sm font-medium truncate">{item.product_name}</p>
                                                        <p className="text-xs text-gray-500">× {item.quantity} @ {formatCurrency(item.unit_price)}</p>
                                                    </div>
                                                    <span className="text-white font-mono font-bold text-sm shrink-0">
                                                        {formatCurrency(item.unit_price * item.quantity)}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Order Total */}
                                <div className="glass border border-white/5 rounded-xl px-4 py-4 flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Order Total</span>
                                    <span className="text-[var(--color-plasma-pink)] font-bold text-xl font-mono">
                                        {formatCurrency(selectedOrder.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─── Delete Confirm Dialog ─── */}
            <AnimatePresence>
                {deleteTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-[60] bg-black/70 backdrop-blur-sm px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 16 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 16 }}
                            className="glass border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                </div>
                                <h3 className="text-white font-bold text-lg">Remove Order?</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">
                                Order <span className="text-white font-mono">#{deleteTarget?.slice(0, 8).toUpperCase()}</span> will be removed from the local view.
                            </p>
                            <p className="text-xs text-gray-500 mb-6">The record remains in the database — this only hides it from your current session.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors text-sm">Cancel</button>
                                <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium">Remove</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Toast ─── */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 24 }}
                        className={cn(
                            "fixed bottom-6 right-6 z-[70] flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl text-sm font-medium",
                            toast.type === "success"
                                ? "glass border-emerald-500/30 text-emerald-400"
                                : "glass border-red-500/30 text-red-400"
                        )}
                    >
                        {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
