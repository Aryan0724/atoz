# PRD: AtoZ Prints – Print-on-Demand Platform (Ralph Loop Edition)

## Overview
AtoZ Prints is a B2B/B2C print-on-demand platform. This document defines discrete, atomic tasks for autonomous agent execution via the Ralph Loop methodology.

**Stack:** Next.js 14, TypeScript, Tailwind, Supabase, Razorpay, Fabric.js.

---

## Task 1: Supabase Schema – Audit & Migration
Complete the Supabase schema and align with TypeScript types.
- Ensure `profiles`, `products`, `orders`, and `order_items` match `src/lib/supabase/types.ts`.
- Enable RLS for all tables.
- Write a new migration: `supabase/migrations/20260401000000_schema_v2.sql`.

## Task 2: Authentication – Login Page Integration
Wire the login form to real Supabase Auth.
- Update `src/app/(public)/login/page.tsx` to use `supabase.auth.signInWithPassword`.
- Implement role verification against the `profiles` table after sign-in.
- Redirect correctly based on role (admin -> `/admin`, customer -> `/dashboard`).

## Task 3: Authentication – Registration & Profile Creation
Wire the registration form to real Supabase Auth.
- Update `src/app/(public)/register/page.tsx` to use `supabase.auth.signUp`.
- Ensure a profile record is created in the `profiles` table upon successful registration.

## Task 4: Authentication – Admin Access Gating
Implement server-side auth checking for the admin area.
- In `src/app/admin/layout.tsx`, use `supabase.auth.getUser()` server-side.
- Redirect to `/login` if unauthenticated.
- Verify `role == 'admin'` and redirect to `/dashboard` if not authorized.
- Remove all demo/mock bypass logic.

## Task 5: Authentication – User Access Gating & Logout
Implement access gating for the user dashboard and global logout.
- In `src/app/(user)/dashboard/layout.tsx` (or similar), gate access for authenticated users.
- Implement working "Logout" buttons in both admin sidebar and user dashboard using `supabase.auth.signOut()`.

## Task 6: Product Catalog – Public Listing (Supabase)
Switch the product listing page to live Supabase data.
- Update `src/app/(public)/products/page.tsx` to query the `products` table directly.

## Task 7: Product Detail – Dynamic Fetching (Supabase)
Switch the product detail page to live Supabase data.
- Update `src/app/(public)/products/[slug]/page.tsx` to fetch single product data by slug from Supabase.

## Task 8: Admin Products – List & Delete
Implement the admin product list view with deletion capability.
- In `src/app/admin/products/page.tsx`, fetch products from Supabase and add working "Delete" buttons.

## Task 9: Admin Products – Add & Image Upload
Implement the "Add Product" flow with Supabase Storage.
- Build the `handleSubmit` logic in `src/app/admin/products/add/page.tsx`.
- Handle image uploads to the `products` storage bucket.

## Task 10: Admin Products – Edit & Update
Implement the "Edit Product" flow.
- Build the fetch and update logic in `src/app/admin/products/edit/[slug]/page.tsx`.
- Support updating existing product data and images.

## Task 11: Checkout – Persistence & Persisting Orders
Save orders to Supabase after payment success.
- In `src/app/(public)/checkout/page.tsx`, insert records into `orders` and `order_items` tables after Razorpay success.

## Task 12: Order History – User & Admin Views
Wire the order history views to live Supabase queries.
- Update `src/app/(user)/dashboard/page.tsx` and `src/app/admin/orders/page.tsx` to show real transaction history.

## Task 13: Design Canvas – Canvas Export Logic
Finalize design export features.
- Implement "Download Design" (PNG) and "Save Design" (serialize JSON to Supabase Storage) in `DesignerCanvas.tsx`.

## Task 14: Design Canvas – Unsplash Integration
Finish the stock image search feature.
- Ensure the Unsplash API integration in the `AddTab` component is functional and uses secure environment variables.

## Task 15: Razorpay – Order Creation & Verification
Finalize the payment backend.
- Ensure `src/app/api/razorpay/route.ts` and `src/app/api/razorpay/verify/route.ts` correctly handle order creation and signature validation.

## Task 16: User Dashboard – Profile & Address Management
Complete the customer dashboard features.
- Implement profile updates and shipping address management (address book) in the user dashboard.

## Task 17: Admin CMS – Markdown Page Management
Build the CMS for static pages.
- Implement CRUD for the `pages` table in the admin panel and wire the public static pages to fetch from this table.

## Task 18: Remove Background – API Integration
Finish the background removal tool.
- Integrate the `remove-bg` API into the design canvas tools.

## Task 19: SEO & Performance Audit
Optimize the platform for production.
- Implement metadata generation, dynamic imports, and SEO best practices.

## Task 20: Mobile Responsiveness & Final Polish
Perform a full mobile audit and fix layout issues on small viewports.

## Task 21: End-to-End Testing & Launch Checklist
Verify the complete customer and admin journeys and create `LAUNCH_CHECKLIST.md`.
