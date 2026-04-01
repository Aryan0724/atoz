# PRD: AtoZ Prints – Print-on-Demand Platform

## Overview
AtoZ Prints is a B2B/B2C print-on-demand platform built with Next.js 14, Supabase, and Razorpay. It features a live design canvas (Fabric.js), product catalog, order management, and a full admin CMS. The goal of this PRD is to complete all outstanding features, wire up all mock data to real Supabase tables, harden authentication, and ship a production-ready platform.

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (Postgres + Auth + Storage), Razorpay, Fabric.js, Framer Motion.

**Key Directories:**
- `src/app/(public)/` – Public-facing pages (home, products, pricing, etc.)
- `src/app/(user)/dashboard/` – Authenticated user dashboard
- `src/app/admin/` – Admin panel (dashboard, products, orders, customers, CMS)
- `src/app/api/` – API routes (Razorpay, remove-bg)
- `src/components/design/` – Design canvas components
- `src/lib/supabase/` – Supabase client, server, types, storage helpers
- `src/lib/data/` – Static/mock data files (mockProducts, canvasTemplates, podGraphics, icons)
- `src/lib/store/` – Zustand cart store
- `supabase/migrations/` – DB schema + seed SQL

---

## Task 1: Supabase Schema – Finalize & Migrate
Ensure the Supabase schema is complete and matches all TypeScript types. All tables used in the codebase must exist.

- Audit `supabase/migrations/20240315000000_initial_schema.sql` against `src/lib/supabase/types.ts` interface definitions (`Product`, `Order`, `OrderItem`, `Profile`).
- Add any missing columns: `quality_levels`, `customization_fields`, `packaging_options`, `template_images`, `supported_views`, `is_active` on the `products` table.
- Add `phone` and `role` columns to the `profiles` table.
- Create an `order_items` table if it does not exist with all fields from the `OrderItem` interface.
- Enable Row Level Security (RLS) policies for all tables: public read for `products`, authenticated read/write for `orders` and `order_items`, and admin-only write for `products`.
- Write the changes as a new migration file: `supabase/migrations/20260401000000_schema_v2.sql`.

---

## Task 2: Authentication – Real Supabase Auth Integration
Replace all demo/mock auth logic with real Supabase Auth flows.

- In `src/app/(public)/login/page.tsx`, wire the login form to `supabase.auth.signInWithPassword`. Show proper error messages on failure.
- In `src/app/(public)/register/page.tsx`, wire the registration form to `supabase.auth.signUp`. After sign-up, create a matching row in the `profiles` table via an upsert.
- In the admin layout (`src/app/admin/layout.tsx`), gate access using `supabase.auth.getUser()` server-side. Redirect unauthenticated users to `/login`. Check that the user's profile has `role = 'admin'`; if not, redirect to `/dashboard`.
- In the user layout (under `src/app/(user)/`), gate access similarly — redirect to `/login` if no session.
- Add a working logout button/action to both admin sidebar and user dashboard nav that calls `supabase.auth.signOut()`.
- Remove the demo bypass login comment block in `src/app/admin/layout.tsx` or any middleware referencing it; replace with the real auth check.

---

## Task 3: Product Catalog – Connect to Supabase
Switch the product listing and detail pages from `mockProducts` to live Supabase queries.

- In `src/app/(public)/products/page.tsx`, replace the import of `mockProducts` with a server-side Supabase query: `supabase.from('products').select('*').eq('is_active', true)`.
- In `src/app/(public)/products/[slug]/page.tsx`, fetch the single product by slug from Supabase instead of filtering from the mock array.
- In `src/app/(public)/customize/[slug]/page.tsx`, fetch the product for the canvas from Supabase by slug.
- Update `generateStaticParams` (or remove it) to use `supabase.from('products').select('slug')` instead of the mock data array.
- Keep `mockProducts.ts` as a fallback for dev/preview only but clearly mark it as `// DEV ONLY`.
- Ensure the `next.config.mjs` has Supabase Storage domain whitelisted in `images.remotePatterns` so product images from storage render correctly.

---

## Task 4: Admin Products CRUD – Full Implementation
Complete the admin product management screens so admins can create, edit, and delete products in Supabase.

