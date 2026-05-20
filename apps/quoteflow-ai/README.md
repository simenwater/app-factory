# QuoteFlow AI

AI-powered quoting and client follow-up tool designed for freelancers and solo entrepreneurs.

## Features

- **AI Quote Generator** — Describe your service and let AI generate professional quotes with appropriate pricing
- **Client CRM** — Manage clients, track quotes per client, and monitor revenue
- **Follow-up Templates** — Pre-built email/SMS templates with variable substitution for automated client follow-ups
- **Revenue Dashboard** — Track income, conversion rates, and pending payments at a glance
- **PDF Export** — Download professional branded quote PDFs
- **Dark Mode** — Full dark mode support
- **Subscription System** — Free tier (5 quotes/month) and Pro tier ($9.90/month) with Stripe integration

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **State**: Zustand with localStorage persistence
- **PDF**: jsPDF + jspdf-autotable
- **Testing**: Jest + Testing Library
- **Language**: TypeScript 5

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `OPENAI_API_KEY` — Optional. Enables advanced AI quote generation via OpenAI API. Falls back to local rule engine if not set.
- `STRIPE_SECRET_KEY` / `STRIPE_PRICE_ID` — Optional. Enables real Stripe checkout for subscriptions.

## Testing

```bash
npm test
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes (AI generate, Stripe checkout)
│   ├── quotes/       # Quote CRUD pages
│   ├── clients/      # Client CRM pages
│   ├── follow-ups/   # Follow-up management
│   ├── pricing/      # Subscription pricing page
│   └── settings/     # User settings
├── components/       # Shared UI components
├── lib/              # Business logic
│   ├── ai.ts         # AI quote generation engine
│   ├── templates.ts  # Follow-up template system
│   ├── pdf.ts        # PDF generation
│   └── utils.ts      # Utilities
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
└── __tests__/        # Unit tests
```
