# Caelum — Next.js E‑Commerce Client

[![Vercel](https://img.shields.io/badge/deploy-vercel-000000?style=flat&logo=vercel)](#)
[![TypeScript](https://img.shields.io/badge/lang-TypeScript-%23007ACC?style=flat&logo=typescript)](#)
[![Next.js](https://img.shields.io/badge/framework-Next.js-%23000000?style=flat&logo=next.js)](#)

Production-ready, component-driven Next.js frontend for Caelum — a modern watch-focused e‑commerce storefront with a clean UX, server-side rendering, and opinionated performance optimizations.

Key highlights:

- Clean app-router structure (Next.js 13+ `app/` directory)
- TypeScript-first with strict types
- Modular UI components and reusable design system under `components/`
- Optimized media and animation assets in `public/animations`
- API integration utilities in `utils/` and `lib/`

## Live demo

If deployed, this app is well-suited for Vercel. See the `vercel.json` configuration included in the repo.

## Why this project is recruiter-friendly

- Demonstrates modern Next.js (app router) and TypeScript usage
- Well-structured codebase with clear separation: routes, components, assets, utils
- Ready for deployment to Vercel with zero-configuration
- Includes real-world concerns: authentication flows, admin area, product pages, and order handling

## Tech stack

- Next.js (App Router)
- TypeScript
- React (functional components + hooks)
- Vercel (recommended deployment)
- PostCSS (styling pipeline)

## Repo structure (high level)

- `app/` — Next.js app routes, layouts, and pages (customer, admin, auth)
- `components/` — UI components and shared design pieces
- `public/` — static assets (images, animations, videos)
- `src/lib/` and `src/utils/` — helpers, API clients (`axiosInstance.ts`)
- `next.config.ts`, `vercel.json`, `tsconfig.json` — app configuration

Example important paths:

- `app/(publicGroup)/` — public-facing homepage and product pages
- `app/customer/dashboard/` — customer dashboard and order pages
- `app/admin/` — admin dashboard and watches management

## Setup & local development

Prerequisites: Node.js 18+ and your package manager of choice (`npm`, `pnpm`, or `yarn`).

1. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

2. Local development

```bash
npm run dev
# or
pnpm dev
# or
yarn dev

# Open: http://localhost:3000
```

3. Build for production

```bash
npm run build
npm start
```

## Environment variables

Create a `.env.local` at the repository root to store secrets and API keys used by the client (do not commit this file).

Common environment variables:

- `NEXT_PUBLIC_API_URL` — base URL for backend API
- `NEXT_PUBLIC_STRIPE_KEY` — Stripe public key (if used)

## Testing & linting

- Linting and formatting can be added via `eslint` and `prettier` (this repo includes `eslint.config.mjs`).

## Deployment

This project is ready to deploy to Vercel. Push the repository to GitHub and import the repo into Vercel — Vercel will handle builds using the included `vercel.json` and `next.config.ts`.

## Architecture notes (short)

- Uses Next.js App Router: route-driven layouts and server components where beneficial
- Keeps UI stateless where possible and moves data fetching to route-level server components
- `components/ui/skiper-ui/` contains small SVG/illustration components used across the app

## How to demo to a recruiter or client

1. Start the app locally and open the homepage.
2. Walk through the customer flow: browse watches → view product → add to cart → checkout simulation.
3. Switch to the admin area to show content management (add/edit watches pages).
4. Call out TypeScript types, `axiosInstance` integration, and performance optimizations (image/video handling).

## Suggestions to make the repo even more compelling

- Add a short video or GIF to `public/` and reference it in the README demo section
- Include a small `snapshot.md` showing key metrics (Lighthouse scores, TTFB)
- Add unit tests (Jest + React Testing Library) and CI status badge

## Contributing

- Pull requests welcome. For significant changes, open an issue first to discuss the design and approach.

## License & contact

Include your preferred license file (e.g., `LICENSE`) and replace this with your contact details or portfolio link.

---

_This README was generated and tailored to present the `client` app in a concise, professional manner for recruiters and clients._
