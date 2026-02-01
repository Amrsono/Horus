// @ts-nocheck
"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Grid, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

function AnimatedSphere({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) {
    const meshRef = useRef<any>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.5;
            meshRef.current.rotation.x = t * 0.2;
            meshRef.current.rotation.y = t * 0.2;
        }
    });

    return (
        <Sphere ref={meshRef} args={[1, 100, 200]} position={position} scale={1.5}>
            <MeshDistortMaterial
                color={color}
                attach="material"
                distort={0.4}
                speed={1.5}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#00d4ff" />
            <directionalLight position={[-10, -10, -5]} intensity={1} color="#b300ff" />

            <AnimatedSphere position={[-2, 0, 0]} color="#00d4ff" speed={0.5} />
            <AnimatedSphere position={[2, 0, 0]} color="#b300ff" speed={0.7} />
            <AnimatedSphere position={[0, 2, -2]} color="#ff00ff" speed={0.4} />

            <Grid
                renderOrder={-1}
                position={[0, -4, 0]}
                infiniteGrid
                cellSize={0.6}
                sectionSize={3}
                fadeDistance={30}
                sectionColor="#00d4ff"
                cellColor="#b300ff"
            />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <OrbitControls
                enableZoom={false}
                autoRotate
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 3}
            />
        </>
    );
}

import { useLanguage } from "@/contexts/LanguageContext";

// ... existing code ...

export default function Hero3D() {
    const { t } = useLanguage();

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[var(--color-obsidian)]">
            {/* 3D Scene Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <Scene />
                </Canvas>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    <h2 className="text-[var(--color-neon-blue)] font-bold tracking-widest uppercase mb-4 text-sm md:text-base border border-[var(--color-neon-blue)]/30 px-4 py-1 rounded-full glass">
                        {t.hero.established}
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-tight pointer-events-auto">
                        <span className="block text-white">{t.hero.title_prefix}</span>
                        <span className="text-gradient block neon-text-purple">{t.hero.title_suffix}</span>
                    </h1>
                    <p className="max-w-xl text-gray-400 text-lg md:text-xl mb-10 leading-relaxed pointer-events-auto">
                        {t.hero.description}
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 pointer-events-auto">
                        <Link
                            href="/products"
                            className="group relative px-8 py-4 bg-[var(--color-neon-blue)] text-black font-bold uppercase tracking-wider overflow-hidden rounded-sm hover-lift"
                        >

                            <span className="relative z-10">{t.hero.cta_primary}</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                        <Link
                            href="#features"
                            className="px-8 py-4 glass text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-colors rounded-sm hover-lift"
                        >
                            {t.hero.cta_secondary}
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-neon-blue)]">{t.hero.scroll}</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-neon-blue)] to-transparent" />
            </motion.div>
        </div>
    );
}
