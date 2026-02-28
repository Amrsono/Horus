"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Error during auth callback:", error);
                router.push("/login?error=verification_failed");
                return;
            }

            if (session) {
                // User is verified and logged in
                router.push("/");
            } else {
                // No session, redirect to login
                router.push("/login");
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-[var(--color-neon-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white">Verifying your email...</p>
            </div>
        </div>
    );
}
