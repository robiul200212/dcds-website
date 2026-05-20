# 🚀 DCDS Website — Complete Deployment Guide
## For Non-Technical Users | 100% FREE Deployment

> **No coding experience needed!** Follow every step carefully and your website will be live in about 30–45 minutes.

---

## 📋 What You Need (All Free)
- A computer with internet access
- An email address
- Your club logo saved as `logo.png`
- About 45 minutes of your time

---

## STEP 1: Create a GitHub Account & Upload Code

GitHub is where your website's code will be stored (like Google Drive, but for code).

### 1.1 — Create GitHub Account
1. Go to **https://github.com**
2. Click **"Sign up"**
3. Enter your email, create a password, choose a username
4. Verify your email

### 1.2 — Create a New Repository (folder)
1. After logging in, click the **"+"** button (top right)
2. Select **"New repository"**
3. Name it: `dcds-website`
4. Make sure **"Public"** is selected
5. Click **"Create repository"**

### 1.3 — Upload Files
1. In your new repository, click **"uploading an existing file"**
2. Open the `dcds-website` folder on your computer (`C:\Users\user\.gemini\antigravity\scratch\dcds-website`)
3. Select ALL files and folders, drag them to the GitHub upload area
4. Scroll down, type commit message: `Initial DCDS website`
5. Click **"Commit changes"**

> ✅ **Your code is now on GitHub!**

---

## STEP 2: Set Up Supabase (Your Database & Backend)

Supabase is your free database. It stores all member data, attendance, articles, etc.

### 2.1 — Create Supabase Account
1. Go to **https://supabase.com**
2. Click **"Start your project"** → **"Sign Up"**
3. Sign up with GitHub (recommended — easiest)

### 2.2 — Create a New Project
1. Click **"New project"**
2. **Organization**: Keep the default
3. **Project Name**: `dcds-website`
4. **Database Password**: Create a STRONG password (save it somewhere!)
5. **Region**: `Southeast Asia (Singapore)` — closest to Bangladesh
6. Click **"Create new project"** (takes 2-3 minutes to set up)

### 2.3 — Run the Database Schema
This creates all the tables your website needs.

1. In your Supabase project, click **"SQL Editor"** (left sidebar, looks like `</>`)
2. Click **"+ New query"**
3. Open the file `supabase/migrations/001_initial_schema.sql` from your project folder
4. Copy ALL the text from that file
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** (▶️ button)
7. You should see: **"Success. No rows returned"**

> ✅ **Your database is set up!**

### 2.4 — Create Storage Bucket
This stores photos and payment screenshots.

1. In Supabase, click **"Storage"** (left sidebar)
2. Click **"Create a new bucket"**
3. Name: `dcds-media`
4. Make it **Public** (toggle ON)
5. Click **"Create bucket"**

### 2.5 — Get Your Supabase Keys
1. In Supabase, click **"Project Settings"** (gear icon, left sidebar)
2. Click **"API"**
3. You'll see two important values:
   - **Project URL** → looks like `https://abcdefgh.supabase.co`
   - **anon public key** → very long text starting with `eyJ...`
4. **Copy both** — you'll need them in Step 4

> ⚠️ **NEVER share your `service_role` key publicly!**

---

## STEP 3: Set Up Vercel (Free Hosting)

Vercel hosts your website for free with automatic HTTPS.

### 3.1 — Create Vercel Account
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (same GitHub account from Step 1)
4. Authorize Vercel to access your GitHub

### 3.2 — Import Your Project
1. Click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories listed
3. Find `dcds-website` and click **"Import"**
4. Vercel will auto-detect it's a Next.js project ✅
5. **DO NOT click Deploy yet** — first set environment variables!

---

## STEP 4: Set Environment Variables

Environment variables are secret settings your website needs to connect to Supabase.

### 4.1 — Add Variables in Vercel
In the import screen, scroll down to **"Environment Variables"** section.

Add these one by one (click **"+ Add"** for each):

