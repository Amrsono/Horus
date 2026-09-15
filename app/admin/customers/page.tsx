
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Filter, MoreHorizontal, Mail, ExternalLink, Shield,
    Loader2, X, ShoppingBag, TrendingUp, Clock, Download,
    Trash2, ChevronRight, AlertTriangle, Copy, Check, Package
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

interface Customer {
    email: string;
    totalOrders: number;
    totalSpent: number;
    lastActive: string;
}

interface CustomerOrder {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    item_count?: number;
    items?: OrderItem[];
}

interface OrderItem {
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
}

const statusColors: Record<string, string> = {
    delivered:  "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    processing: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    shipped:    "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
    cancelled:  "text-red-400 bg-red-400/10 border-red-400/30",
    pending:    "text-pink-400 bg-pink-400/10 border-pink-400/30",
};

export default function CustomersPage() {
    const { t, locale, formatCurrency } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Side panel state
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [ordersCache, setOrdersCache] = useState<Record<string, CustomerOrder[]>>({});

    // More options dropdown
    const [openMenuEmail, setOpenMenuEmail] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Copy feedback
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenuEmail(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const fetchCustomers = async () => {
        setIsLoading(true);

        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
        const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('guest_email, total_amount, created_at');

        if (usersError) console.error("Error fetching users:", usersError);
        if (ordersError) console.error("Error fetching orders:", ordersError);

        const customerMap = new Map<string, { orders: number; spent: number; lastActive: string }>();

        if (users) {
            users.forEach(user => {
                if (user.email) {
                    customerMap.set(user.email, {
                        orders: 0,
                        spent: 0,
                        lastActive: user.created_at || new Date().toISOString()
                    });
                }
            });
        }

        if (ordersData) {
            ordersData.forEach(order => {
                const email = order.guest_email || 'Unknown';
                const existing = customerMap.get(email) || { orders: 0, spent: 0, lastActive: order.created_at };
                customerMap.set(email, {
                    orders: existing.orders + 1,
                    spent: existing.spent + Number(order.total_amount),
                    lastActive: new Date(order.created_at) > new Date(existing.lastActive)
                        ? order.created_at
                        : existing.lastActive
                });
            });
        }

        const customersArray = Array.from(customerMap.entries()).map(([email, data]) => ({
            email,
            totalOrders: data.orders,
            totalSpent: data.spent,
            lastActive: data.lastActive
        })).sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());

        setCustomers(customersArray);
        setIsLoading(false);
    };

    const fetchCustomerOrders = useCallback(async (email: string) => {
        if (ordersCache[email]) {
            setCustomerOrders(ordersCache[email]);
            return;
        }
        setLoadingOrders(true);
        const { data, error } = await supabase
            .from('orders')
            .select('id, total_amount, status, created_at')
            .eq('guest_email', email)
            .order('created_at', { ascending: false });

        if (error) { console.error(error); setLoadingOrders(false); return; }

        const ordersWithItems = await Promise.all(
            (data || []).map(async (order) => {
                const { data: items } = await supabase
                    .from('order_items')
                    .select('id, product_name, quantity, unit_price')
                    .eq('order_id', order.id);
                return { ...order, items: items || [], item_count: items?.length || 0 };
            })
        );

        setOrdersCache(prev => ({ ...prev, [email]: ordersWithItems }));
        setCustomerOrders(ordersWithItems);
        setLoadingOrders(false);
    }, [ordersCache]);

    const openDetails = (customer: Customer) => {
        setSelectedCustomer(customer);
        setOpenMenuEmail(null);
        fetchCustomerOrders(customer.email);
    };

    const handleCopyEmail = async (email: string) => {
        await navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 2000);
    };

    const handleExport = (customer: Customer) => {
        const orders = ordersCache[customer.email] || [];

        const wb = XLSX.utils.book_new();

        // ── Sheet 1: Customer Summary ──────────────────────────────────
        const summaryData = [
            ["Field", "Value"],
            ["Email", customer.email],
            ["Total Orders", customer.totalOrders],
            ["Lifetime Value (EGP)", customer.totalSpent],
            ["Avg. Order Value (EGP)", customer.totalOrders > 0 ? (customer.totalSpent / customer.totalOrders).toFixed(2) : 0],
            ["Last Active", new Date(customer.lastActive).toLocaleString()],
            ["Exported At", new Date().toLocaleString()],
        ];
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        summarySheet["!cols"] = [{ wch: 24 }, { wch: 36 }];
        XLSX.utils.book_append_sheet(wb, summarySheet, "Customer Summary");

        // ── Sheet 2: Order History ─────────────────────────────────────
        const orderRows: (string | number)[][] = [
            ["Order ID", "Date", "Status", "Total (EGP)", "Items", "Products"],
        ];
        orders.forEach(order => {
            const productNames = (order.items || [])
                .map(i => `${i.product_name} ×${i.quantity}`)
                .join(", ");
            orderRows.push([
                order.id,
                new Date(order.created_at).toLocaleString(),
                order.status,
                order.total_amount,
                order.item_count ?? (order.items?.length ?? 0),
                productNames,
            ]);
        });
        const ordersSheet = XLSX.utils.aoa_to_sheet(orderRows);
        ordersSheet["!cols"] = [
            { wch: 38 }, { wch: 22 }, { wch: 14 },
            { wch: 14 }, { wch: 8 }, { wch: 50 },
        ];
        XLSX.utils.book_append_sheet(wb, ordersSheet, "Order History");

        const fileName = `customer_${customer.email.replace("@", "_at_").replace(/\./g, "_")}.xlsx`;
        XLSX.writeFile(wb, fileName);
        setOpenMenuEmail(null);
    };

    const handleDelete = (email: string) => {
        setDeleteTarget(email);
        setOpenMenuEmail(null);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            setCustomers(prev => prev.filter(c => c.email !== deleteTarget));
            if (selectedCustomer?.email === deleteTarget) setSelectedCustomer(null);
        }
        setDeleteTarget(null);
    };

    const filteredCustomers = customers.filter(c =>
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const avgOrderValue = (customer: Customer) =>
        customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">{t.admin.customers.title}</h1>
                    <p className="text-gray-400">{t.admin.customers.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/50 rounded-lg hover:bg-[var(--color-neon-blue)]/20 transition-colors text-sm">
                        {t.admin.customers.export_csv}
                    </button>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 p-4 glass rounded-xl border border-white/5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t.admin.customers.search_placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    <Filter className="w-4 h-4" />
                    {t.admin.customers.filters}
                </button>
            </div>

            {/* Table */}
            <div className="glass rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-bold tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4">{t.admin.customers.table.customer}</th>
                                <th className="px-6 py-4">{t.admin.customers.table.orders}</th>
                                <th className="px-6 py-4">{t.admin.customers.table.total_spent}</th>
                                <th className="px-6 py-4">{t.admin.customers.table.last_active}</th>
                                <th className="px-6 py-4 text-right">{t.admin.customers.table.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--color-neon-blue)]" />
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr key="no-customers">
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        {t.admin.customers.table.no_customers}
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.email}
                                        className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedCustomer?.email === customer.email ? "bg-white/5 border-l-2 border-[var(--color-neon-blue)]" : ""}`}
                                        onClick={() => openDetails(customer)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-neon-blue)] to-[var(--color-quantum-purple)] flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                    {customer.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">{customer.email}</div>
                                                    <div className="text-xs flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {t.admin.customers.role.customer}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                            <div className="text-white font-mono">{customer.totalOrders}</div>
                                            <div className="text-xs">{t.admin.customers.table.orders}</div>
                                        </td>
                                        <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                            <div className="text-[var(--color-plasma-pink)] font-mono font-bold">
                                                {formatCurrency(customer.totalSpent)}
                                            </div>
                                            <div className="text-xs">Lifetime Value</div>
                                        </td>
                                        <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                            <div>{new Date(customer.lastActive).toLocaleDateString(locale)}</div>
                                            <div className="text-xs">{new Date(customer.lastActive).toLocaleTimeString(locale)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-1" ref={openMenuEmail === customer.email ? menuRef : null}>
                                                {/* View Details */}
                                                <button
                                                    onClick={() => openDetails(customer)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-[var(--color-neon-blue)]"
                                                    title={t.admin.customers.table.view_details}
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>

                                                {/* More Options */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenMenuEmail(openMenuEmail === customer.email ? null : customer.email)}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                                        title="More Options"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>

                                                    <AnimatePresence>
                                                        {openMenuEmail === customer.email && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                                                transition={{ duration: 0.12 }}
                                                                className="absolute right-0 top-full mt-1 w-52 glass border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                            >
                                                                <button
                                                                    onClick={() => openDetails(customer)}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                                                                >
                                                                    <ExternalLink className="w-4 h-4 text-[var(--color-neon-blue)]" />
                                                                    {t.admin.customers.table.view_details}
                                                                </button>
                                                                <button
                                                                    onClick={() => { window.open(`mailto:${customer.email}`, "_blank"); setOpenMenuEmail(null); }}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                                                                >
                                                                    <Mail className="w-4 h-4 text-emerald-400" />
                                                                    Send Email
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCopyEmail(customer.email)}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                                                                >
                                                                    {copiedEmail === customer.email
                                                                        ? <Check className="w-4 h-4 text-emerald-400" />
                                                                        : <Copy className="w-4 h-4 text-gray-400" />}
                                                                    {copiedEmail === customer.email ? "Copied!" : "Copy Email"}
                                                                </button>
                                                                <button
                                                                    onClick={() => { handleExport(customer); if (!ordersCache[customer.email]) fetchCustomerOrders(customer.email); }}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-left"
                                                                >
                                                                    <Download className="w-4 h-4 text-amber-400" />
                                                                    Export Data
                                                                </button>
                                                                <div className="border-t border-white/5" />
                                                                <button
                                                                    onClick={() => handleDelete(customer.email)}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    {t.admin.customers.table.delete_customer}
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─── Customer Detail Side Panel ─── */}
            <AnimatePresence>
                {selectedCustomer && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            onClick={() => setSelectedCustomer(null)}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 h-full w-full max-w-xl bg-[var(--background)] border-l border-white/10 shadow-2xl z-50 flex flex-col"
                        >
                            {/* Panel Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-neon-blue)] to-[var(--color-quantum-purple)] flex items-center justify-center text-white font-bold text-xl">
                                        {selectedCustomer.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-white font-bold text-lg leading-tight break-all">{selectedCustomer.email}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-neon-blue)]/40 text-[var(--color-neon-blue)] bg-[var(--color-neon-blue)]/10">
                                                {t.admin.customers.role.customer}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Last active {new Date(selectedCustomer.lastActive).toLocaleDateString(locale)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Stats Strip */}
                            <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 shrink-0">
                                <div className="flex flex-col items-center justify-center py-4 gap-1">
                                    <ShoppingBag className="w-5 h-5 text-[var(--color-neon-blue)] mb-1" />
                                    <span className="text-white font-bold text-xl">{selectedCustomer.totalOrders}</span>
                                    <span className="text-xs text-gray-500">Total Orders</span>
                                </div>
                                <div className="flex flex-col items-center justify-center py-4 gap-1">
                                    <TrendingUp className="w-5 h-5 text-[var(--color-plasma-pink)] mb-1" />
                                    <span className="text-[var(--color-plasma-pink)] font-bold text-lg">
                                        {formatCurrency(selectedCustomer.totalSpent)}
                                    </span>
                                    <span className="text-xs text-gray-500">Lifetime Value</span>
                                </div>
                                <div className="flex flex-col items-center justify-center py-4 gap-1">
                                    <Package className="w-5 h-5 text-amber-400 mb-1" />
                                    <span className="text-white font-bold text-lg">
                                        {formatCurrency(avgOrderValue(selectedCustomer))}
                                    </span>
                                    <span className="text-xs text-gray-500">Avg. Order</span>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-2 px-6 py-4 border-b border-white/10 shrink-0">
                                <a
                                    href={`mailto:${selectedCustomer.email}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-neon-blue)]/10 border border-[var(--color-neon-blue)]/30 text-[var(--color-neon-blue)] hover:bg-[var(--color-neon-blue)]/20 transition-colors text-sm"
                                >
                                    <Mail className="w-4 h-4" />
                                    Send Email
                                </a>
                                <button
                                    onClick={() => handleCopyEmail(selectedCustomer.email)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm"
                                >
                                    {copiedEmail === selectedCustomer.email
                                        ? <Check className="w-4 h-4 text-emerald-400" />
                                        : <Copy className="w-4 h-4" />}
                                    {copiedEmail === selectedCustomer.email ? "Copied!" : "Copy Email"}
                                </button>
                                <button
                                    onClick={() => handleExport(selectedCustomer)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm ml-auto"
                                >
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>
                            </div>

                            {/* Order History */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                                    <Clock className="w-4 h-4" />
                                    Order History
                                    {!loadingOrders && (
                                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white">
                                            {customerOrders.length}
                                        </span>
                                    )}
                                </h3>

                                {loadingOrders ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-7 h-7 animate-spin text-[var(--color-neon-blue)]" />
                                    </div>
                                ) : customerOrders.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">
                                        <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        <p>No orders yet</p>
                                    </div>
                                ) : (
                                    customerOrders.map((order) => (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="glass border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors"
                                        >
                                            {/* Order Header */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <div className="text-xs text-gray-500 font-mono">#{order.id.slice(0, 8).toUpperCase()}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        {new Date(order.created_at).toLocaleDateString(locale, {
                                                            year: "numeric", month: "short", day: "numeric"
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${statusColors[order.status] || "text-gray-400 bg-white/5 border-white/10"}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="text-white font-bold font-mono">
                                                        {formatCurrency(order.total_amount)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            {order.items && order.items.length > 0 && (
                                                <div className="space-y-1 border-t border-white/5 pt-3">
                                                    {order.items.map(item => (
                                                        <div key={item.id} className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-2 text-gray-300">
                                                                <ChevronRight className="w-3 h-3 text-gray-600" />
                                                                <span>{item.product_name}</span>
                                                                <span className="text-gray-500">× {item.quantity}</span>
                                                            </div>
                                                            <span className="text-gray-400 font-mono">
                                                                {formatCurrency(item.unit_price * item.quantity)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Panel Footer */}
                            <div className="px-6 py-4 border-t border-white/10 shrink-0">
                                <button
                                    onClick={() => handleDelete(selectedCustomer.email)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {t.admin.customers.table.delete_customer}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─── Delete Confirmation Dialog ─── */}
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
                                <h3 className="text-white font-bold text-lg">Delete Customer?</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">
                                You're about to remove <span className="text-white font-medium">{deleteTarget}</span> from the customer list.
                            </p>
                            <p className="text-xs text-gray-500 mb-6">This removes them from the local view only — it does not delete Supabase auth accounts or orders.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-colors text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
