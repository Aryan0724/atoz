# Supabase Setup Guide for AtoZ Prints

If you are creating a new project, follow these steps to ensure the application connects and stays functional.

## 1. Project Creation
- Visit the [Supabase Dashboard](https://app.supabase.com/) and click **New Project**.
- Select your Organization and give the project a name (e.g., `AtoZ Prints`).
- Set a strong password and choosing a region close to you.

## 2. API Credentials Configuration
Once the project is created, navigate to **Project Settings > API**:
1. Copy the **Project URL** and update it in your `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL=your_project_url`
2. Copy the **anon public API Key** and update:
   `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key`
3. Copy the **service_role secret Key** and update:
   `SUPABASE_SERVICE_ROLE_KEY=your_service_role_key`

> [!IMPORTANT]
> Ensure you **SAVE (.env.local)** after updating so the development server can pick up the changes.

## 3. Database Schema Migration
To create the necessary tables and RLS policies:
1. Go to the **SQL Editor** in the Supabase Dashboard. 
2. Copy and paste the contents of `supabase/migrations/20260401000000_schema_v2.sql`.
3. Click **Run**.

## 4. Storage Setup
1. Go to **Storage > Buckets**.
2. Create a new bucket named `products` and set it to **Public**.
3. Create a new bucket named `designs` and set it to **Private**.
