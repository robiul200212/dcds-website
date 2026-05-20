# DCDS Website — Next.js + Supabase

## Dhaka College Debating Society

A world-class, production-ready debate club management platform built with Next.js 14 and Supabase.

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
# Fill in your Supabase URL and keys
```

### 3. Run the database migrations
- Go to your Supabase project → SQL Editor
- Copy and run `supabase/migrations/001_initial_schema.sql`

### 4. Run locally
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📖 Deployment Guide
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for full step-by-step instructions.

## 🛠 Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Animations**: Framer Motion
- **UI**: Lucide React icons
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Hosting**: Vercel (free)

## 📁 Project Structure
```
dcds-website/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── about/              # About page
│   ├── ec-committee/       # EC Committee
│   ├── events/             # Events & Fests
│   ├── articles/           # Articles & Blog
│   ├── notices/            # Notice Board
│   ├── gallery/            # Photo Gallery
│   ├── contact/            # Contact Us
│   ├── auth/               # Login & Register
│   ├── dashboard/          # Member Dashboard
│   └── admin/              # Admin Panel
├── components/             # Reusable components
│   ├── layout/             # Navbar, Footer
│   ├── home/               # Homepage sections
│   ├── dashboard/          # Member dashboard components
│   └── admin/              # Admin components
├── lib/                    # Utilities
│   ├── supabase/           # Supabase client
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Helper functions
├── supabase/
│   └── migrations/         # Database SQL files
├── public/                 # Static files (logo.png, etc.)
├── .env.local.example      # Environment variables template
└── DEPLOYMENT_GUIDE.md     # Full deployment instructions
```

## 👤 Default Roles
| Role | Access |
|---|---|
| `super_admin` | Full control |
| `admin` | Most admin functions |
| `office_secretary` | Attendance + notices |
| `member` | Dashboard only |

## 📜 License
© Dhaka College Debating Society. All rights reserved.
