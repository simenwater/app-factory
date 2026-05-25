# FairPay Simulator

AI-powered compensation planning tool for small business owners. Generate fair, above-market salary plans and simulate their impact on profits and employee retention.

## Features

- **Market Salary Benchmarking** — Industry & region-adjusted salary data across 10 roles and 8 regions
- **AI Compensation Plans** — Automatically generates above-market (P60–P75) salary recommendations
- **Profit Impact Simulation** — Models how pay raises affect your bottom line
- **Retention Prediction** — Estimates how better pay improves employee retention and saves turnover costs
- **Dark Mode** — Full light/dark theme support
- **Export** — Print-friendly report generation

## Tech Stack

- **Next.js 15** + React 19
- **TypeScript** (strict)
- **Tailwind CSS 4**
- **Zustand** for state management
- **Jest** + Testing Library for unit tests

## Getting Started

```bash
cd apps/fairpay-simulator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npm test
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React UI components
├── lib/              # Core business logic
│   ├── market-data.ts        # Industry salary benchmarks
│   ├── salary-engine.ts      # Compensation calculation engine
│   ├── profit-simulator.ts   # Profit impact modeling
│   └── retention-predictor.ts # Retention prediction algorithm
├── store/            # Zustand global state
├── types/            # TypeScript type definitions
└── __tests__/        # Unit tests
```

## Pricing Model

- **Free**: 3 simulations/month
- **Pro** ($9.9/mo): Unlimited simulations + report export
- **Team** ($29.9/mo): Multi-user + API access
