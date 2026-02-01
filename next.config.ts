import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "zbipuqxsicanqvtxqkfu.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/**",
            },
        ],
    },
    /* config options here */
    experimental: {
        // reactCompiler: true, // Optional: Enable if using React 19 features explicitly requiring it.
    },
};

export default nextConfig;
