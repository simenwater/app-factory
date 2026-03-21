# FieldFlow

A simple, affordable **mobile-first** web app for field service management — built for solo contractors and small service businesses.

## Features

- **Job Management** — Create jobs with customer details, location, scheduling, and pricing
- **Calendar View** — Visual calendar with monthly navigation and job indicators
- **Invoice & Quotes** — Generate PDF quotes/invoices with line items, tax, and totals
- **Payment Tracking** — Mark invoices as paid/unpaid with payment date tracking
- **Dark Mode** — Full dark/light theme support
- **Freemium Model** — Free tier (5 jobs/month) + Pro subscription ($9.99/month)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| State | Zustand (persisted to localStorage) |
| PDF | jsPDF + jspdf-autotable |
| Calendar | date-fns |
| Icons | Lucide React |
| Testing | Jest + Testing Library |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Dashboard / Home
│   ├── jobs/             # Job management
│   ├── calendar/         # Calendar scheduling
│   ├── invoices/         # Invoice/quote management
│   └── settings/         # Settings & subscription
├── components/           # Shared UI components
├── lib/                  # Utilities & PDF generation
├── store/                # Zustand global state
├── types/                # TypeScript type definitions
└── __tests__/            # Unit tests
```

## Monetization

- **Free Tier**: 1 user, 5 jobs/month
- **Pro** ($9.99/month): Unlimited jobs, customers, invoice templates, priority support
