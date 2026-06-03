# DROPX Store

E-commerce storefront for **limited-release sneakers** — exclusive drops, sales, multi-size inventory, and color variants. Built as a modern Next.js application.

**Brand positioning:** *"The destination for limited-release sneakers and exclusive drops."*

---

## Stack

| Layer | Technology | Status |
|-------|------------|--------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) | ✅ In use |
| Language | TypeScript | ✅ In use |
| Styling | Tailwind CSS v4 | ✅ In use |
| UI icons | Lucide React | ✅ In use |
| Fonts | `next/font` — Anton (logo), Inter (UI) | ✅ In use |
| ORM | [Prisma](https://www.prisma.io) | 🔜 Planned |
| Database | [Supabase](https://supabase.com) (PostgreSQL) | 🔜 Planned |
| Auth | [NextAuth.js](https://next-auth.js.org) | 🔜 Planned |
| Deployment | [Vercel](https://vercel.com) | 🔜 Planned |

---

## Architecture

```
Next.js (App Router)
       │
       ▼
 Prisma ORM          ← schema definition, migrations, type-safe queries
       │
       ▼
Supabase PostgreSQL  ← hosted database (Postgres only; no Supabase client used)
```

**Supabase** is used exclusively as a managed PostgreSQL host. The app never calls the Supabase client library directly — all database communication goes through **Prisma**, which translates TypeScript queries into SQL executed against the Supabase Postgres instance.

**NextAuth.js** handles authentication (credentials + OAuth). Its session tables (`Account`, `Session`, `VerificationToken`) live in the same Supabase Postgres database and are managed by Prisma migrations.

**Vercel** serves the Next.js app. Prisma connects to Supabase over two connection strings: a direct URL for migrations and a pooled URL for serverless runtime queries.

---

## Database

Prisma is the single source of truth for the database — schema, migrations, and queries all go through it.

### Connection strings

Supabase provides two URLs; both are needed for serverless deployments:

| Variable | Port | Purpose |
|----------|------|---------|
| `DATABASE_URL` | `6543` | Pooled (PgBouncer) — used by the app at runtime |
| `DATABASE_DIRECT_URL` | `5432` | Direct — used by Prisma for migrations |

In `prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_DIRECT_URL")
}
```

### Common Prisma commands

| Command | Description |
|---------|-------------|
| `npx prisma migrate dev` | Create and apply a new migration (development) |
| `npx prisma migrate deploy` | Apply pending migrations (production / CI) |
| `npx prisma db push` | Push schema changes without a migration file (prototyping) |
| `npx prisma generate` | Regenerate the Prisma Client after schema changes |
| `npx prisma studio` | Open the visual database browser |

---

## What's implemented

### Layout & navigation
- **Responsive navbar** — separate mobile (hamburger + centered logo) and desktop layouts
- **Desktop footer** — brand block, Shop / Help / Company columns, social icons (tablet/mobile footer TBD)
- **Route groups** — `(site)` for pages with navbar + footer; auth pages live outside the group

### UI components (`src/components/ui/`)
- **Button** — variants: `normal`, `accent`, `secondary`, `outline`
- **Input** — labeled text field (Inter), used on auth forms

### Auth (UI only — no backend yet)
- **`/login`** — full responsive layout:
  - **Mobile:** dark hero + form, full-width "Sign in with Google"
  - **Tablet:** split view (~38% hero image, form on the right)
  - **Desktop:** 50/50 split, centered hero copy, Google + Apple social buttons
- **`BackToHomeLink`** — arrow + link to `/` on hero (larger on desktop)
- **`/register`** — route scaffolded (placeholder page; layout to be built)

### Pages
| Route | Layout | Status |
|-------|--------|--------|
| `/` | Site (nav + footer) | Placeholder |
| `/login` | Standalone (no nav/footer) | UI complete |
| `/register` | Standalone | Placeholder |
| `/new-drops`, `/brands`, `/sale`, `/about` | — | Linked in nav, not created |
| `/wishlist`, `/cart` | — | Linked in nav, not created |

### Assets (`public/`)
- `loginHero.jpg` — login split-screen hero
- `registerHero.jpg` — reserved for register page

---

## What's building next

### Authentication & users
- **NextAuth.js** — credentials + OAuth (Google); sessions stored in Supabase Postgres via Prisma
- **Register flow** — mirror login layouts (mobile / tablet / desktop)
- Protected routes (profile, checkout, wishlist)

### Catalog & product model (Prisma schema)
- **Sneakers** with brand, description, images
- **Sizes** — per-product size availability and stock
- **Colors** — variants (e.g. same model, different colorways)
- **Limited editions** — drop windows, stock caps, "sold out" states
- **Sales** — discounted pricing, sale badges (nav already highlights **Sale**)

### Shopping experience
- **Basket (cart)** — line items with size/color, quantities, persist for logged-in users
- **Wishlist** — save favorites, sync with account
- **Product listing & detail** — New Drops, Brands, Sale filters
- **Search** — navbar search (UI icon present)

### Content & ops
- Static/help pages (FAQ, Shipping, Returns, About, Privacy)
- Order history & tracking (post-auth)

---

## Project structure

```
dropx-store/
├── prisma/                 # schema.prisma, migrations/
├── public/                 # Static images (heroes, product media)
└── src/
    ├── app/
    │   ├── layout.tsx          # Root: fonts, html/body
    │   ├── globals.css
    │   ├── (site)/             # Route group — URL unchanged
    │   │   ├── layout.tsx      # Navbar + Footer
    │   │   └── page.tsx        # → /
    │   ├── login/
    │   │   └── page.tsx        # → /login
    │   └── register/
    │       └── page.tsx        # → /register
    ├── components/
    │   ├── auth/               # LoginForm, BackToHomeLink, social icons
    │   ├── footer/
    │   ├── navbar/
    │   └── ui/                 # Button, Input
    └── lib/
        ├── fonts.ts            # Anton + Inter (next/font)
        └── prisma.ts           # Prisma Client singleton (to be added)
```

**Routing note:** Folders in **parentheses** like `(site)` are [route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) — they organize layouts without affecting the URL.

---

## Getting started

### Prerequisites
- Node.js 20+
- npm (or pnpm / yarn)
- A [Supabase](https://supabase.com) project (for the database)

### Install & run

```bash
cd dropx-store
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Supabase PostgreSQL — pooled URL (runtime, port 6543)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase PostgreSQL — direct URL (migrations, port 5432)
DATABASE_DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# OAuth providers (optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

### Vercel deployment

1. Push to GitHub and connect the repo in the Vercel dashboard.
2. Add all environment variables from the table above.
3. Set the build command to `prisma generate && next build` (or add it to `package.json`).
4. Run `npx prisma migrate deploy` once to apply migrations to the production database.

---

## Planned data model (sketch)

High-level entities for Prisma — subject to change during implementation:

```
User ──┬── Account (NextAuth)
       ├── Session
       ├── Cart ── CartItem ── ProductVariant
       └── WishlistItem ── ProductVariant

Product ── ProductVariant (size + color + sku + stock + price)
        ── Brand
        ── Drop / limited-edition flags
        ── SalePrice (optional)
```

---

## License

Private project — all rights reserved.
