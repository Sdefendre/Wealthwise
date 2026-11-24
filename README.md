# WealthWise

Marketing site: https://sdefendre.github.io/Wealthwise/

A Defendre Solutions product by Steve Defendre. Next.js money dashboard. Import a CSV or PDF bank statement, chart the rows, or start from the bundled sample. No Plaid. No live bank login.

## What it does

The dashboard opens with a small sample statement. You can download that CSV, or drop in your own export.

CSV import is parsed in the browser. Date, Description, and Amount columns are required. Category and Account are optional.

PDF import hits `/api/upload` and uses Mistral OCR when `MISTRAL_API_KEY` is set. That path writes extracted rows through Drizzle into Postgres.

Charts (income, expenses, cashflow, categories) come from the transactions currently loaded. They are not a live bank balance.

Supabase email login and signup are in the app. Middleware sends unauthenticated requests to `/auth/login`. You need your own Supabase project. This is not a hosted finance product.

Contact: [steve@defendresolutions.com](mailto:steve@defendresolutions.com)

## Tech stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| UI library | React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Charts | Recharts |
| Database | PostgreSQL via Drizzle ORM |
| Auth | Supabase Auth (email and password) |
| Optional OCR | Mistral AI |
| Package manager | Bun (`bun.lock`). npm scripts in `package.json` also work. |

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) (CI uses `bun install --frozen-lockfile`)
- A Postgres database if you want `migrate` and PDF import to persist rows
- A Supabase project if you want login and signup

### Setup

1. Clone the repository, copy `.env.example` to `.env.local`, and fill in your values:

```bash
git clone https://github.com/Sdefendre/Wealthwise.git
cd Wealthwise
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
MISTRAL_API_KEY=
```

`MISTRAL_API_KEY` is optional. CSV import works without it.

2. Install dependencies:

```bash
bun install
```

3. Run database migrations:

```bash
bun run migrate
```

4. Start the development server:

```bash
bun run dev
```

> **Note:** Never commit real bank statements, exports, account numbers, or `.env` files. Use `fixtures/` (such as `fixtures/sample-statement.csv`) with fake data only.

### Scripts

These names are the ones in `package.json`. Run them with Bun or npm.

| Script | Command | What it does |
| --- | --- | --- |
| Dev server | `bun run dev` | Next.js on http://localhost:3000 |
| Production build | `bun run build` | `next build` |
| Production server | `bun run start` | `next start` |
| Lint | `bun run lint` | `next lint` |
| Tests | `bun run test` | Vitest |
| Migrations | `bun run migrate` | Applies Drizzle migrations. Loads `DATABASE_URL` from `.env.local` if present, or from the environment (requires Node 22.9+ for `--env-file-if-exists`). |

`npm run dev`, `npm run build`, `npm run start`, `npm run lint`, `npm run test`, and `npm run migrate` call the same scripts.

### Database

```bash
bunx drizzle-kit generate
bun run migrate
```

## Project structure

```
Wealthwise/
├── app/                 # App Router pages, auth, and /api/upload
├── components/          # Dashboard, statement upload, shadcn/ui
├── docs/                # Static marketing site for GitHub Pages
├── drizzle/             # Schema and migrations
├── fixtures/            # Fake sample statement data (`sample-statement.csv`)
├── lib/                 # CSV parsing, env validation, db, Supabase
└── scripts/migrate.ts   # `bun run migrate`
```

## License

MIT. See [LICENSE](LICENSE).
