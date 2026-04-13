# PBL3 Fluxify FE

Frontend monorepo for Fluxify, managed with pnpm workspaces.

## Overview

This repository contains:

- storefront app (customer-facing website)
- merchant app (admin/seller dashboard)
- shared package(s) for reusable utilities

## Workspace Structure

```text
apps/
  merchant/
  storefront/
packages/
  shared/
```

Both apps are React + Vite projects and follow a feature-oriented structure.

## Tech Stack

- React 19
- Vite 7/8 (per app)
- Tailwind CSS v4
- react-router-dom
- axios
- pnpm workspaces
- ESLint 9

## Prerequisites

- Node.js 20+
- pnpm 10+

Check versions:

```bash
node -v
pnpm -v
```

## Install Dependencies

From repository root:

```bash
pnpm install
```

## Root Scripts

```bash
pnpm run dev:storefront
pnpm run dev:merchant
pnpm run dev:all
```

Notes:

- `dev:storefront` runs the storefront app.
- `dev:merchant` runs the merchant app.
- `dev:all` starts both commands from the root script.

## App-Level Commands

Use workspace filtering from root:

```bash
pnpm --filter storefront dev
pnpm --filter storefront build
pnpm --filter storefront preview
pnpm --filter storefront lint

pnpm --filter merchant dev
pnpm --filter merchant build
pnpm --filter merchant preview
pnpm --filter merchant lint
```

Or run inside each app directory with `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm lint`.

## Environment Variables

Each app can define its own `.env` file (inside `apps/storefront` or `apps/merchant`).

Example:

```bash
VITE_API_URL=http://localhost:5000
```

## Development Notes

- Storefront and merchant are independent Vite apps.
- Shared code should live in `packages/shared` when reusable across apps.
- Keep feature boundaries clear to avoid cross-layer coupling.

## Troubleshooting

If install or build fails:

1. Remove lock/install artifacts and reinstall if needed.
2. Run lint/build per app to isolate errors.
3. Check terminal output for the failing workspace name.

Useful commands:

```bash
pnpm --filter storefront lint
pnpm --filter storefront build
pnpm --filter merchant lint
pnpm --filter merchant build
```

## License

Internal academic project (PBL3).
