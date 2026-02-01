"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col relative overflow-hidden">
            <Navbar />

            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-quantum-purple)]/10 blur-[120px] rounded-full pointer-events-none" />

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
                        <h1 className="text-3xl font-bold text-white mb-2">Join the Network</h1>
                        <p className="text-gray-400">Create an account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-[var(--color-cyber-green)]/20 rounded-full flex items-center justify-center mx-auto text-[var(--color-cyber-green)]">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Verification Sent</h3>
                            <p className="text-gray-400">
                                Check your neural feed (email) to activate your account.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block mt-4 text-[var(--color-neon-blue)] hover:text-[var(--color-electric-cyan)]"
                            >
                                Proceed to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-quantum-purple)] focus:ring-1 focus:ring-[var(--color-quantum-purple)] transition-all"
                                        placeholder="Agent Name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-quantum-purple)] focus:ring-1 focus:ring-[var(--color-quantum-purple)] transition-all"
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
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-quantum-purple)] focus:ring-1 focus:ring-[var(--color-quantum-purple)] transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[var(--color-quantum-purple)] text-white font-bold py-3 rounded-xl hover:bg-[var(--color-plasma-pink)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Access"}
                            </button>
                        </form>
                    )}

                    <p className="mt-8 text-center text-gray-400 text-sm">
                        Already registered?{" "}
                        <Link href="/login" className="text-[var(--color-quantum-purple)] hover:text-[var(--color-plasma-pink)] transition-colors">
                            Login here
                        </Link>
                    </p>
                </motion.div>
            </main>
        </div>
    );
}
