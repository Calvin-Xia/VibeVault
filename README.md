# VibeVault

Monorepo for the VibeVault link manager. It ships a Next.js App Router frontend, BullMQ metadata worker, and Prisma database package configured for PostgreSQL and Redis.

## Getting started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `DATABASE_URL`, `REDIS_URL`, and NextAuth provider secrets as needed.

3. **Start databases**
   ```bash
   docker-compose up -d
   ```

4. **Run Prisma migrations and seed**
   ```bash
   pnpm --filter @vibevault/db prisma:generate
   pnpm --filter @vibevault/db prisma:migrate
   pnpm --filter @vibevault/db prisma:seed
   ```

5. **Develop**
   ```bash
   pnpm dev:web
   pnpm dev:worker
   ```
   The web app runs on http://localhost:3000. Metadata jobs are processed by the worker.

## Features
- Authenticated link create/list/update/delete with optimistic UI and NextAuth access control.
- Tag and collection CRUD with filtering, sorting, and quick search chips.
- Masonry-style grid for cards plus a React Flow graph view of tags/collections.
- Metadata polling via BullMQ/undici/cheerio worker queue.
- Import/export JSON endpoints, command palette, drawers/pickers, and pagination-ready lists.
- Prisma models for users, links, tags, collections, visits, jobs, and join tables.

## Workspaces
- `apps/web`: Next.js App Router + Tailwind + shadcn-style primitives + Framer Motion + NextAuth.
- `apps/worker`: BullMQ worker that fetches metadata for new links.
- `packages/db`: Prisma schema and generated client.
- `packages/ui`: Optional shared UI primitives.

## Database schema
See [`packages/db/prisma/schema.prisma`](packages/db/prisma/schema.prisma) and initial migration in [`packages/db/prisma/migrations/0001_init/migration.sql`](packages/db/prisma/migrations/0001_init/migration.sql).
