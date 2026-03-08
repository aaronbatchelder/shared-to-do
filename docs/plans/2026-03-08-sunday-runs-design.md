# Sunday Runs - Design Document

**Date:** 2026-03-08
**Status:** Approved

## Overview

Sunday Runs is a shared household planning app for weekly grocery runs and errands. It solves the chaos of coordinating recipes, grocery lists, and tasks between partners during the weekly Sunday shopping trips.

## Core Problem

- Recipes scattered across bookmarks, cookbooks, websites
- No consolidated grocery list from multiple recipes
- Coordinating who's getting what at multiple stores
- Managing both groceries and other weekly errands

## Target Users

- Couples/households who do weekly shopping together
- Initial users: Aaron + wife, then friends with their partners

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, PWA
- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth with OTP (email via Resend, SMS via Twilio)
- **Realtime:** Supabase Realtime subscriptions
- **AI:** OpenAI/Claude for recipe extraction (URL scraping + photo OCR)
- **Hosting:** Vercel

## Data Model

### Households
The unit of sharing. Partners share one household via shared credentials.
- `id` (uuid, PK)
- `name` (text)
- `created_at` (timestamp)

### Users
Individual accounts linked to a household.
- `id` (uuid, PK)
- `phone` (text, nullable)
- `email` (text, nullable)
- `household_id` (uuid, FK → households)
- `created_at` (timestamp)

### Weeks
The organizing unit for planning.
- `id` (uuid, PK)
- `household_id` (uuid, FK → households)
- `start_date` (date, always a Sunday)
- `created_at` (timestamp)

### Recipes
Saved recipes from URLs, photos, or manual entry.
- `id` (uuid, PK)
- `household_id` (uuid, FK → households)
- `title` (text)
- `source_url` (text, nullable)
- `source_image_url` (text, nullable)
- `ingredients` (jsonb - array of {name, quantity, unit})
- `instructions` (text, nullable)
- `created_at` (timestamp)

### Week_Recipes
Junction table linking recipes to weeks.
- `week_id` (uuid, FK → weeks)
- `recipe_id` (uuid, FK → recipes)
- PK: (week_id, recipe_id)

### Grocery_Items
Individual items on the grocery list.
- `id` (uuid, PK)
- `week_id` (uuid, FK → weeks)
- `name` (text)
- `quantity` (numeric, nullable)
- `unit` (text, nullable)
- `store` (text - e.g., "Costco", "Trader Joe's", custom)
- `recipe_id` (uuid, FK → recipes, nullable - null means manually added)
- `checked` (boolean, default false)
- `checked_by_user_id` (uuid, FK → users, nullable)
- `created_at` (timestamp)

### Errands
Non-grocery tasks for the week.
- `id` (uuid, PK)
- `week_id` (uuid, FK → weeks)
- `title` (text)
- `store` (text, nullable)
- `checked` (boolean, default false)
- `checked_by_user_id` (uuid, FK → users, nullable)
- `created_at` (timestamp)

## Core User Flows

### Authentication
1. Enter email or phone number
2. Receive OTP via Resend (email) or Twilio (SMS)
3. Enter 6-digit code
4. New user → create household + user → land on "This Week"
5. Existing user → land on "This Week"
6. Partner uses same credentials (shared household)

### Recipe Adding
1. Tap "Add Recipe" → choose: URL, Photo, or Manual
2. **URL:** Paste link → scrape + AI extracts ingredients → confirm/edit → save
3. **Photo:** Upload/take photo → OCR + AI extracts ingredients → confirm/edit → save
4. **Manual:** Enter title + ingredients directly → save
5. Recipe saved to household library

### Weekly Planning
1. Default view: "This Week" (Sunday-Saturday)
2. Navigate between weeks
3. Add recipes from library to week
4. Ingredients auto-populate to grocery list
5. Edit quantities, assign stores, add manual items
6. Add errands

### Shopping (Realtime Sync)
1. Filter grocery list by store or view all
2. Tap to check off items → realtime sync to partner
3. See indicator showing who checked what
4. Errands section for non-grocery tasks

## MVP Scope

### In MVP
- OTP auth (email + phone)
- Household with shared login
- Weekly view with navigation
- Add recipes (URL, photo, manual)
- Auto-generated grocery list from recipes
- Manual grocery items + errands
- Store tagging + filtering
- Realtime sync with "who's checking" indicators
- Basic PWA (installable on iOS)
- Admin analytics dashboard (usage metrics for product insight)

### NOT in MVP
- Recipe suggestions/recommendations
- Social sharing between households
- Past week analytics for users
- Specific day meal planning (just weekly buckets)

## Success Criteria

1. Aaron + wife can plan a full week's groceries in under 10 minutes
2. Realtime sync works reliably at the store
3. Recipe extraction from URLs works for major recipe sites
4. Photo OCR successfully extracts ingredients from cookbook pages
5. PWA feels native on iOS

## Open Questions (to resolve during build)

- Specific recipe sites to prioritize for scraping
- Default store list vs fully custom
- Photo storage approach (Supabase Storage vs external)
