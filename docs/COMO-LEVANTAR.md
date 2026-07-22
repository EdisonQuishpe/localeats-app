# 🚀 Cómo levantar LocalEats

Guía paso a paso para arrancar **toda** la plataforma (frontend, API Gateway, 3 microservicios, MySQL, Prometheus y Grafana).

Hay dos caminos:

- **A) Docker Compose (recomendado)** — un solo comando levanta todo.
- **B) Local / desarrollo** — cada servicio a mano (para depurar).

---

## ✅ Requisitos previos

| Herramienta | Versión | Para qué |
|-------------|---------|----------|
| Docker Desktop | reciente (Compose v2) | Camino A |
| Node.js | 20.x | Camino B |
| npm | 10.x | Camino B |
| MySQL 8 | — | Camino B (o usar el de Docker) |

Verifica Docker:

```powershell
docker --version
docker compose version
```

---

## 🅰️ Camino A — Docker Compose (todo en uno)

### 1. Crear el archivo `.env`

En la **raíz del proyecto**, copia el ejemplo y ajústalo:

```powershell
Copy-Item .env.example .env
```

Contenido esperado de `.env` (valores válidos para Docker Compose):

```dotenv
# MySQL
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_USER=localeats
MYSQL_PASSWORD=localeats

# Bases de datos (host = "mysql", el nombre del servicio en compose)
DATABASE_URL="mysql://localeats:localeats@mysql:3306/localeats"
AUTH_DATABASE_URL="mysql://localeats:localeats@mysql:3306/localeats_auth"
PRODUCT_DATABASE_URL="mysql://localeats:localeats@mysql:3306/localeats_product"
SUPPORT_DATABASE_URL="mysql://localeats:localeats@mysql:3306/localeats_support"

# Seguridad
JWT_SECRET="cambia-esto-por-un-secreto-largo-y-aleatorio"

# Proxy del frontend hacia el gateway (nombre del servicio en compose)
GATEWAY_URL="http://backend:3001"
```

> ⚠️ `.env` está en `.gitignore` (no se sube al repo). Cada quien crea el suyo.

### 2. Construir y levantar todo

```powershell
docker compose up --build -d
```

Esto levanta 5 contenedores:

| Contenedor | Puerto (host) | Descripción |
|------------|:-------------:|-------------|
| `localeats-mysql` | 3307 | Base de datos MySQL |
| `localeats-backend` | 3001 | Gateway + Auth + Product + Support |
| `localeats-frontend` | 3000 | Next.js + Socket.IO |
| `localeats-prometheus` | 9090 | Métricas |
| `localeats-grafana` | 3002 | Dashboards (admin/admin) |

> 💡 El backend aplica automáticamente las migraciones de Prisma al arrancar (`docker-entrypoint.sh`).

### 3. Verificar que todo está arriba

```powershell
docker compose ps
```

Espera a que `localeats-mysql` esté **healthy** y el resto **Up**. Sigue los logs si quieres:

```powershell
docker compose logs -f backend
docker compose logs -f frontend
```

### 4. Abrir la aplicación

| URL | Servicio |
|-----|----------|
| http://localhost:3000 | **App LocalEats** |
| http://localhost:3001/auth/health | Salud del Gateway |
| http://localhost:9090 | Prometheus |
| http://localhost:3002 | Grafana (admin / admin) |

### 5. Comandos útiles del día a día

```powershell
# Reconstruir solo el frontend (p. ej. tras cambiar el proxy)
docker compose up --build -d frontend

# Reiniciar un servicio
docker compose restart frontend

# Ver logs en vivo
docker compose logs -f

# Apagar (conserva los datos de MySQL)
docker compose down

# Apagar y BORRAR los datos (empezar de cero)
docker compose down -v
```

---

## 🅱️ Camino B — Local / desarrollo (sin Docker para la app)

Útil para depurar con recarga en caliente. Necesitas un MySQL disponible (puedes usar solo el de Docker: `docker compose up -d mysql`).

### 1. Base de datos

Levanta solo MySQL con Docker (opción sencilla):

```powershell
docker compose up -d mysql
```

En `.env`, para ejecución local usa `localhost:3307` como host de MySQL:

