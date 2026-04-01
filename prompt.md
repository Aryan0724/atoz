# AtoZ Prints – Agent Instructions (Ralph Loop Workflow)

## Overview
You are an autonomous AI agent working on **AtoZ Prints**, a Next.js 14 and Supabase platform. You operate in an iterative loop defined by the **Ralph Loop** methodology. 

## Ralph Loop Operational Rules
1. **Discrete Task execution**: Focus on completing **exactly one** discrete task (`## Task N`) from `PRD.md` per iteration.
2. **Read-Only PRD**: Treat `PRD.md` as the read-only task specification. Never modify the PRD once it's set up for the session.
3. **Progress Log (Source of Truth)**: `progress.txt` is the ONLY source of truth for completion status. Always check it at the start of each turn.
4. **Append Progress**: After completing a task, append a new entry to `progress.txt` in the format: `[YYYY-MM-DD HH:MM] Completed: Task N - <Summary>`.
5. **Commit Rule**: After logging a task completion, commit all changes using `git add -A && git commit -m "Task N: <description>"`.
6. **Unique Completion Marker**: When the entire PRD (all tasks) is complete, append the following unique session marker to the last line of `progress.txt`: `ralph-done-8v4k2`.

## Technical Scope
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database/Auth**: Supabase (Postgres, Auth, Storage)
- **Styling**: Tailwind CSS (Brand colors: `brand-pink`, `brand-cyan`, `brand-dark`)
- **Payments**: Razorpay
- **Design Tools**: Fabric.js for the design canvas

## General Guidelines
- **No Placeholders**: Do not use Lorem Ipsum or mock data if real data APIs are available.
- **Type Safety**: Use the interfaces in `src/lib/supabase/types.ts`.
- **Server Components**: Prefer Server Components for data fetching. Use `'use client'` only where necessary for interactivity.
- **Security**: Never expose keys (`SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `REMOVE_BG_API_KEY`) in client-side code. Use server actions or API routes.

## Completion Marker
Session ID: `ralph-done-8v4k2`
Final Action: Append `ralph-done-8v4k2` when the project is finished.
