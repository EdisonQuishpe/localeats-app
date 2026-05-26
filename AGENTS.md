<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# LocalEats App

Simplified Uber Eats-style web app. UI is in **Spanish**.

## Tech Stack

- **Next.js 16** (App Router) with React 19
- **Prisma 5** + MySQL
- **Socket.IO** for real-time chat
- **Tailwind CSS 4** (via `@tailwindcss/postcss`)
- **bcrypt** for password hashing
- Mixed **TypeScript** (config, layout) and **JavaScript** (pages, API routes)

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (runs `node server.js`, NOT `next dev`) |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Prisma migrate | `npx prisma migrate dev` |
| Prisma generate | `npx prisma generate` |

## Architecture

```
server.js (port 3000)
├── Next.js App (HTTP handler)
└── Socket.IO Server (WebSocket chat)

Next.js App Router
├── app/api/*       → REST endpoints (route.js)
├── app/login/      → Client pages ("use client" + useState)
├── app/register/
├── app/forgot-password/
├── app/products/   → CRUD UI
├── app/chat/       → Socket.IO client
├── app/dashboard/  → Server component
├── app/layout.tsx  → Root layout (TypeScript)
└── app/page.tsx    → Homepage (boilerplate)

Prisma ORM (PrismaClient per-file)
└── MySQL (DATABASE_URL)
```

### Directory Structure

```
app/
├── api/          # Route Handlers (REST endpoints)
├── chat/         # Real-time chat page (Socket.IO client)
├── dashboard/    # Server component, landing after login
├── login/        # Auth pages
├── register/
├── forgot-password/
├── products/     # CRUD UI
├── layout.tsx    # Root layout (TypeScript)
└── page.tsx      # Homepage (default Next.js boilerplate)
prisma/
├── schema.prisma # User + Product models
└── migrations/
server.js         # Custom HTTP server wrapping Next.js + Socket.IO
```

### Data Models

- **User**: id, name, email (unique), password (bcrypt hash)
- **Product**: id, name, description, price, createdAt

## Key Conventions

- **Dev server**: `server.js` creates a custom HTTP server with Socket.IO attached. Do NOT replace with `next dev` — the chat feature depends on the custom server.
- **API routes**: Use `app/api/*/route.js`. Return `Response.json(...)`. Prisma client is imported per-file (`new PrismaClient()`).
- **Pages**: Client components use `"use client"` directive. Forms use local `useState`. No global state management.
- **Database**: Define models in `prisma/schema.prisma`. After changes run `npx prisma migrate dev`.
- **Auth**: Manual bcrypt hash/compare. No JWT, no sessions, no middleware. User data is not persisted client-side.
- **Path alias**: `@/*` maps to project root (tsconfig paths).

## Gotchas

- No auth middleware — all API routes are unprotected.
- `PrismaClient` is instantiated per-file (not a singleton). For new API routes, import and instantiate inline.
- The `forgot-password` endpoint resets passwords directly without email verification.
- Socket.IO server runs on the same port (3000) as Next.js.
- `DATABASE_URL` env var must be set for Prisma (MySQL connection string).
