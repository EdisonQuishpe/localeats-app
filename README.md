# LocalEats 🍔

Sistema web tipo Uber Eats simplificado.

- **Frontend:** Next.js 16 con servidor personalizado (`server.js`) y notificaciones en tiempo real vía **Socket.IO** → puerto **3000**.
- **Backend:** monorepo **NestJS** con un **API Gateway** (HTTP) y tres microservicios que se comunican por **TCP**.
- **Base de datos:** MySQL 8.

## 🧱 Arquitectura

```
┌──────────────┐        ┌─────────────────────────────────────────────┐
│  Frontend    │        │  Backend (un solo contenedor)               │
│  Next.js     │        │                                             │
│  :3000       │        │   API Gateway (HTTP :3001)                  │
│  Socket.IO   │        │        │  │  │                              │
│              │        │        ▼  ▼  ▼   (TCP, 127.0.0.1)           │
│  Prisma ─────┼──┐     │   auth(:4001) product(:4002) support(:4003) │
└──────────────┘  │     └───────────┬────────────┬───────────┬───────┘
                  │                 │            │           │
                  ▼                 ▼            ▼           ▼
         ┌─────────────────────────────────────────────────────────┐
         │  MySQL :3306  (host :3307)                               │
         │  localeats · localeats_auth · localeats_product ·        │
         │  localeats_support                                       │
         └─────────────────────────────────────────────────────────┘
```

Los cuatro procesos NestJS corren dentro de **un mismo contenedor** y se comunican por `127.0.0.1` (igual que en local). El API Gateway es la única puerta HTTP expuesta del backend (`:3001`).

## 🛠️ Tecnologías

- Next.js 16 · React 19 · Tailwind CSS 4 · Socket.IO
- NestJS 11 (microservicios TCP) · JWT
- Prisma 5 · MySQL 8
- Docker · Docker Compose · GitHub Actions

---

## 🚀 Ejecución con Docker (recomendado)

Requisitos: **Docker** y **Docker Compose** instalados.

**1. Clonar y situarse en la rama:**
```bash
git clone https://github.com/EdisonQuishpe/localeats-app.git
cd localeats-app
git checkout second-bimester
```

**2. Crear el archivo de variables de entorno:**
```bash
cp .env.example .env
```
Edita `.env` si quieres cambiar contraseñas o el `JWT_SECRET` (recomendado).

**3. Levantar todo:**
```bash
docker compose up --build
```

Esto construye las imágenes, arranca MySQL, crea las 4 bases de datos, aplica las migraciones de Prisma automáticamente y levanta backend y frontend.

**4. Abrir la aplicación:**

| Servicio      | URL                     |
|---------------|-------------------------|
| Frontend      | http://localhost:3000   |
| API Gateway   | http://localhost:3001   |
| MySQL (host)  | `localhost:3307`        |

**Comandos útiles:**
```bash
docker compose up -d --build     # en segundo plano
docker compose logs -f backend   # ver logs de un servicio
docker compose down              # detener
docker compose down -v           # detener y borrar la base de datos (volumen)
```

> El puerto de MySQL se publica en **3307** en el host para no chocar con un MySQL local en 3306. Dentro de la red de Docker los servicios siguen usando `mysql:3306`.

---

## 💻 Ejecución local (sin Docker)

Necesitas Node.js 20+, npm y un servidor MySQL con las 4 bases creadas.

**Variables de entorno** (usa `localhost` y los puertos reales de tu MySQL en las `*_DATABASE_URL`, y en el código el gateway/microservicios usan `127.0.0.1`).

**Frontend** (raíz del repo):
```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev            # http://localhost:3000
```

**Backend** (`backend/api-gateway/`), en terminales separadas o con watch:
```bash
cd backend/api-gateway
npm install
npx prisma generate --schema=apps/auth-service/prisma/schema.prisma
npx prisma generate --schema=apps/product-service/prisma/schema.prisma
npx prisma generate --schema=apps/support-service/prisma/schema.prisma

npm run start:dev auth-service
npm run start:dev product-service
npm run start:dev support-service
npm run start:dev api-gateway     # http://localhost:3001
```

---

## 🔑 Variables de entorno

Definidas en `.env` (ver `.env.example`):

| Variable                | Descripción                                   |
|-------------------------|-----------------------------------------------|
| `MYSQL_ROOT_PASSWORD`   | Contraseña root de MySQL                       |
| `MYSQL_USER` / `MYSQL_PASSWORD` | Usuario de la aplicación              |
| `DATABASE_URL`          | Conexión Prisma del **frontend**              |
| `AUTH_DATABASE_URL`     | Conexión de **auth-service**                  |
| `PRODUCT_DATABASE_URL`  | Conexión de **product-service**               |
| `SUPPORT_DATABASE_URL`  | Conexión de **support-service**               |
| `JWT_SECRET`            | Secreto para firmar los JWT (auth-service)    |

---

## 🔄 CI/CD (GitHub Actions)

El workflow `.github/workflows/ci.yml` se ejecuta en cada `push`/`pull_request` a `second-bimester` y `main`:

1. **Frontend** — `npm ci`, `prisma generate`, lint y `next build`.
2. **Backend** — `npm ci`, `prisma generate` (×3), lint, build de los 4 proyectos y tests.
3. **Docker** — construye ambas imágenes; en `push` las publica en **GHCR** (`ghcr.io/<repo>-frontend` y `-backend`).

---

## 👥 Equipo

- Dev 1: Backend / Base de datos
- Dev 2: API
- Dev 3: Autenticación
- Dev 4: Frontend
