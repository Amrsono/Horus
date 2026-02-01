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
}

export default function CustomersPage() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setIsLoading(true);

        // Fetch all registered users from auth
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

        // Fetch all orders
        const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('guest_email, total_amount, created_at');

        if (usersError) {
            console.error("Error fetching users:", usersError);
        }

        if (ordersError) {
            console.error("Error fetching orders:", ordersError);
        }

        // Create a map of all customers
        const customerMap = new Map<string, { orders: number; spent: number; lastActive: string }>();

        // Add all registered users to the map
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

        // Aggregate orders by customer email
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

    const filteredCustomers = customers.filter(customer =>
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">{t.admin.customers.title}</h1>
                    <p className="text-gray-400">{t.admin.customers.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/50 rounded-lg hover:bg-[var(--color-neon-blue)]/20 transition-colors">
                        {t.admin.customers.export_csv}
                    </button>
                </div>
            </div>

            {/* Filters */}
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
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.email} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-neon-blue)] to-[var(--color-quantum-purple)] flex items-center justify-center text-white font-bold text-sm">
                                                    {customer.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">{customer.email}</div>
                                                    <div className="text-xs flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        Customer
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white font-mono">{customer.totalOrders}</div>
                                            <div className="text-xs">{t.admin.customers.table.orders}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[var(--color-plasma-pink)] font-mono font-bold">
                                                {customer.totalSpent.toFixed(2)} EGP
                                            </div>
                                            <div className="text-xs">Lifetime Value</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{new Date(customer.lastActive).toLocaleDateString()}</div>
                                            <div className="text-xs">{new Date(customer.lastActive).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white" title="View Details">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white" title="More Options">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
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
