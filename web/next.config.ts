import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // El contenido se lee del disco en tiempo de ejecución desde el panel.
  outputFileTracingIncludes: { "/**": ["./content/**"] },
};

export default nextConfig;
