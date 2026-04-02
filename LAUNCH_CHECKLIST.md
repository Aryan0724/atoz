# AtoZ Prints - Launch Operations Checklist

Before pointing real DNS traffic to `https://atozprints.in`, run through this deployment flight checklist to ensure robust security and optimal performance.

## 1. Database & Supabase Configuration
- [ ] **Run Final Migrations:** Ensure the two latest SQL files (`20260402000000_reviews_schema.sql` and `20260402000001_pages_schema.sql`) are executed over your live Supabase SQL Editor.
- [ ] **Verify RLS Policies:** Access your Supabase dashboard > Authentication > Policies and ensure policies for `products`, `orders`, `profiles`, and `product_reviews` are perfectly active.
- [ ] **Enable Auth Providers:** Turn on Google Auth in Supabase settings and punch in your Client ID and Secret if you haven't natively stored them in the production branch yet.
- [ ] **Storage Buckets:** Verify that the `designs` and `products` storage buckets are created and public rules are toggled correctly so users can download PDFs without auth locks!

## 2. Secrets & Environment Setup (Vercel)
- [ ] Sync the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Populate `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` with **Live Mode** keys (not testing keys).
- [ ] Inject `REMOVE_BG_API_KEY` with your subscription token. *Background removal will throw internal 500s otherwise.*

## 3. SEO & Aesthetics
- [ ] **Favicon & OG Preview:** Add `og-image.png` and a custom `favicon.ico` / `site.webmanifest` inside the `public/` directory so iMessage links preview beautifully!
- [ ] **Google Search Console**: Go attach your sitemap endpoints to Google Search console post-deployment so your CMS campaigns begin crawling immediately.

## 4. Final Smoke Test
- [ ] Attempt to checkout 1 single mocked item using real banking logic or Razorpay test credentials.
- [ ] Open the Designer Customizer on a smartphone browser and configure the elements with your thumbs.
- [ ] Check `/admin` capabilities on Production deployment to see if Supabase properly filters your admin UID.

#### Built with ❤️ by Antigravity using the Ralph Loop. You are ready for launch!
