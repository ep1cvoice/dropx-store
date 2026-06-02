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
| Database | [Prisma](https://www.prisma.io) | 🔜 Planned |
| Auth | [NextAuth.js](https://next-auth.js.org) | 🔜 Planned |

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
  - **Mobile:** dark hero + form, full-width “Sign in with Google”
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

## What building next

### Authentication & users
- **NextAuth.js** — credentials + OAuth (Google); session handling
- **Register flow** — mirror login layouts (mobile / tablet / desktop)
- Protected routes (profile, checkout, wishlist)

### Catalog & product model (Prisma)
- **Sneakers** with brand, description, images
- **Sizes** — per-product size availability and stock
- **Colors** — variants (e.g. same model, different colorways)
- **Limited editions** — drop windows, stock caps, “sold out” states
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
├── prisma/                 # 🔜 schema, migrations (not added yet)
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
        └── fonts.ts            # Anton + Inter (next/font)
```

**Routing note:** Folders in **parentheses** like `(site)` are [route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) — they organize layouts without affecting the URL. A folder named `site` (no parentheses) would create a `/site` path.

---

## Getting started

### Prerequisites
- Node.js 20+
- npm (or pnpm / yarn)

### Install & run

```bash
cd dropx-store
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

### Environment (upcoming)

When Prisma and NextAuth are added, expect something like:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

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
