# Next.js 16 e-commerce starter

**Next.js 16 / React 19** — APIs and conventions may differ from training data. Read `node_modules/next/dist/docs/` before writing code.

**Prisma v7 (MariaDB driver adapter)** — NOT the traditional `@prisma/client`. Import from `../../generated/prisma/client` (or via `src/lib/prisma.ts` singleton). Config lives in `prisma.config.ts`. Run `npx prisma generate` after pulling (output is gitignored at `/generated/prisma`).

**Tailwind v4** — No `tailwind.config.js`. Uses `@tailwindcss/postcss` plugin. Config via `@theme` directives in CSS. Theme tokens defined in `globals.css` using OKLCH.

**shadcn/ui** — `components.json` uses `"style": "radix-luma"` and `"iconLibrary": "remixicon"`. UI primitives in `src/components/ui/`.

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Dev server on `localhost:3000` |
| `npm run build` | Next.js production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run seed` | Prisma DB seed |

No test or typecheck scripts exist (`npm run lint` is the only verification).

## Architecture

```
src/
  app/
    (front)/       — Public routes (/, /course, /product, /cart, /about)
    (auth)/        — Auth routes (/login, /signup)
    api/auth/[...all]/ — Better-auth handler
    globals.css    — Tailwind v4 imports + theme
  components/      — Shared components (navbar, hero, features)
  components/ui/   — shadcn UI primitives
  lib/
    prisma.ts      — Prisma client singleton (MariaDB adapter, global cached in dev)
    auth.ts        — Better-auth server config
    auth-client.ts — Better-auth browser client
    cart-store.ts  — Zustand cart store (persisted to localStorage key `skill-cart`)
    utils.ts       — cn() helper (clsx + tailwind-merge)
    api/course.ts  — External API client (codingthailand.com)
```

`@/*` maps to `src/*`.

## Route groups

`(front)/layout.tsx` and `(auth)/layout.tsx` are both root-level layouts (each starts `<html>`). The active one depends on which route group matches. Both import `globals.css`. `(front)` uses `lang="th"` with system sans-serif; `(auth)` uses Prompt font for Thai text.

## DB

Requires MariaDB. Connection string in `.env` (`DATABASE_URL`). Docker setup in `../docs/`. The `npm run seed` command runs `tsx prisma/seed.ts`.

## Quirks

- **Dynamic routes** use `await connection()` from `next/server` to signal dynamic rendering (course and product pages).
- **Login page broken link** — `src/app/(auth)/login/page.tsx:127` links to `/register`, but the signup route is `/signup`.
- **Product images** — Served from `public/product-image/`. Code references `/product-image/{name}` and falls back to `/product-image/nopic.png`.
- **Docker build** — Uses `output: "standalone"` output (copies `.next/standalone`), but `next.config.ts` does NOT set `output: "standalone"` — will fail if not set via env or added.

## ข้อกำหนดหลัก
-แยก Typescript type ทุกอย่างออกไปไว้ที่โฟลเดอร์ src/types
-การตั้งชื่อไฟล์ Typescript(.ts) ให้ตั้งตามตัวอย่างนี้ คือ course-service.ts
-ห้ามใช้คำสั่ง npx prosma db push
