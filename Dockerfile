# =============================================================
#  Dockerfile del FRONTEND  (Next.js 16 + Socket.IO + Prisma)
#  Servidor custom: server.js  ->  puerto 3000
# =============================================================

# ---------- Etapa 1: build ----------
FROM node:20-slim AS builder
WORKDIR /app

# openssl lo necesita Prisma; python3/make/g++ compilan bcrypt (módulo nativo)
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl ca-certificates python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

# Instalar dependencias (capa cacheable)
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el resto del código
COPY . .

# Generar el cliente Prisma (descarga el engine de Linux) y compilar Next
RUN npx prisma generate
RUN npm run build

# ---------- Etapa 2: runtime ----------
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Copiar solo lo necesario desde la etapa de build
COPY --from=builder /app/node_modules   ./node_modules
COPY --from=builder /app/.next          ./.next
COPY --from=builder /app/public         ./public
COPY --from=builder /app/prisma         ./prisma
COPY --from=builder /app/server.js      ./server.js
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json   ./package.json

EXPOSE 3000

# Aplicar migraciones (con reintentos hasta que MySQL esté listo) y arrancar el
# servidor custom con Socket.IO.
CMD ["sh", "-c", "for i in 1 2 3 4 5 6 7 8 9 10; do npx prisma migrate deploy && break || (echo 'MySQL no listo, reintentando en 3s...'; sleep 3); done; exec node server.js"]
