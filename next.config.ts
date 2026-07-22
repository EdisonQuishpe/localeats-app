import type { NextConfig } from "next";

// URL del API Gateway (NestJS). En Docker se sobreescribe con la variable
// de entorno GATEWAY_URL apuntando al servicio "backend".
const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:3001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Todo lo que empiece con /gw/ se reenvia de forma transparente
        // al API Gateway. Evita problemas de CORS y centraliza la URL.
        source: "/gw/:path*",
        destination: `${GATEWAY_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;