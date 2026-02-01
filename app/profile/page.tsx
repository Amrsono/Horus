"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { User, Package, Award, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [mockOrders] = useState([
        { id: "ORD-8821", date: "2077-01-15", status: "Delivered", total: "1,250 EGP", items: 3 },
        { id: "ORD-9932", date: "2077-02-01", status: "Processing", total: "450 EGP", items: 1 },
    ]);
    // Mock loyalty points stored in user metadata usually, but hardcoding for demo if not present
    const loyaltyPoints = 1250;

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[var(--color-neon-blue)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-obsidian)] text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12 mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Agent Profile
                            </h1>
                            <p className="text-gray-400 mt-1">Clearance Level: User</p>
                        </div>
                        <button
                            onClick={signOut}
                            className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* User Info Card */}
                        <div className="glass p-6 rounded-2xl border border-white/10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-[var(--color-neon-blue)]/10 rounded-full flex items-center justify-center text-[var(--color-neon-blue)]">
                                    <User className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">{user.user_metadata?.full_name || "Agent"}</h2>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Account Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-[var(--color-plasma-pink)]/20">
                                        <div className="flex items-center gap-3">
                                            <Award className="w-5 h-5 text-[var(--color-plasma-pink)]" />
                                            <span>Loyalty Points</span>
                                        </div>
                                        <span className="font-mono font-bold text-[var(--color-plasma-pink)]">{loyaltyPoints} PTS</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Package className="w-5 h-5 text-gray-400" />
                                            <span>Total Orders</span>
                                        </div>
                                        <span className="font-mono font-bold">2</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="md:col-span-2 glass p-6 rounded-2xl border border-white/10">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5 text-[var(--color-neon-blue)]" />
                                Recent Orders
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="text-xs uppercase font-bold tracking-wider text-gray-500 border-b border-white/10">
                                        <tr>
                                            <th className="px-4 py-3">Order ID</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Total</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {mockOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-4 font-mono text-white">{order.id}</td>
                                                <td className="px-4 py-4">{order.date}</td>
                                                <td className="px-4 py-4 text-white">{order.total}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider 
                                                        ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <button className="text-[var(--color-neon-blue)] hover:text-white transition-colors">
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
