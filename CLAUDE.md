# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## ⚠️ Non-standard Next.js — read before writing code

`AGENTS.md` (imported above) states this project uses a modified/pinned Next.js whose APIs
and conventions may differ from training data. Check `node_modules/next/dist/docs/` for the
relevant guide before relying on remembered Next.js behavior, especially around routing,
`headers()`/`params` (already `Promise`-based here — see route handlers), and middleware.

## Commands

```bash
npm run dev       # start dev server (localhost:3000)
npm run build     # production build
npm run start     # run production build
npm run lint      # eslint (flat config, eslint-config-next core-web-vitals + typescript)
```

No test runner is configured in `package.json` — there are no unit/integration tests in
this repo yet.

Database (Prisma + PostgreSQL/Neon):
```bash
npx prisma migrate dev      # create/apply a migration in dev
npx prisma generate         # regenerate the Prisma client after schema changes
npx prisma studio           # browse the database
```
`prisma/seed.ts` exists but is currently empty (no seed data).

Required env vars are validated by `src/config/env.ts` at import time (Zod) — see
`env.example` for the full list (`DATABASE_URL`, `DIRECT_URL`, `REDIS_URL`,
`BETTER_AUTH_SECRET`, `SESSION_SECRET`, `RESEND_API_KEY`, `GOOGLE_CLIENT_ID/SECRET`,
`GITHUB_CLIENT_ID/SECRET`, `CORS_ORIGIN`, `PORT`, `NODE_ENV`). Missing any of these throws
at startup.

## Documentation already in this repo — read these first

This repo maintains hand-written architecture docs that are more detailed than a typical
CLAUDE.md should duplicate. Prefer reading them over re-deriving structure from scratch:

- **`Docs/docs.md`** — per-file reference: every exported function/class in `src/` and
  `prisma/`, with inputs/outputs and known bugs inline. A browsable copy is at
  `Docs/site/index.html`.
- **`Flow.md`** — traces actual request flow between files (who calls whom, in what
  order) for auth, tree CRUD, and reporting. Complements `docs.md`, which documents
  functions in isolation.
- **`Decisions.md`** — the *why* behind non-obvious implementation choices (library
  picks, schema consolidation history, pixel-tuned layout decisions on the homepage).
- **`ChangeLog.md`** — chronological record of *when* things changed.
- **`Docs/database/entities.md`** / **`Docs/database/UserEntities.md`** — original design
  notes that predate the current `prisma/schema.prisma`; the schema itself is the source
  of truth where they disagree.

**These docs are timestamped snapshots (`Flow.md`/`Docs/docs.md` are dated 2026-08-13)
and are already stale in places** — e.g. the admin API surface under
`src/app/api/v1/admin/**`, per-node profile routes (`family-profile`,
`organization-profile`, `tribe-profile`), `derived-relationships`, tree
`import`/`export`, `analytics`, `timeline`, and `contributors` endpoints, and
`src/modules/tree/relationship-deriver.ts` all postdate that snapshot and aren't
documented there. Verify against the actual file before trusting a doc claim that affects
your change — `git log` on the specific file is the fastest way to check.

## Architecture

Next.js 15 App Router + Prisma + PostgreSQL (Neon) + Better Auth + Redis + Zod, in a
layered module style:

