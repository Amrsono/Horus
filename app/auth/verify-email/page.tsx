"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, CheckCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VerifyEmailPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);

    useEffect(() => {
        // Get email from localStorage or session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) {
                setEmail(session.user.email);
                // If user is already verified, redirect to home
                if (session.user.email_confirmed_at) {
                    router.push("/");
                }
            }
        };
        checkSession();
    }, [router]);

    const handleResendEmail = async () => {
        if (!email) return;

        setResending(true);
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });

        if (!error) {
            setResent(true);
            setTimeout(() => setResent(false), 3000);
        }
        setResending(false);
    };

    return (
        <main className="min-h-screen bg-[var(--color-obsidian)] text-white">
            <Navbar />

            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 rounded-full bg-[var(--color-neon-blue)]/20 flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-10 h-10 text-[var(--color-neon-blue)]" />
                    </div>

                    <h1 className="text-4xl font-black mb-4">
                        Verify Your Email
                    </h1>

                    <p className="text-gray-400 mb-8">
                        We've sent a verification link to{" "}
                        <span className="text-[var(--color-neon-blue)] font-mono">
                            {email || "your email"}
                        </span>
                        . Click the link in the email to activate your account.
                    </p>

                    <div className="glass p-6 rounded-xl mb-6">
                        <div className="flex items-start gap-3 text-left">
                            <CheckCircle className="w-5 h-5 text-[var(--color-cyber-green)] mt-0.5 shrink-0" />
                            <div className="text-sm text-gray-300">
                                <p className="font-bold mb-1">Check your inbox</p>
                                <p className="text-gray-400">
                                    The email may take a few minutes to arrive. Don't forget to check your spam folder.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleResendEmail}
                        disabled={resending || resent}
                        className="w-full py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {resending ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Sending...
                            </>
                        ) : resent ? (
                            <>
                                <CheckCircle className="w-4 h-4 text-[var(--color-cyber-green)]" />
                                Email Sent!
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4" />
                                Resend Verification Email
                            </>
                        )}
                    </button>

                    <p className="text-sm text-gray-500 mt-6">
                        Already verified?{" "}
                        <button
                            onClick={() => router.push("/login")}
                            className="text-[var(--color-neon-blue)] hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
