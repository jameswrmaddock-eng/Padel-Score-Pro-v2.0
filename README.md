# PadelScorePro

Premium padel scoring platform — Next.js 15, TypeScript, Tailwind CSS.

Live site: [padelscorepro.com](https://www.padelscorepro.com)

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + CSS variables |
| Fonts | Barlow Condensed (display) + Barlow (body) via Google Fonts |
| Storage Day 1 | localStorage via `useSyncData` hook |
| Storage Day 2 | Supabase (drop-in — see migration guide below) |
| Deployment | Vercel (auto-deploy from `main`) |

---

## Project structure

```
app/
  layout.tsx          Root layout + metadata
  page.tsx            Home — Header + Hero
  log/page.tsx        Match entry form
  history/page.tsx    Match history + Pro Kit section
components/
  layout/
    Header.tsx        Sticky glassmorphism nav
  sections/
    Hero.tsx          Landing hero section
    PhoneMockup.tsx   3D floating phone illustration
  FloatField.tsx      Floating-label input
  SetScoreBlock.tsx   Per-set score input pair
  SuccessView.tsx     Post-save success animation
  MatchEntry.tsx      Full match entry form
  MatchCard.tsx       Individual bento match card
  StatsBar.tsx        Win rate + totals bar
  MatchHistory.tsx    Bento grid dashboard
  ProductIcon.tsx     SVG product illustrations
  ProKitCard.tsx      Affiliate product card
  ProKitRecommendation.tsx  Full pro kit section
hooks/
  useSyncData.ts          Main data hook (async, cloud-ready)
  localStorageAdapter.ts  Day 1 storage layer
  supabaseAdapter.ts      Day 2 drop-in (scaffold, not active)
  useMatchHistory.ts      Legacy hook (kept for reference)
types/
  match.ts            Match, SetScore, SyncStatus interfaces
utils/
  whatsapp.ts         WhatsApp share text builder
data/
  products.ts         Pro kit product catalogue + affiliate URLs
```

---

## Local development

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/padelscorepro.git
cd padelscorepro

# 2. Install
npm install

# 3. Environment
cp .env.local.example .env.local
# Edit .env.local if needed (blank values are fine for Day 1)

# 4. Run
npm run dev
# → http://localhost:3000
```

---

## Deployment (Vercel)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Vercel auto-detects Next.js — click **Deploy**
4. Every push to `main` auto-deploys

No environment variables are required for Day 1 (localStorage only).

---

## Migrating to Supabase (Day 2)

All data logic is isolated behind an adapter interface. The migration is a single line change.

### 1. Create the Supabase table

Run this SQL in your Supabase project → SQL Editor:

```sql
create table public.matches (
  id          uuid primary key,
  created_at  timestamptz not null,
  updated_at  timestamptz not null,
  team_a      text not null,
  team_b      text not null,
  sets        jsonb not null default '[]',
  winner      text not null,
  location    text not null default 'Unspecified',
  date        text not null,
  is_synced   boolean not null default true,
  user_id     uuid references auth.users(id) on delete cascade
);

alter table public.matches enable row level security;

create policy "own matches" on public.matches
  for all using (auth.uid() = user_id);
```

### 2. Add environment variables

In `.env.local` (locally) and in Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. Install the Supabase client

```bash
npm install @supabase/supabase-js
```

### 4. Activate the adapter

In `hooks/useSyncData.ts`, change **one line**:

```ts
// Before (Day 1)
import * as adapter from './localStorageAdapter';

// After (Day 2)
import * as adapter from './supabaseAdapter';
```

Then uncomment the implementation blocks inside `hooks/supabaseAdapter.ts`.

That's it. No component changes needed.

---

## Affiliate links

Amazon affiliate tag: `jmadd1791-21`

All product ASINs and the `getAmazonUrl()` helper live in `data/products.ts`.
To add or update products, edit that file only.

---

## Colour palette

| Token | Hex | Usage |
|---|---|---|
| `--volt` | `#CCFF00` | CTAs, winners, active states, accents |
| `--volt-dark` | `#B8E600` | Hover state for volt backgrounds |
| `--bg` | `#050505` | Page background |
| `--bg-card` | `#0e0e0e` | Card backgrounds |
| White | `rgba(255,255,255,0.07)` | Glass card borders |
| White muted | `rgba(255,255,255,0.28–0.38)` | Body text, descriptions |