```
src/
├── app/            → routes only: pages (marketing site) + API route handlers
│   ├── api/auth/[...all]/  → Better Auth's own catch-all handler (session, OAuth, etc.)
│   ├── api/trees/          → tree CRUD, nodes, relationships, invitations, export/import,
│   │                          analytics, timeline, contributors — mostly construct their
│   │                          own TreeRepository/TreeService per route
│   ├── api/v1/admin/       → admin-only endpoints (users, trees, nodes, relationships,
│   │                          reports, content, settings), gated by requireAdmin()/
│   │                          requireSuperAdmin() from src/lib/auth/permissions.ts
│   ├── auth/, forgot-password/, reset-password/, verify-email/, resend-verification/
│   │                       → thin wrappers re-exporting src/modules/auth/auth.router.ts handlers
│   └── components/         → presentational React for the public marketing homepage only
│                              (no data fetching, no auth checks)
├── config/          → process-wide singletons: env (Zod-validated), database (Prisma
│                       client #1), auth (the one Better Auth instance), redis (hand-rolled
│                       RESP client, no external Redis lib)
├── lib/             → response envelope (ApiResponse/successResponse/errorResponse),
│                       error mapping (handleApiError), a second Prisma client singleton
│                       (src/lib/prisma.ts — see below), admin permission gates
├── middleware/       → NOT Next.js middleware.ts — plain functions a route calls manually
│                       (authenticate(), authorize()); nothing runs automatically per-request
├── modules/
│   ├── auth/         → controller → service → validators, thin wrapper over Better Auth's
│   │                    auth.api.* — this is the actual auth logic layer
│   └── tree/          → constants/errors/permissions/repository/service/types/validator,
│                         plus relationship-deriver.ts (pure graph traversal to label
│                         derived relationships like grandmother/cousin/in-law at query
│                         time — deliberately Prisma-free/unit-testable) and
│                         tree.import-export.service.ts (JSON/CSV/PDF export via pdfkit,
│                         JSON import)
└── shared/auth/       → app-wide AuthRole/permission tables consulted by
                          src/middleware/authorize.ts
```

Key structural facts worth knowing before editing:

- **Two independent Prisma client singletons exist**: `src/config/database.ts` (`prisma`,
  reads validated `env`) and `src/lib/prisma.ts` (`prisma`, reads `process.env.NODE_ENV`
  directly). Newer admin routes (`src/app/api/v1/admin/**`) import from `src/lib/prisma`;
  older tree routes import from `src/config/database`. Check which one a neighboring file
  in the same directory uses before adding an import.
- **Two independent permission systems exist**: `src/shared/auth/permissions.ts` +
  `src/middleware/authorize.ts` (tree-scoped `AuthRole`/`AuthPermission`, consulted by
  `authorize()`) and `src/modules/tree/tree.permissions.ts` (`TreeMemberRole` →
  boolean capability checks). They model overlapping but differently-shaped hierarchies
  and are not wired together. A third, simpler gate — `src/lib/auth/permissions.ts`
  (`requireAdmin`/`requireSuperAdmin`, checks `User.role`) — is what the `v1/admin`
  routes actually use.
- **Route handlers do their own inline session checks** via
  `auth.api.getSession({ headers: await headers() })` (tree routes) rather than calling
  `authenticate()` from `src/middleware/authenticate.ts` — that helper is only used by
  `authController.getCurrentUser`. Follow the pattern already used by sibling routes in
  the same directory rather than introducing a third convention.
- **`TreeNode`** (in `prisma/schema.prisma`) is the generic person/entity model shared
  across all three tree types (`FAMILY`, `ORGANIZATION`, `TRIBE`); type-specific fields
  live in the 1:1 `FamilyProfile`/`OrganizationProfile`/`TribeProfile` side tables, not on
  `TreeNode` itself, aside from a few common fields (`occupation`, `bloodGroup`) kept on
  both for convenience.
- **Only fundamental relationships are stored** as `Relationship` graph edges (`PARENT`,
  `SPOUSE`, `PARTNER`, `SIBLING`, `GUARDIAN`, `MANAGER`, `FRIEND`). Derived labels
  (grandmother, aunt, cousin, in-law, etc.) are never persisted — they're computed on read
  by `src/modules/tree/relationship-deriver.ts`.
- Soft-delete convention: models with a `deletedAt` column (User, Tree, TreeNode, Story,
  Conversation, Message, Meeting, Notification) are archived by setting `deletedAt`, not
  by removing the row — see `TreeRepository.softDelete`/`.restore` for the pattern to
  follow elsewhere.
- `prisma/schema.prisma`'s own header comment documents the consolidation history (removed
  duplicate model drafts, renamed `VerificationToken` → `Verification` to match Better
  Auth's expected model name, added `@@map` snake_case table names) — read it directly if
  a migration or model shape looks surprising.
- The homepage (`src/app/page.tsx` and `src/app/components/homepage/*`) is presentation-only
  marketing content with hand-tuned pixel/percentage layout constants (see `OurJourney.tsx`
  and the corresponding `Decisions.md` entries) — don't "clean up" magic numbers there
  without reading the relevant Decisions.md entry first, they were tuned to fix specific
  visual overlap bugs.
