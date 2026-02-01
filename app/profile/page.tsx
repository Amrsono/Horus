"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/cartStore";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, Award, LogOut, Loader2, X, ShoppingCart, MapPin } from "lucide-react";

interface OrderItem {
    product_id: string;
    product_name: string;
    quantity: number;
    price_at_purchase: number;
}

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    shipping_address: any;
    order_items: OrderItem[];
}

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const { addItem } = useCartStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [reordering, setReordering] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;

        setLoadingOrders(true);
        const { data, error } = await supabase
            .from('orders')
            .select(`
                id,
                created_at,
                total_amount,
                status,
                shipping_address,
                order_items (
                    product_id,
                    product_name,
                    quantity,
                    price_at_purchase
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (!error && data) {
            setOrders(data as Order[]);
        }
        setLoadingOrders(false);
    };

    const handleReorder = async (order: Order) => {
        setReordering(true);
        console.log("Starting reorder for order:", order.id);

        try {
            // Fetch product details for each item
            for (const item of order.order_items) {
                console.log("Processing item:", item.product_id);
                const { data: product, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', item.product_id)
                    .single();

                if (error) {
                    console.error("Error fetching product:", item.product_id, error);
                }

                if (product) {
                    console.log("Product found:", product.name);
                    // Add item with specific quantity
                    addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image_url || '/placeholder.jpg',
                        category: product.category || 'Product'
                    }, item.quantity);
                } else {
                    console.warn("Product not found, using order item details:", item.product_name);
                    // Fallback to order item details if product not found (e.g. deleted)
                    addItem({
                        id: item.product_id,
                        name: item.product_name, // Fallback name
                        price: item.price_at_purchase, // Fallback price
                        image: '/placeholder.jpg', // Fallback image
                        category: 'Product' // Fallback category
                    }, item.quantity);
                }
            }

            console.log("Reorder complete, redirecting to cart");
            setReordering(false);
            setSelectedOrder(null);
            router.push('/cart');
        } catch (error) {
            console.error("Critical error in reorder:", error);
            setReordering(false);
            alert("Failed to re-order items. Please try again.");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-500/10 text-green-500';
            case 'shipped':
                return 'bg-blue-500/10 text-blue-500';
            case 'processing':
                return 'bg-yellow-500/10 text-yellow-500';
            case 'cancelled':
                return 'bg-red-500/10 text-red-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

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
                                {user?.email === 'admin@horus.com' ? 'Agent Profile' : 'Customer Profile'}
                            </h1>
                            {user?.email === 'admin@horus.com' && (
                                <p className="text-gray-400 mt-1">Clearance Level: Admin</p>
                            )}
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
                                <div className="w-20 h-20 bg-[var(--color-neon-blue)]/5 rounded-full flex items-center justify-center border border-[var(--color-neon-blue)]/20 shadow-[0_0_20px_rgba(var(--color-neon-blue-rgb),0.1)]">
                                    <img src="/horus-eye-logo.png" alt="Profile" className="w-12 h-12 object-contain" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">{user.user_metadata?.full_name || (user?.email === 'admin@horus.com' ? "Agent" : "Customer")}</h2>
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
                                        <span className="font-mono font-bold text-[var(--color-plasma-pink)]">1250 PTS</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Package className="w-5 h-5 text-gray-400" />
                                            <span>Total Orders</span>
                                        </div>
                                        <span className="font-mono font-bold">{orders.length}</span>
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

                            {loadingOrders ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-[var(--color-neon-blue)]" />
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No orders yet</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-400">
                                        <thead className="text-xs uppercase font-bold tracking-wider text-gray-500 border-b border-white/10">
                                            <tr>
                                                <th className="px-4 py-3">Order ID</th>
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Total</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-4 font-mono text-white">#{order.id.slice(0, 8)}</td>
                                                    <td className="px-4 py-4">{formatDate(order.created_at)}</td>
                                                    <td className="px-4 py-4 text-white">{order.total_amount.toFixed(0)} EGP</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <div className="flex gap-2 justify-end">
                                                            <button
                                                                onClick={() => setSelectedOrder(order)}
                                                                className="text-[var(--color-neon-blue)] hover:text-white transition-colors"
                                                            >
                                                                View
                                                            </button>
                                                            <span className="text-gray-600">|</span>
                                                            <button
                                                                onClick={() => handleReorder(order)}
                                                                disabled={reordering}
                                                                className="text-[var(--color-plasma-pink)] hover:text-white transition-colors disabled:opacity-50"
                                                            >
                                                                Re-order
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-strong p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Order Details</h2>
                                    <p className="text-gray-400 mt-1">#{selectedOrder.id.slice(0, 8)}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Order Info */}
                            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/5 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Date</p>
                                    <p className="text-white font-medium">{formatDate(selectedOrder.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Status</p>
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-white mb-4">Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder.order_items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                            <div>
                                                <p className="text-white font-medium">{item.product_name}</p>
                                                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-[var(--color-neon-blue)] font-mono">
                                                {item.price_at_purchase.toFixed(0)} EGP
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {selectedOrder.shipping_address && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Shipping Address
                                    </h3>
                                    <div className="p-4 bg-white/5 rounded-lg text-gray-300">
                                        <p>{selectedOrder.shipping_address.name}</p>
                                        <p>{selectedOrder.shipping_address.address}</p>
                                        <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.zip}</p>
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className="border-t border-white/10 pt-4 mb-6">
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span className="text-white">Total</span>
                                    <span className="text-[var(--color-neon-blue)]">{selectedOrder.total_amount.toFixed(0)} EGP</span>
                                </div>
                            </div>

                            {/* Re-order Button */}
                            <button
                                onClick={() => handleReorder(selectedOrder)}
                                disabled={reordering}
                                className="w-full py-3 bg-[var(--color-plasma-pink)] text-white font-bold rounded-lg hover:bg-[var(--color-plasma-pink)]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {reordering ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Adding to Cart...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5" />
                                        Re-order All Items
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
