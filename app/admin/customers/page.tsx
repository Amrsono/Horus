"use client";

import { useState } from "react";
import { Search, Filter, MoreHorizontal, Mail, ExternalLink, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CustomersPage() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");

    // Mock data based on user request: accounts info, orders amounts, total paid
    const customers = [
        {
            id: "CUST-001",
            name: "John Doe",
            email: "john@example.com",
            role: "User",
            status: "Active",
            totalOrders: 12,
            totalSpent: "$1,250.00",
            lastActive: "2077-05-12 14:30",
            joinDate: "2077-01-15"
        },
        {
            id: "CUST-002",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "VIP",
            status: "Active",
            totalOrders: 5,
            totalSpent: "$850.50",
            lastActive: "2077-05-10 09:15",
            joinDate: "2077-02-28"
        },
        {
            id: "CUST-003",
            name: "Alex Johnson",
            email: "alex@example.com",
            role: "User",
            status: "Inactive",
            totalOrders: 1,
            totalSpent: "$45.00",
            lastActive: "2077-03-01 11:20",
            joinDate: "2077-03-01"
        },
    ];

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                    <button className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                        {t.admin.customers.add_customer}
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
                                <th className="px-6 py-4">{t.admin.customers.table.role_status}</th>
                                <th className="px-6 py-4">{t.admin.customers.table.orders}</th>
                                <th className="px-6 py-4">{t.admin.customers.table.total_spent}</th>
                                <th className="px-6 py-4">{t.admin.customers.table.last_active}</th>
                                <th className="px-6 py-4 text-right">{t.admin.customers.table.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-neon-blue)] to-[var(--color-quantum-purple)] flex items-center justify-center text-white font-bold text-sm">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white">{customer.name}</div>
                                                <div className="text-xs flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {customer.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-white">
                                                <Shield className="w-3 h-3 text-[var(--color-neon-blue)]" />
                                                {customer.role}
                                            </div>
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${customer.status === 'Active'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                                }`}>
                                                {customer.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white font-mono">{customer.totalOrders}</div>
                                        <div className="text-xs">{t.admin.customers.table.orders}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[var(--color-plasma-pink)] font-mono font-bold">{customer.totalSpent}</div>
                                        <div className="text-xs">Lifetime Value</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>{customer.lastActive}</div>
                                        <div className="text-xs">{t.admin.customers.table.joined}: {customer.joinDate}</div>
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
