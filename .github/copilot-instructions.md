# LocalEats App

Simplified Uber Eats-style web app. UI is in **Spanish**.

## Tech Stack

- **Next.js 16** (App Router) with React 19
- **Prisma 5** + MySQL
- **Socket.IO** for real-time chat/support
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

No test framework is configured.

## Architecture

```
server.js (port 3000)
├── Next.js App (HTTP request handler)
└── Socket.IO Server (real-time support chat via WebSocket rooms)
```

`server.js` creates a custom HTTP server. Socket.IO listens on the same port and uses room-based messaging (`conversation-{id}`). Do NOT replace with `next dev` — the support chat depends on this custom server.

### Data Models (prisma/schema.prisma)

- **User**: id, name, email (unique), password (bcrypt), role (default "user")
- **Product**: id, name, description, price, imageUrl?, available, userId? → User
- **Conversation**: id, subject, status (default "open") → Messages[]
- **Message**: id, content, senderRole, userId? → User, conversationId → Conversation

### Key Relationships

- A User owns Products and sends Messages.
- A Conversation groups Messages; Socket.IO rooms map 1:1 to conversations.

## Key Conventions

- **API routes**: `app/api/*/route.js`. Return `Response.json(...)`. Instantiate `new PrismaClient()` per-file (not a singleton).
- **Pages**: Client components use `"use client"` + local `useState`. No global state management.
- **Auth**: Manual bcrypt hash/compare. No JWT, no sessions, no middleware — all API routes are unprotected.
- **Real-time**: Socket.IO events use `join-conversation` and `support-message`. The server broadcasts to room `conversation-{id}`.
- **Path alias**: `@/*` maps to project root (tsconfig paths).
- **Database changes**: Edit `prisma/schema.prisma`, then run `npx prisma migrate dev`.

## Gotchas

- `PrismaClient` is instantiated per-file. For new API routes, import and instantiate inline.
- The `forgot-password` endpoint resets passwords directly — no email verification.
- `DATABASE_URL` env var must be set (MySQL connection string).
- Socket.IO server shares port 3000 with Next.js.
- No auth middleware — anyone can call any API endpoint.
