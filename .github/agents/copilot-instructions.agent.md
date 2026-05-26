# LocalEats App

App web tipo Uber Eats simplificada. UI en **español**.

## Tech Stack

- Next.js 16 (App Router) + React 19
- Prisma 5 + MySQL
- Socket.IO (chat en tiempo real)
- Tailwind CSS 4 (`@tailwindcss/postcss`)
- bcrypt para hashing de contraseñas
- TypeScript (config, layout) y JavaScript (pages, API routes)

## Comandos

| Tarea            | Comando                                                 |
| ---------------- | ------------------------------------------------------- |
| Dev server       | `npm run dev` (ejecuta `node server.js`, NO `next dev`) |
| Build            | `npm run build`                                         |
| Lint             | `npm run lint`                                          |
| Migración Prisma | `npx prisma migrate dev`                                |
| Generar cliente  | `npx prisma generate`                                   |

## Arquitectura

```
server.js (puerto 3000)
├── Next.js App (HTTP handler)
└── Socket.IO Server (WebSocket chat)

Next.js App Router
├── app/api/*            → REST endpoints (route.js)
├── app/login/           → Páginas cliente ("use client" + useState)
├── app/register/
├── app/forgot-password/
├── app/products/        → CRUD UI
├── app/chat/            → Cliente Socket.IO
├── app/dashboard/       → Server component
├── app/layout.tsx       → Root layout (TypeScript)
└── app/page.tsx         → Homepage (boilerplate)

Prisma ORM (PrismaClient por archivo)
└── MySQL (DATABASE_URL)
```

### Modelos de datos

- **User**: id, name, email (unique), password (bcrypt hash)
- **Product**: id, name, description, price, createdAt

## Convenciones

- **Servidor dev**: `server.js` crea un servidor HTTP con Socket.IO. NO reemplazar con `next dev`.
- **API routes**: `app/api/*/route.js`. Usar `Response.json(...)`. Instanciar `PrismaClient` por archivo.
- **Páginas**: Componentes cliente con `"use client"`. Forms usan `useState` local. Sin estado global.
- **Base de datos**: Modelos en `prisma/schema.prisma`. Después de cambios: `npx prisma migrate dev`.
- **Auth**: bcrypt hash/compare manual. Sin JWT, sin sesiones, sin middleware.
- **Path alias**: `@/*` apunta a la raíz del proyecto.
- **Idioma UI**: Todo texto visible al usuario debe estar en español.

## Cuidado con

- Sin middleware de autenticación — todas las rutas API están desprotegidas.
- `PrismaClient` se instancia por archivo (no singleton).
- El endpoint `forgot-password` resetea contraseñas directamente sin verificación por email.
- Socket.IO corre en el mismo puerto (3000) que Next.js.
- La variable `DATABASE_URL` debe estar configurada para Prisma.
