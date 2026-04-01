# AtoZ Prints – Launch Readiness Checklist 🚀

This document summarizes the final state of the platform and the steps required for a successful production deployment.

## 🟢 Technical Implementations Completed

### 🔐 Authentication & Access
- [x] **Supabase Auth Integration**: Full login/register flow with role-based routing.
- [x] **Admin Guard**: Layout-level protection for `/admin` routes.
- [x] **Logout Functionality**: Wired to `signOut()` in Admin Sidebar, Dashboard, and Navbar.
- [x] **User Dashboard**: Fully functional profile and address management.

### 👕 Product & Catalog
- [x] **Live Database Sync**: Homepage and Catalog fetch directly from Supabase `products` table.
- [x] **Mock Fallback**: Robust error handling ensuring the site never appears "empty."
- [x] **SEO Optimization**: Metadata and Open Graph tags added to all major public routes.

### 🎨 Design Studio (Canvas)
- [x] **Export PNG**: Direct design downloads for users.
- [x] **Cloud Save**: Designs automatically uploaded to Supabase Storage (`designs/` bucket) on cart addition.
- [x] **Background Removal**: Fully wired to a server-side API bridge (requires key).

### 💳 Checkout & Operations
- [x] **Razorpay Bridge**: Integrated payment flow with order persistence.
- [x] **Auto-fill**: Checkout forms pre-populated from saved user profiles.
- [x] **Admin CMS**: Fully wired CRUD interface for managing site pages and campaigns.

---

## 🟡 Required configuration (Environment Variables)

Ensure these are set in your production environment (Vercel/Cloudflare):

| Variable | Status | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Set | API Connection |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Set | Client Operations |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Pending | Admin Mutations (Safe Server-side) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ⚠️ Pending | Real Payments (currently mock) |
| `REMOVE_BG_API_KEY` | ⚠️ Pending | Background Removal API |

---

## 🧪 Final Manual QA Flight Plan

### 1. The Customer Journey
- [ ] **Registration**: Create a new account → Verify profile exists in Supabase.
- [ ] **Design**: Customize a product → Download PNG → Add to Cart.
- [ ] **Checkout**: Proceed to pay → Verify auto-fill works → Success redirect.
- [ ] **History**: Check "My Orders" in the dashboard.

### 2. The Admin Journey
- [ ] **Login**: Access `/admin` as an admin user.
- [ ] **CMS**: Create a new "Campaign" content → Verify it saves.
- [ ] **Products**: Edit an existing product price → Check public listing.
- [ ] **Orders**: View the order list → Confirm the new test order is tracked.

### 3. Mobile Fluidity
- [ ] **Navigation**: Test mobile menu and cart drawer.
- [ ] **Designer**: Ensure tools are accessible on small screens.
- [ ] **Checkout**: Verify the summary stickiness and form fields.

---

> [!IMPORTANT]
> **Storage Bucket Permission**: Ensure the `designs` bucket in Supabase Storage has "Public" read access or appropriate RLS policies to allow users to view their design previews.

> [!TIP]
> **SEO Check**: Use [SocialSharePreview.com](https://socialsharepreview.com) to verify how product links will look on WhatsApp/Slack/Twitter.