| Variable Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL (from Step 2.5) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key (from Step 2.5) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project-name.vercel.app` |
| `NEXT_PUBLIC_SITE_NAME` | `Dhaka College Debating Society` |

> 💡 You'll update `NEXT_PUBLIC_SITE_URL` after you know your Vercel URL. For now put anything.

### 4.2 — Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes (you'll see a build progress bar)
3. When done, you'll see **"Congratulations!"** 🎉
4. Your site is now live at `https://dcds-website.vercel.app` (or similar)

---

## STEP 5: Upload Your Club Logo

1. In your GitHub repository, go to the `public` folder
2. Click **"Add file"** → **"Upload files"**
3. Upload your `logo.png` file
4. Commit the change
5. Vercel will automatically redeploy with your logo (takes ~2 minutes)

---

## STEP 6: Create Your First Admin Account

### 6.1 — Register on the Website
1. Go to your live website
2. Click **"Join DCDS"**
3. Fill in your details and complete registration

### 6.2 — Manually Set Yourself as Super Admin
1. Go to your Supabase project
2. Click **"SQL Editor"** → **"+ New query"**
3. Type (replace with YOUR email):
```sql
UPDATE profiles 
SET role = 'super_admin', 
    membership_status = 'active' 
WHERE email = 'your-email@example.com';
```
4. Click **"Run"**

> ✅ **You are now a Super Admin!** Log in and access `/admin` to manage everything.

---

## STEP 7: Configure Your Website Content

Now that you're admin, log in and configure:

1. **Go to `/admin`** → Executive Committee → Add all EC members
2. **Go to `/admin/notices`** → Create your first welcome notice
3. **Go to `/admin`** → Speeches → Add Principal's speech and Moderator speeches
4. **Go to `/admin/events`** → Add past fests and upcoming events
5. **Go to `/admin/gallery`** → Upload club photos

---

## STEP 8: Set Up Email Notifications (Optional — Free 100/day)

For automatic approval/rejection emails:

1. Go to **https://resend.com** and create a free account
2. Get your API key
3. In Vercel → Your Project → Settings → Environment Variables
4. Add: `RESEND_API_KEY` = your Resend API key
5. Redeploy

---

## STEP 9: Custom Domain (Optional — Free!)

Vercel gives you a free subdomain like `dcds-website.vercel.app`. 
If you want a custom domain like `dcds.org.bd`:

1. Purchase a domain (cheapest: Namecheap ~$10-15/year for `.com`)
2. In Vercel → Your Project → Settings → Domains
3. Click **"Add"** → Enter your domain
4. Follow Vercel's DNS instructions to point your domain to Vercel

---

## 🆘 Troubleshooting

| Problem | Solution |
|---|---|
| Website shows error after deploy | Check Vercel logs → Project → Deployments → Click latest → View logs |
| Login doesn't work | Check your Supabase URL and anon key in Vercel environment variables |
| Images not showing | Make sure logo.png is in the `public/` folder |
| Database errors | Re-run the SQL migration in Supabase SQL Editor |
| Admin panel shows "Access Denied" | Make sure you ran the SQL to set yourself as super_admin |

---

## 📱 Ongoing Management

| Task | Where to do it |
|---|---|
| Approve new members | `/admin/registrations` |
| Take attendance | `/admin/attendance` |
| Post a notice | `/admin/notices` |
| Add EC members | `/admin/ec-body` |
| Publish an article | `/admin/articles` |
| View statistics | `/admin/statistics` |
| Export member list | `/admin/members` → Click "Export CSV" |

---

## 💰 Cost Summary

| Service | Cost | Limit |
|---|---|---|
| **Vercel** | **FREE** | 100GB bandwidth, unlimited deploys |
| **Supabase** | **FREE** | 500MB DB, 1GB storage, 50K auth users |
| **GitHub** | **FREE** | Unlimited public repos |
| **Resend** | **FREE** | 100 emails/day |
| **Total** | **$0/month** | ✅ |

> When you grow beyond free limits (likely years from now): Supabase Pro = $25/month, Vercel Pro = $20/month. You can migrate easily.

---

## 📞 Need Help?

1. **Vercel Docs**: https://vercel.com/docs
2. **Supabase Docs**: https://supabase.com/docs
3. **Next.js Docs**: https://nextjs.org/docs

---

*Prepared specifically for Dhaka College Debating Society (DCDS) | Website built with Next.js 14 + Supabase*
