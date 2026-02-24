# ⚔️ Trading Journal 2026

A production-ready, cross-device synced trading journal built with **React + Vite + Supabase**, deployed on **Vercel**.

---

## 🚀 Deployment Guide (Step-by-Step)

### STEP 1 — Create Accounts (all free)

1. **GitHub**: [github.com](https://github.com) → Create account
2. **Supabase**: [supabase.com](https://supabase.com) → Create account → Click **New Project** → Name it `trading-journal` → **Save your Project URL and Anon Key**
3. **Vercel**: [vercel.com](https://vercel.com) → Create account → Connect with GitHub

---

### STEP 2 — Set Up Supabase Database

Go to your Supabase project → **SQL Editor** → Run this SQL:

```sql
-- Create trades table
create table trades (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  symbol text not null,
  side text not null,
  result numeric not null,
  model text,
  date date not null,
  notes text,
  screenshots text[],
  created_at timestamptz default now()
);

-- Enable Row Level Security (users can only see their own trades)
alter table trades enable row level security;

create policy "Users can manage their own trades"
  on trades for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Enable realtime sync
alter publication supabase_realtime add table trades;
```

Then go to **Authentication → Settings**:
- Enable **Email/Password** sign-in ✓

---

### STEP 3 — Put the Code on GitHub

**Option A: GitHub Desktop (easiest)**
1. Download [GitHub Desktop](https://desktop.github.com)
2. Click **File → Add Local Repository** → select this folder
3. If it asks to initialize, click **Initialize Repository**
4. Click **Publish Repository** → set name `trading-journal` → uncheck "Keep private" if you want (or keep private — Vercel works either way)
5. Click **Publish Repository**

**Option B: Terminal**
```bash
cd trading-journal
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/trading-journal.git
git push -u origin main
```

---

### STEP 4 — Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your `trading-journal` repository
3. Vercel will auto-detect it's a Vite project — leave all build settings as default
4. **IMPORTANT** — Before clicking Deploy, click **Environment Variables** and add:

| Variable Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` (from Supabase project settings) |
| `VITE_SUPABASE_ANON_KEY` | `eyJhb...` (from Supabase project settings → API) |

5. Click **Deploy** 🚀

Your app will be live at `https://trading-journal-xyz.vercel.app` in ~60 seconds!

---

### STEP 5 — First Time Setup

1. Open your Vercel URL
2. Click **Create Account** and sign up with your email
3. Check your email for a confirmation link — click it
4. Sign in and start logging trades!

**Cross-device sync**: Now sign in on your phone using the same email/password. Trades you add on your laptop will appear on your phone instantly (real-time via Supabase).

---

## 🔄 Updating the App Later

Any time you want to make changes:
1. Edit the code files locally
2. Push to GitHub (`git add . && git commit -m "update" && git push`)
3. Vercel auto-deploys in ~30 seconds — no manual action needed

---

## 📁 Project Structure

```
trading-journal/
├── src/
│   ├── components/
│   │   ├── Auth.jsx          # Login / Signup screen
│   │   ├── Dashboard.jsx     # Stats + equity chart
│   │   ├── TradeList.jsx     # Trade cards with screenshots
│   │   ├── AddTrade.jsx      # Log / edit trade form
│   │   └── Playbook.jsx      # ICT strategy reference
│   ├── lib/
│   │   └── supabase.js       # Supabase client
│   ├── App.jsx               # Main app + routing
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── vite.config.js
├── package.json
├── vercel.json               # SPA routing fix for Vercel
└── .env.example              # Rename to .env for local dev
```

---

## 💻 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env and add your Supabase URL and Anon Key

# 3. Start dev server
npm run dev
# Opens at http://localhost:5173
```

---

## ✨ Features

- 🔐 **Auth** — Email/password login, per-user data isolation
- 🔄 **Real-time sync** — Changes appear instantly on all devices
- 📊 **Dashboard** — Win rate, total R, avg R, best/worst trade
- 📈 **Equity curve** — Chart.js line chart with color coding
- 📅 **Monthly tabs** — Filter by month or view full year
- 🦄 **Trade logging** — Symbol, model, side, R result, notes, screenshots
- 📷 **Screenshots** — Drag & drop upload, auto-compressed, stored as base64
- 🔍 **Filters** — Filter trades by model or direction
- ✏️ **Edit/Delete** — Full CRUD on all trades
- 📖 **Playbook** — Full ICT strategy reference built-in
- 🌙 **Dark/Light mode** — Persisted in localStorage
- 📱 **Mobile responsive** — Works great on phone

---

## 🆘 Troubleshooting

**"Invalid API key" error**: Double-check your `VITE_SUPABASE_ANON_KEY` in Vercel environment variables — make sure there are no extra spaces.

**Trades not syncing**: Make sure you ran the `alter publication supabase_realtime add table trades;` SQL line. Also check that you're signed in with the same email on both devices.

**Email confirmation not arriving**: Check spam folder. In Supabase → Authentication → Settings, you can disable email confirmation for easier testing.

**Build fails on Vercel**: Make sure both environment variables are set before deploying. Check the Vercel build logs for the specific error.
