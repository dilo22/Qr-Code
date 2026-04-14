import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Empêche le Clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Empêche le MIME Sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Restreint le CORS (remplace * par ton domaine)
          { key: "Access-Control-Allow-Origin", value: "https://neonpulseqr.vercel.app" },
          // Bonus - protection XSS navigateurs anciens
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};

export default nextConfig;
