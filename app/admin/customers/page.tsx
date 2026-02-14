"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Mail, ExternalLink, Shield, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

interface Customer {
    email: string;
    totalOrders: number;
    totalSpent: number;
    lastActive: string;
    status: 'active' | 'suspended' | 'blocked';
}

export default function CustomersPage() {
    const { t, locale, formatCurrency } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/customers');
            if (!response.ok) {
                throw new Error('Failed to fetch customers');
            }
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filtered customers list
    const filteredCustomers = customers.filter(customer =>
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAction = async (action: 'reset_password' | 'suspend' | 'block' | 'unsuspend' | 'unblock', email: string) => {
        setActionLoading(true);
        setError(null);
        try {
            // These are placeholder implementations since actual user management 
            // requires server-side admin client or specific RPC functions.
            // For now, we'll simulate the success to demonstrate the UI flow.

            if (action === 'reset_password') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/update-password`,
                });
                if (error) throw error;
            } else if (action === 'suspend' || action === 'unsuspend') {
                // In a real app: await supabase.auth.admin.updateUserById(uid, { ban_duration: '100y' }) 
                // or specific logic. We simulate a DB update here if needed.

                // Update local state to reflect change immediately
                setCustomers(prev => prev.map(c => {
                    if (c.email === email) {
                        return { ...c, status: action === 'suspend' ? 'suspended' : 'active' };
                    }
                    return c;
                }));

                await new Promise(resolve => setTimeout(resolve, 800));
            } else if (action === 'block' || action === 'unblock') {
                // Similar to suspend

                // Update local state to reflect change immediately
                setCustomers(prev => prev.map(c => {
                    if (c.email === email) {
                        return { ...c, status: action === 'block' ? 'blocked' : 'active' };
                    }
                    return c;
                }));

                await new Promise(resolve => setTimeout(resolve, 800));
            }

            // Close menu
            setIsMenuOpen(null);
            alert(t.admin.customers.actions_menu.success);
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleExportCSV = () => {
        const headers = ["Email", "Total Orders", "Total Spent", "Last Active", "Status"];
        const rows = customers.map(customer => [
            customer.email,
            customer.totalOrders,
            customer.totalSpent,
            customer.lastActive,
            customer.status
        ].join(","));

        const csvContent = [
            headers.join(","),
            ...rows
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `customers_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--foreground)]">{t.admin.customers.title}</h1>
                    <p className="text-[var(--text-muted)]">{t.admin.customers.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/50 rounded-lg hover:bg-[var(--color-neon-blue)]/20 transition-colors"
                    >
                        {t.admin.customers.export_csv}
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 p-4 glass rounded-xl border border-white/5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder={t.admin.customers.search_placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-[var(--foreground)] focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-white/10 transition-colors">
                    <Filter className="w-4 h-4" />
                    {t.admin.customers.filters}
                </button>
            </div>

            {/* Table */}
            <div className="glass rounded-xl border border-white/5 overflow-hidden pb-32"> {/* Added pb-32 for menu space */}
                <div className="overflow-x-visible"> {/* Changed to visible for dropdowns */}
                    <table className="w-full text-left text-sm text-[var(--text-muted)]">
                        <thead className="bg-white/5 text-xs uppercase font-bold tracking-wider text-[var(--foreground)]">
                            <tr>
                                <th className="px-6 py-4">{t.admin.customers.table.customer}</th>
                                <th className="px-6 py-4">{t.admin.customers.table.role_status}</th>
                                <th className="px-6 py-4">{t.admin.customers.table.orders}</th>
                                <th className="px-6 py-4">{t.admin.customers.table.total_spent}</th>
                                <th className="px-6 py-4">{t.admin.customers.table.last_active}</th>
                                <th className="px-6 py-4 text-right">{t.admin.customers.table.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--color-neon-blue)]" />
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr key="no-customers">
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        {t.admin.customers.table.no_customers}
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.email} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-neon-blue)] to-[var(--color-quantum-purple)] flex items-center justify-center text-[var(--foreground)] font-bold text-sm">
                                                    {customer.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-[var(--foreground)]">{customer.email}</div>
                                                    <div className="text-xs flex items-center gap-1 text-[var(--text-muted)]">
                                                        <Mail className="w-3 h-3" />
                                                        {customer.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                                                    {t.admin.customers.role.customer}
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-fit
                                                    ${customer.status === 'suspended' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                        customer.status === 'blocked' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                            'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                                                    {customer.status === 'suspended' ? t.admin.customers.status.suspended :
                                                        customer.status === 'blocked' ? t.admin.customers.status.blocked :
                                                            t.admin.customers.status.active}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[var(--foreground)] font-mono">{customer.totalOrders}</div>
                                            <div className="text-xs text-[var(--text-muted)]">{t.admin.customers.table.orders}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[var(--color-plasma-pink)] font-mono font-bold">
                                                {formatCurrency(customer.totalSpent)}
                                            </div>
                                            <div className="text-xs text-[var(--text-muted)]">Lifetime Value</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[var(--foreground)]">{new Date(customer.lastActive).toLocaleDateString(locale)}</div>
                                            <div className="text-xs text-[var(--text-muted)]">{new Date(customer.lastActive).toLocaleTimeString(locale)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--foreground)]" title="View Details">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>

                                                <div className="relative">
                                                    <button
                                                        onClick={() => setIsMenuOpen(isMenuOpen === customer.email ? null : customer.email)}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--foreground)]"
                                                        title="More Options"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>

                                                    {isMenuOpen === customer.email && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0f] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() => handleAction('reset_password', customer.email)}
                                                                    className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                                                >
                                                                    {t.admin.customers.actions_menu.reset_password}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAction(customer.status === 'suspended' ? 'unsuspend' : 'suspend', customer.email)}
                                                                    className="w-full px-4 py-2 text-sm text-left text-yellow-500 hover:bg-white/10 hover:text-yellow-400 transition-colors"
                                                                >
                                                                    {customer.status === 'suspended' ? t.admin.customers.actions_menu.unsuspend_customer : t.admin.customers.actions_menu.suspend_customer}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAction(customer.status === 'blocked' ? 'unblock' : 'block', customer.email)}
                                                                    className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-white/10 hover:text-red-400 transition-colors"
                                                                >
                                                                    {customer.status === 'blocked' ? t.admin.customers.actions_menu.unblock_customer : t.admin.customers.actions_menu.block_customer}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
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
        </div>
    );
}
