# AtoZ Prints – Agent Instructions

## Project Context
You are working on **AtoZ Prints**, a B2B/B2C print-on-demand platform built with:
- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Postgres, Auth, Storage)
- **Tailwind CSS** with a custom design system (`brand-pink`, `brand-cyan`, `brand-dark`)
- **Fabric.js** for the design canvas
- **Razorpay** for payments
- **Framer Motion** for animations

## General Rules
1. **Never break existing functionality.** Read files before editing them.
2. **Prefer server components** for data fetching; use `'use client'` only where interactivity is needed.
3. **Use the Supabase server client** (`src/lib/supabase/server.ts`) in Server Components and API routes. Use the browser client (`src/lib/supabase/client.ts`) only in Client Components.
4. **Follow the existing design system.** Do not introduce new color values or CSS not already in `tailwind.config.ts` or `globals.css`. Use `brand-pink`, `brand-cyan`, `brand-dark` consistently.
5. **Type safety.** Use the interfaces in `src/lib/supabase/types.ts`. Do not use `any` unless strictly necessary.
6. **Commit after every task.** Run `git add -A && git commit -m "Task N: <description>"` after completing each task.
7. **Check `progress.txt`** at the start of each iteration to see what has already been done. Only work on the next incomplete task.
8. **Append progress entries** to `progress.txt` as you start and complete work. Never delete existing entries.

## Environment Variables (already in .env.local)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`
- `REMOVE_BG_API_KEY`

## Key File Paths
- Admin dashboard: `src/app/admin/page.tsx`
- Admin layout (auth gate): `src/app/admin/layout.tsx`
- Product pages: `src/app/(public)/products/`
- Customize canvas: `src/app/(public)/customize/[slug]/`
- Design canvas component: `src/components/design/DesignerCanvas.tsx`
- Supabase types: `src/lib/supabase/types.ts`
- Cart store: `src/lib/store/useCart.ts`
- Mock data (dev only): `src/lib/data/mockProducts.ts`