```dotenv
AUTH_DATABASE_URL="mysql://localeats:localeats@localhost:3307/localeats_auth"
PRODUCT_DATABASE_URL="mysql://localeats:localeats@localhost:3307/localeats_product"
SUPPORT_DATABASE_URL="mysql://localeats:localeats@localhost:3307/localeats_support"
GATEWAY_URL="http://localhost:3001"
```

### 2. Backend (monorepo NestJS)

```powershell
cd backend/api-gateway
npm install

# Generar clientes Prisma y migrar cada microservicio
npx prisma migrate deploy --schema apps/auth-service/prisma/schema.prisma
npx prisma migrate deploy --schema apps/product-service/prisma/schema.prisma
npx prisma migrate deploy --schema apps/support-service/prisma/schema.prisma

npm run build
```

Arranca los **4 procesos** (cada uno en su terminal, o en segundo plano):

```powershell
# Microservicios (TCP)
node dist/apps/auth-service/main.js
node dist/apps/product-service/main.js
node dist/apps/support-service/main.js

# Gateway (HTTP :3001) — arráncalo al final
node dist/apps/api-gateway/main.js
```

> En desarrollo puedes usar `npm run start:dev <app>` para recarga en caliente de cada app.

### 3. Frontend (Next.js)

En **otra terminal**, desde la raíz del proyecto:

```powershell
npm install
npm run build     # importante: hornea GATEWAY_URL en el proxy /gw
npm run dev       # ejecuta node server.js (NO "next dev")
```

> ⚠️ El servidor de desarrollo se arranca con `npm run dev`, que ejecuta `server.js` (servidor HTTP custom con Socket.IO). **No** uses `next dev`: el chat en tiempo real depende de este servidor.

Abre http://localhost:3000.

---

## 🧪 Verificación rápida (smoke test)

Con el stack levantado, prueba el flujo de autenticación:

```powershell
# 1. Registrar un usuario
curl -X POST http://localhost:3001/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test\",\"email\":\"test@demo.com\",\"password\":\"123456\"}'

# 2. Iniciar sesión (guarda el accessToken devuelto)
curl -X POST http://localhost:3001/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@demo.com\",\"password\":\"123456\"}'

# 3. Ruta protegida SIN token → debe dar 401
curl http://localhost:3001/products

# 4. Ruta protegida CON token → debe dar 200
curl http://localhost:3001/products -H "Authorization: Bearer <PEGA_EL_TOKEN>"
```

Resultado esperado:

- Registro → `201`
- Login → `200` con `{ accessToken, user }`
- `/products` sin token → `401`
- `/products` con token → `200`

---

## 👑 Promover un usuario a administrador

El rol viaja dentro del JWT, así que hay que **cambiarlo en la base de datos** y luego **volver a iniciar sesión**.

```powershell
docker exec localeats-mysql mysql -ulocaleats -plocaleats localeats_auth `
  -e "UPDATE User SET role='admin' WHERE email='test@demo.com';"
```

> Tras cambiar el rol, **cierra sesión y vuelve a entrar** para que el nuevo rol quede reflejado en un token nuevo.

---

## 🛠️ Solución de problemas

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| Frontend muestra `ECONNREFUSED :3001` | `GATEWAY_URL` no se horneó en el build | Reconstruir frontend con `--build`; confirmar build-arg `GATEWAY_URL=http://backend:3001` |
| `P3015` / migración vacía | Carpeta de migración sin `migration.sql` | Eliminar la carpeta de migración vacía y reintentar |
| MySQL no arranca / datos corruptos | Volumen previo inconsistente | `docker compose down -v` y volver a levantar |
| 401 en todas las rutas | Token ausente/expirado (dura 1h) | Volver a iniciar sesión |
| PowerShell reporta "exit code 1" con docker | Docker escribe progreso en stderr | No es un error real; revisar `docker compose ps` |
| Cambié el rol pero sigo como "user" | El rol está en el JWT | Cerrar sesión y volver a entrar |

---

## 📚 Documentación técnica completa

Para arquitectura, diagramas, modelo de datos y aportes por desarrollador, consulta **[DOCUMENTACION.md](./DOCUMENTACION.md)**.