- In `src/app/admin/products/page.tsx`, replace any mock data with a live `supabase.from('products').select('*')` query. Show a loading skeleton while fetching. Add a delete button per row that calls `supabase.from('products').delete().eq('id', id)` with a confirmation dialog.
- In `src/app/admin/products/add/page.tsx`, implement `handleSubmit` to call `supabase.from('products').insert(formData)`. Handle image upload to Supabase Storage (`products` bucket) and store the returned public URL array in `images`.
- In `src/app/admin/products/edit/[slug]/page.tsx`, on mount fetch the product by slug from Supabase. On form submit call `supabase.from('products').update(formData).eq('slug', slug)`. Handle image replacement similarly.
- After a successful insert/update/delete, redirect to `/admin/products` and show a toast notification.
- Fix any existing client-side errors in the edit flow (null reference guards, missing field checks).

---

## Task 5: Order Management – Connect & Enhance
Wire orders throughout the stack — checkout creation, user dashboard display, and admin order management.

- In `src/app/(public)/checkout/page.tsx`, after Razorpay payment success, call `supabase.from('orders').insert({...})` and `supabase.from('order_items').insert([...])` to persist the order. Redirect to `/order-success?id=<order_id>`.
- In `src/app/(public)/order-success/page.tsx`, read the `id` query param and display the real order details fetched from Supabase.
- In `src/app/(user)/dashboard/page.tsx`, fetch the authenticated user's orders: `supabase.from('orders').select('*, order_items(*, products(name, images))').eq('user_id', userId)`. Display them in the orders list.
- In `src/app/admin/orders/page.tsx`, fetch all orders with user profile join. Add status update dropdown per order that calls `supabase.from('orders').update({ status }).eq('id', id)`.
- In `src/lib/supabase/orderActions.ts`, ensure `createOrder`, `getUserOrders`, and `updateOrderStatus` functions are complete and exported correctly.

---

## Task 6: Design Canvas – Fabric.js Integration & Export
Finish the design canvas so users can customize products and export their design.

- In `src/components/design/DesignerCanvas.tsx`, ensure the Fabric.js canvas initializes correctly with the product's `template_images[0]` as the background.
- Implement the "Download Design" button: use `canvas.toDataURL('image/png')` and trigger a browser download.
- Implement the "Save Design" action: serialize canvas JSON via `canvas.toJSON()` and store it in Supabase Storage under `designs/<userId>/<orderId>.json`. Save the storage URL back to `order_items.design_data`.
- In `src/components/design/controls/tabs/`, ensure all tab components (Templates, Add, Edit, Layers, Product) are wired to the canvas state via the existing hooks (`useCanvasHistory`, `useCanvasActions`, `useCanvasGestures`).
- In the `AddTab`, ensure the Unsplash stock image search is functional: use the `/api/unsplash` route (or direct client-side call with env key `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`) to fetch and insert images into the canvas.
- Test that undo/redo (`useCanvasHistory`) works for add, move, delete, and style operations.

---

## Task 7: Razorpay Payment Integration – Complete Flow
Finalize the Razorpay checkout so real payments can be processed end-to-end.

