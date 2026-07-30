# IPTVLinux

Premium streaming service marketing site, customer dashboard, and admin dashboard — built with Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma, and next-intl.

This is being built in phases (see `IPTVLinux_ClaudeCode_Master_Prompt`). **Phase 1** (this state): project foundation, design system, WhatsApp ordering, base SEO, and the Home / Pricing / Features / Contact / legal pages.

## Prerequisites

- Node.js 20+ and npm
- A PostgreSQL connection string (e.g. from [Neon](https://neon.tech), [Supabase](https://supabase.com), or Railway)

## Setup

```bash
npm install
cp .env.example .env
# edit .env: set DATABASE_URL to your Postgres connection string,
# and generate NEXTAUTH_SECRET with: openssl rand -base64 32

npm run prisma:generate
npm run prisma:migrate   # creates tables from prisma/schema.prisma
npm run prisma:seed      # seeds plans, testimonials, FAQs, site settings

npm run dev              # http://localhost:3000
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run prisma:studio` | Browse the database |

## Project structure

See the architecture plan for the full folder layout, database schema, and phased roadmap. Key directories:

- `src/app/[locale]/(marketing)` — public marketing pages
- `src/components` — UI primitives, layout, marketing, WhatsApp, SEO components
- `src/lib` — utilities, WhatsApp link builder, SEO helpers, site config
- `src/i18n` — next-intl routing/config/messages (English live; FR/DE/ES/AR land in the i18n phase)
- `prisma/schema.prisma` — full data model (auth, commerce, blog, support, admin)

## WhatsApp ordering

No payment gateway is integrated by design. Every CTA opens WhatsApp (`+34 603 171 403`) with a pre-filled message via `src/lib/whatsapp.ts`.
