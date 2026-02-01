"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col relative overflow-hidden">
            <Navbar />

            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-neon-blue)]/10 blur-[120px] rounded-full pointer-events-none" />

            <main className="flex-1 flex items-center justify-center p-6 mt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-strong p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl relative z-10"
                >
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6 text-sm transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                        </Link>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Access your Horus terminal</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-neon-blue)] focus:ring-1 focus:ring-[var(--color-neon-blue)] transition-all"
                                    placeholder="agent@horus.sys"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-neon-blue)] focus:ring-1 focus:ring-[var(--color-neon-blue)] transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[var(--color-neon-blue)] text-black font-bold py-3 rounded-xl hover:bg-[var(--color-electric-cyan)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-400 text-sm">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-[var(--color-neon-blue)] hover:text-[var(--color-electric-cyan)] transition-colors">
                            Register here
                        </Link>
                    </p>
                </motion.div>
            </main>
        </div>
    );
}
