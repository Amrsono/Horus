"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Hammer, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-neon-blue)]/5 blur-[120px] rounded-full" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

            {/* Animation Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-2xl w-full text-center space-y-8"
            >
                {/* Danger Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full"
                        />
                        <div className="relative bg-black/40 border border-yellow-500/30 p-8 rounded-full">
                            <ShieldAlert className="w-20 h-20 text-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
                        Danger <span className="text-yellow-500">Zone</span>
                    </h1>
                    <div className="h-1 w-32 bg-yellow-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-gray-300 uppercase tracking-widest">
                        System Maintenance in Progress
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
                        Our bio-engineers are currently recalibrating the neural networks and upgrading the quantum servers. Access to the storefront is temporarily restricted.
                    </p>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                    <div className="glass p-4 rounded-xl border-yellow-500/20 flex flex-col items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 italic">Est. Time</span>
                        <span className="text-sm font-mono tracking-tighter">0.5 HOURS</span>
                    </div>
                    <div className="glass p-4 rounded-xl border-yellow-500/20 flex flex-col items-center gap-2">
                        <Hammer className="w-5 h-5 text-yellow-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 italic">Workload</span>
                        <span className="text-sm font-mono tracking-tighter text-yellow-500">CRITICAL</span>
                    </div>
                    <div className="glass p-4 rounded-xl border-yellow-500/20 flex flex-col items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 italic">Safety</span>
                        <span className="text-sm font-mono tracking-tighter">SECURED</span>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="pt-12">
                    <Link
                        href="/login"
                        className="text-xs text-gray-600 hover:text-yellow-500 transition-colors uppercase tracking-[0.2em] font-bold italic"
                    >
                        Personnel Login Access
                    </Link>
                </div>
            </motion.div>

            {/* Scanning Line Effect */}
            <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[1px] bg-yellow-500/20 z-20 pointer-events-none shadow-[0_0_10px_rgba(234,179,8,0.3)]"
            />
        </div>
    );
}
