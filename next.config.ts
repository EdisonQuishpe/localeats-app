import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El lint corre como paso independiente (informativo) en CI/CD.
  // Evita que `next build` falle por advertencias/errores de ESLint.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;