# =============================================================
#  Dockerfile del BACKEND  (monorepo NestJS)
#  UN solo contenedor ejecuta los 4 procesos vía loopback (127.0.0.1):
#    - api-gateway    HTTP  3001  (única puerta expuesta)
#    - auth-service   TCP   4001
#    - product-service TCP  4002
#    - support-service TCP  4003
# =============================================================

# ---------- Etapa 1: build ----------
FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl ca-certificates python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# El repo trae el engine de Windows; lo regeneramos para Linux en cada servicio.
RUN npx prisma generate --schema=apps/auth-service/prisma/schema.prisma \
 && npx prisma generate --schema=apps/product-service/prisma/schema.prisma \
 && npx prisma generate --schema=apps/support-service/prisma/schema.prisma

# Compilar los 4 proyectos del monorepo.
RUN npx nest build api-gateway \
 && npx nest build auth-service \
 && npx nest build product-service \
 && npx nest build support-service

# Con webpack el cliente Prisma queda embebido en el bundle; extraemos el engine
# de Linux a una ruta fija y luego lo referenciamos con PRISMA_QUERY_ENGINE_LIBRARY.
RUN mkdir -p /app/engines \
 && cp "$(find apps -type f -name 'libquery_engine-*.so.node' | head -n1)" /app/engines/libquery_engine.so.node

# ---------- Etapa 2: runtime ----------
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
# apps/ se necesita para los schemas y migraciones de Prisma (migrate deploy)
COPY --from=builder /app/apps         ./apps
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/engines      ./engines
COPY docker-entrypoint.sh             ./docker-entrypoint.sh

# El cliente Prisma (bundleado por webpack) resuelve el engine con esta variable.
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/engines/libquery_engine.so.node

EXPOSE 3001

CMD ["sh", "./docker-entrypoint.sh"]