- In `src/app/api/razorpay/route.ts`, ensure the `POST` handler creates a Razorpay order using `razorpay.orders.create({ amount, currency: 'INR', receipt })` using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` from env.
- In the checkout page, after `fetch('/api/razorpay', { method: 'POST', body: ... })`, open the Razorpay checkout modal with the returned `order_id` and `amount`.
- On `payment.captured` success callback, call the order persistence logic from Task 5.
- Add a `src/app/api/razorpay/verify/route.ts` endpoint that validates the Razorpay payment signature using `crypto.createHmac` before persisting the order.
- Ensure `NEXT_PUBLIC_RAZORPAY_KEY_ID` is available client-side and `RAZORPAY_KEY_SECRET` stays server-only.

---

## Task 8: User Dashboard – Complete Features
Build out the customer-facing dashboard with orders, profile management, and saved designs.

- In `src/app/(user)/dashboard/page.tsx`, implement tab sections: Overview, My Orders, Saved Designs, Profile Settings.
- Overview tab: show order count, total spent, last order date.
- My Orders tab: list all past orders (from Task 5) with status badges and a "Reorder" button.
- Saved Designs tab: list designs saved to Supabase Storage, with a thumbnail preview and a "Customize Again" link to `/customize/[slug]`.
- Profile Settings tab: show a form pre-filled with `full_name`, `email`, `phone`. On submit, call `supabase.from('profiles').update({...}).eq('id', userId)`. Support avatar upload to Supabase Storage (`avatars` bucket).
- Add a working address book section: allow users to add/remove shipping addresses stored in `profiles.addresses` (JSONB array).

---

## Task 9: Admin CMS – Pages & Blog Management
Implement the CMS section of the admin panel for managing static content.

- Create a `pages` table in Supabase (via migration) with fields: `id`, `slug`, `title`, `content` (rich text / markdown string), `is_published`, `updated_at`.
- In `src/app/admin/cms/page.tsx`, list all CMS pages from Supabase with edit/delete actions.
- In `src/app/admin/cms/edit/[slug]/page.tsx`, build a markdown editor (use `react-simplemde-editor` or a `<textarea>` with preview) that loads and saves page content to Supabase.
- Wire the public-facing static pages (`/about`, `/faq`, `/privacy`, `/terms`, `/shipping`, `/returns`) to fetch their content from this `pages` table via slug instead of hard-coded JSX.

---

## Task 10: Remove Background API – Complete Integration
Finish the `remove-bg` API route and integrate it into the design canvas.

- In `src/app/api/remove-bg/route.ts`, implement the `POST` handler using the `REMOVE_BG_API_KEY` env variable to call `https://api.remove.bg/v1.0/removebg`. Accept a base64 image, return the processed image as base64.
- In the design canvas Add tab (or Edit tab), add a "Remove Background" button that appears when an image element is selected on the canvas. On click, send the selected image dataURL to `/api/remove-bg`, receive the result, and replace the canvas image element's `src` with the cleaned image.
- Show a loading spinner on the button while the API call is in progress.
- Handle errors gracefully (e.g., API quota exceeded → show a toast "Background removal unavailable").

---

## Task 11: Performance & SEO Optimization
Optimize the platform for production: bundle size, image loading, and SEO metadata.

- Convert all large static data imports (`podGraphics.ts`, `icons.ts`) to dynamic imports using `React.lazy` or Next.js `dynamic()` so they don't block initial page load.
- Add `generateMetadata` functions to all public pages: home, products listing, product detail, pricing, about, contact.
- Add Open Graph image support using the existing `src/app/opengraph-image.tsx` generator.
- Configure `next.config.mjs` with proper `images.remotePatterns` for Supabase Storage, Unsplash (`images.unsplash.com`), and any other external image hosts.
- Add a `robots.txt` and `sitemap.xml` via Next.js route handlers.
- Run `npm run build` and resolve any TypeScript or ESLint errors until the build succeeds with zero errors.

---

## Task 12: Mobile Responsiveness Audit & Polish
Ensure every page is fully responsive and polished on mobile.

- Audit each public-facing page on a 375px viewport. Fix layout overflow, oversized buttons, or truncated text.
- Verify `src/components/layout/MobileBottomNav.tsx` is shown only on `md` and below and that all nav links work.
- Ensure the design canvas (`/customize/[slug]`) is usable on mobile: pinch-to-zoom on canvas, bottom toolbar for tools, swipeable side panels.
- Test the checkout flow end-to-end on a mobile viewport to ensure the Razorpay modal opens correctly.
- Polish the admin panel so it is at minimum navigable on a tablet (`lg` breakpoint); sidebar should collapse to an icon-only rail.

---

## Task 13: End-to-End Testing & Bug Fixes
Run the full user journey and fix all remaining bugs before launch.

- Test the full customer journey: Register → Browse Products → Customize → Checkout → Order Confirmation → Dashboard.
- Test the full admin journey: Login → Create Product → View Orders → Update Order Status → Edit CMS Page.
- Fix the `setLoading(false)` bug in `src/app/admin/page.tsx` (the happy path fetch never calls `setLoading(false)` after setting stats).
- Ensure all `TODO` and `// placeholder` comments are resolved or tracked.
- Run `npm run build` one final time with zero TypeScript errors, zero ESLint errors, and a successful production build output.
- Create a `LAUNCH_CHECKLIST.md` in the project root documenting: env vars required, Supabase project setup steps, Razorpay key configuration, and deployment steps to Vercel.
