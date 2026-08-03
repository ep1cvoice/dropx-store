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
| Fonts | `next/font` — Anton (logo/headings), Inter (UI) | ✅ In use |
| ORM | [Prisma 7](https://www.prisma.io) (`pg` driver adapter) | ✅ In use |
| Database | [Supabase](https://supabase.com) (PostgreSQL) | ✅ In use |
| Auth | [NextAuth.js v5](https://authjs.dev) (Credentials) | ✅ Credentials done · OAuth planned |
| Validation | Zod + React Hook Form | ✅ In use |
| Deployment | [Vercel](https://vercel.com) | 🔜 Planned |

---

## Architecture

```
Next.js (App Router)
       │
       ▼
 Prisma ORM          ← schema, migrations, type-safe queries (pg driver adapter)
       │
       ▼
Supabase PostgreSQL  ← hosted database (Postgres only; no Supabase client used)
```

**Supabase** is used exclusively as a managed PostgreSQL host. The app never calls the Supabase client library — all database communication goes through **Prisma**, which connects to Postgres via the `@prisma/adapter-pg` driver adapter using a single `DATABASE_URL`.

**NextAuth.js v5** handles authentication. A **Credentials** provider is fully wired (email + bcrypt-hashed password, JWT sessions). The `PrismaAdapter` and NextAuth tables (`accounts`, `sessions`, `verification_tokens`) live in the same Supabase Postgres database. Google/Apple OAuth buttons exist in the UI but the providers are **not wired yet**.

**Vercel** will serve the Next.js app (not yet deployed).

---

## Database

Prisma is the single source of truth for the database — schema, migrations, and queries all go through it.

### Configuration

This project uses **Prisma 7** with:
- The new `prisma-client` generator, output to **`src/generated/prisma`** (import the client from there, not `@prisma/client`).
- A **driver adapter** (`@prisma/adapter-pg`) — see `src/lib/prisma.ts`. The runtime connects with a single `DATABASE_URL`.
- A **`prisma.config.ts`** file (instead of a `datasource` URL in the schema) that defines the schema path, migrations directory, seed command, and datasource URL.

> Note: the current runtime uses one pooled `DATABASE_URL`. There is no separate `DATABASE_DIRECT_URL` wired up — add one only if migrations against the pooler become an issue.

### Common Prisma commands

| Command | Description |
|---------|-------------|
| `npx prisma migrate dev` | Create and apply a new migration (development) |
| `npx prisma migrate deploy` | Apply pending migrations (production / CI) |
| `npx prisma db push` | Push schema changes without a migration file (prototyping) |
| `npx prisma generate` | Regenerate the Prisma Client into `src/generated/prisma` |
| `npx prisma db seed` | Run the seed script (`tsx prisma/seed.ts`) |
| `npx prisma studio` | Open the visual database browser |

---

## What's implemented

### Auth (working end-to-end)
- **NextAuth.js v5** with a **Credentials** provider — JWT session strategy, `PrismaAdapter`.
- **`/register`** — server action (`src/actions/register.tsx`) validates with Zod, checks for duplicate emails, hashes the password with **bcrypt**, creates the user, and redirects to `/login`.
- **`/login`** — credentials sign-in via `signIn` server action; session-aware navbar (sign in / sign out).
- **Route protection** (`src/middleware.ts`):
  - Guest-only: `/login`, `/register` (redirect to `/` when logged in)
  - Protected: `/account`, `/checkout`, `/orders` (redirect to `/login` when logged out)
- **Note:** Google/Apple social buttons render on the login UI but the OAuth providers are not configured yet.

### Homepage (`/`)
Fully composed from modular sections in `src/components/home/`:
`HomeHero`, `UpcomingDropSection`, `BrandPartnersSection`, `NewDropsSection`, `FeaturedPicksSection` (Trending), `ShopByCategorySection`, `BrowseAllSneakersSection`, `DropListSection`.

> These sections currently render **hardcoded placeholder data**, not live DB queries.

### Layout & navigation
- **Responsive navbar** — separate mobile (hamburger + centered logo) and desktop layouts, active-link highlighting.
- **Footer** across devices — brand block, Shop / Help / Company columns, social icons, newsletter UI.
- **Route groups** — `(site)` for pages with navbar + footer; auth pages live outside the group.
- **Not-found** — custom catch-all inside `(site)`.

### UI components (`src/components/ui/`)
- **Button** — variants: `normal`, `accent`, `secondary`, `outline`
- **Input** — labeled text field (used on auth forms)
- **Badge** — `new`, `limited`, `discount`
- **SizeButton** and **QuantitySelector** — for product/cart UIs
- **ProductCard** (`src/components/product/`) and **CartItem** (`src/components/cart/`) — built, awaiting real data/pages

### Domain types (designed, not yet in the DB)
`src/types/product.ts` and `src/types/cart.ts` define the intended sneaker domain:
`Product → ProductVariant (colorway) → VariantSize (per-size stock)`, plus brand, badges, discounts, and cart line items. **The Prisma schema does not yet reflect these types** (see below).

### Pages
| Route | Layout | Status |
|-------|--------|--------|
| `/` | Site (nav + footer) | ✅ Built (placeholder data) |
| `/login` | Standalone | ✅ Working |
| `/register` | Standalone | ✅ Working |
| `/forgot-password` | Standalone | ⚠️ Bare placeholder |
| `/new-drops`, `/brands`, `/sale` | Site | ⚠️ "Coming Soon" stubs |
| `/about` | Site | ⚠️ Stub |
| `/products/[slug]`, `/cart`, `/wishlist`, `/account`, `/checkout`, `/orders` | — | ❌ Not created (some linked in nav) |

---

## Known gap: schema vs. domain

The Prisma schema (`prisma/schema.prisma`) is still close to the **starter model**:

- `User`, plus NextAuth `Account` / `Session` / `VerificationToken` tables.
- A flat `Product { title, description, price, imageUrl, sellerId }` tied to `User` as a *seller* — a leftover marketplace shape.
- `prisma/seed.ts` seeds **generic electronics**, not sneakers.

DROPX is a **single-store** catalog, so the next major step is to redesign the schema to match `src/types/product.ts` (Brand, Product, ProductVariant, VariantSize, Cart/CartItem, WishlistItem) and drop the `sellerId` relation.

---

## What's building next

1. **Redesign the Prisma schema** to match the sneaker domain (Brand, Product, ProductVariant, VariantSize, Cart, WishlistItem); remove the marketplace `sellerId`.
2. **Rewrite the seed** with real sneaker data (brands, colorways, EU sizes + stock).
3. **Catalog data layer** — wire homepage sections and listing pages to live Prisma queries via the `ProductCardData` projection.
4. **Product detail page** — `/products/[slug]` with color + size selection.
5. **Listing pages** — `/new-drops`, `/brands`, `/sale` with filtering.
6. **Cart & Wishlist** — routes, DB-backed persistence for logged-in users, add-to-cart flow.
7. **Checkout & orders**, then **Google OAuth**.

---

## Project structure

```
dropx-store/
├── prisma/
│   ├── schema.prisma       # starter model (User + Product) — pending redesign
│   ├── seed.ts             # placeholder seed data
│   └── migrations/
├── prisma.config.ts        # schema path, migrations, seed command, datasource URL
├── public/                 # static images (heroes, product media)
└── src/
    ├── app/
    │   ├── layout.tsx          # root: fonts, html/body, SessionProvider
    │   ├── globals.css
    │   ├── (site)/             # route group — URL unchanged
    │   │   ├── layout.tsx      # navbar + footer
    │   │   ├── page.tsx        # → /
    │   │   ├── new-drops/, brands/, sale/, about/
    │   │   └── [...not-found]/
    │   ├── login/, register/, forgot-password/
    │   └── api/auth/[...nextauth]/route.ts
    ├── actions/            # sign-in, sign-out, register server actions
    ├── auth/auth.ts        # NextAuth config + isAuth() helper
    ├── middleware.ts       # guest-only / protected route guards
    ├── components/         # auth, home, navbar, footer, product, cart, ui, providers
    ├── lib/
    │   ├── fonts.ts        # Anton + Inter (next/font)
    │   ├── prisma.ts       # Prisma Client singleton (pg driver adapter)
    │   └── validation.ts   # Zod schemas
    ├── schema/zod.ts
    ├── types/              # product.ts, cart.ts (intended domain model)
    ├── utils/password.ts   # bcrypt hash/verify
    └── generated/prisma/   # generated Prisma Client (do not edit)
```

**Routing note:** Folders in **parentheses** like `(site)` are [route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) — they organize layouts without affecting the URL.

---

## Getting started

### Prerequisites
- Node.js 20+
- npm (or pnpm / yarn)
- A [Supabase](https://supabase.com) project (for the database)
- Optional: a [Cloudinary](https://cloudinary.com) free account (product images CDN)

### Install & run

```bash
cd dropx-store
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env` in the project root:

```env
# Supabase PostgreSQL connection string (used by the pg driver adapter + Prisma CLI)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# NextAuth v5 session secret (BETTER_AUTH_SECRET is accepted as a fallback)
AUTH_SECRET="your-secret-here"

# OAuth providers — buttons exist in the UI but are not wired yet (planned)
# GOOGLE_CLIENT_ID="..."
# GOOGLE_CLIENT_SECRET="..."

# Cloudinary (optional — product images). Only cloud name is needed for delivery.
# Create a free account → Dashboard → copy "Cloud name".
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
```

### Cloudinary (product images)

1. Sign up at [cloudinary.com](https://cloudinary.com/users/register/free) (Free ≈ 1 GB).
2. Dashboard → copy **Cloud name** into `.env` as `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
3. Media Library → create folders:
   - `dropx/products` — variant / card images
   - `dropx/heroes` — PDP campaign banners
4. Upload WebP/JPG; note the **public_id** (e.g. `dropx/products/nike-dunk-low-panda`).
5. In seed / DB set `imageUrl` to either:
   - full URL from Cloudinary, or
   - just the public_id — use `resolveProductImage()` / `cloudinaryUrl()` from `src/lib/cloudinary.ts`.
6. Restart `npm run dev` after changing `.env`.

You do **not** need API Key/Secret for dashboard uploads + public delivery. Keep those only if you later add server-side upload.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

### Vercel deployment (planned)

1. Push to GitHub and connect the repo in the Vercel dashboard.
2. Add the environment variables above.
3. Set the build command to `prisma generate && next build`.
4. Run `npx prisma migrate deploy` once to apply migrations to the production database.

---

## Data model (target)

Target entities for the schema redesign — replacing the current starter model:

```
User ──┬── Account (NextAuth)
       ├── Session
       ├── Cart ── CartItem ── VariantSize
       └── WishlistItem ── ProductVariant

Brand ── Product ── ProductVariant (color + price + image)
                         └── VariantSize (size + stock)
Product: slug, name, category, badge, discountValue, currency
```

---

## License

Private project — all rights reserved.
