#!/bin/sh
# Aplica las migraciones de los 3 servicios y arranca los 4 procesos NestJS
# dentro del mismo contenedor (se comunican por 127.0.0.1, como en local).
set -e

run_migrate() {
  schema="$1"
  i=1
  while [ "$i" -le 10 ]; do
    if npx prisma migrate deploy --schema="$schema"; then
      return 0
    fi
    echo "MySQL no disponible aún (intento $i/10), reintentando en 3s..."
    i=$((i + 1))
    sleep 3
  done
  echo "ERROR: no se pudieron aplicar las migraciones de $schema"
  return 1
}

echo "== Aplicando migraciones =="
run_migrate apps/auth-service/prisma/schema.prisma
run_migrate apps/product-service/prisma/schema.prisma
run_migrate apps/support-service/prisma/schema.prisma

echo "== Iniciando microservicios (TCP 4001/4002/4003) =="
node dist/apps/auth-service/main &
node dist/apps/product-service/main &
node dist/apps/support-service/main &

# Pequeña espera para que los microservicios TCP queden escuchando
sleep 2

echo "== Iniciando API Gateway (HTTP 3001) =="
exec node dist/apps/api-gateway/main
