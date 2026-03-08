# Sunday Runs

A shared household grocery and errand planning app with realtime sync.

## Features

- Weekly meal planning with recipe management
- Grocery list with store filtering
- Errands tracking
- Realtime sync between household members
- "Who checked" indicators for divide-and-conquer shopping
- Recipe extraction from URLs and photos (AI-powered)
- Email and phone OTP authentication
- PWA for iOS installation

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Realtime)
- **AI:** Claude API for recipe extraction
- **Email:** Resend
- **SMS:** Twilio

## Setup

1. Clone the repo
2. Copy `.env.local.example` to `.env.local` and fill in values:
   - Create a Supabase project and get credentials
   - Set up Resend for email OTP
   - Set up Twilio for SMS OTP (optional)
   - Get an Anthropic API key for recipe extraction

3. Run the database migration:
   - Go to Supabase SQL Editor
   - Run the contents of `supabase/migrations/001_initial_schema.sql`
   - Enable Realtime on `grocery_items` and `errands` tables

4. Configure Supabase Auth:
   - Enable Email OTP provider
   - Enable Phone OTP provider (if using SMS)

5. Install and run:
   ```bash
   npm install
   npm run dev
   ```

## Deploy

Deploy to Vercel:

1. Connect your repository to Vercel
2. Add all environment variables from `.env.local.example`
3. Deploy

## Project Structure

```
src/
├── app/
│   ├── (authenticated)/     # Protected routes
│   │   ├── page.tsx         # Weekly view (home)
│   │   └── recipes/         # Recipe management
│   ├── admin/               # Admin analytics
│   ├── api/                 # API routes
│   └── login/               # Authentication
├── components/              # React components
├── hooks/                   # Custom React hooks
└── lib/                     # Utilities and clients
```
