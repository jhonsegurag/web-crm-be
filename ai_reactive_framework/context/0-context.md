# Project Context — web-crm-be (Fluvo CRM)

## Module

```
web-crm-be
```

## Purpose

**web-crm-be** is the backend API for Fluvo CRM, a full-stack business management platform. It is built with Next.js 14 (App Router) and exposes REST endpoints consumed by the Angular frontend (`web-crm-fe`). It manages business operations including pipelines, catalog, orders, contacts, agenda, inbox, map (floors/tables), agents, and configuration.

All API routes are protected by JWT middleware except `/api/auth/login` and `/api/auth/register`. Auth context (businessId, userId) is extracted from the token and forwarded to handlers via request headers.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript | ^5 |
| Runtime | Node.js | ^20 |
| Framework | Next.js (App Router) | 14.2.35 |
| ORM | Sequelize | ^6.37.8 |
| Database | MySQL | via mysql2 ^3.24.6 |
| Validation | Zod | ^4.6.7 |
| Auth | JWT via jose | ^6.2.12 |
| Password hashing | bcryptjs | ^3.0.3 |
| Config | dotenv | ^18.0.8 |

## Architecture

```
web-crm-be/
├── app/
│   └── api/
│       ├── auth/          login, register, me
│       ├── business/      route.ts, locations/
│       ├── inbox/         conversations/, messages/
│       ├── pipeline/      stages/, deals/
│       ├── catalog/       products/, categories/
│       ├── map/           floors/, tables/
│       ├── orders/        route.ts, [id]/
│       ├── agenda/        appointments/
│       ├── contacts/      route.ts, [id]/
│       ├── agent/         config/, logs/
│       ├── labs/
│       └── config/        users/, roles/, integrations/
├── lib/
│   ├── db/
│   │   └── models/        Sequelize model definitions
│   └── utils/
│       ├── api-response.ts   ok() / err() helpers
│       ├── auth-context.ts   getAuthContext(req)
│       └── pagination.ts     parsePagination(req)
├── schemas/               Zod schemas per domain
├── types/
│   └── auth.ts            JwtPayload type
├── middleware.ts           JWT auth + CORS guard
├── instrumentation.ts
├── next.config.js / mjs
└── package.json
```

### Request Flow

```
HTTP Request
      ↓
middleware.ts  (JWT verify → inject x-business-id, x-user-id headers)
      ↓
app/api/<module>/route.ts  (Next.js App Router handler)
      ↓
getAuthContext(req)  →  { businessId, userId }
      ↓
Zod schema.safeParse(body)
      ↓
Sequelize Model.*  (findAndCountAll / create / update / destroy)
      ↓
ok(data, status) / err(message, status)
```

### Transport

- **Endpoint base**: `/api/`
- **Protocol**: HTTP/HTTPS — JSON REST
- **Auth**: Bearer JWT in `Authorization` header
- **CORS**: configured via `ALLOWED_ORIGIN` env var

## API Modules

| Module | Base Path | Key Resources |
|--------|-----------|--------------|
| Auth | `/api/auth` | login, register, me |
| Business | `/api/business` | business profile, locations |
| Inbox | `/api/inbox` | conversations, messages |
| Pipeline | `/api/pipeline` | stages, deals (move support) |
| Catalog | `/api/catalog` | products, categories |
| Map | `/api/map` | floors, tables |
| Orders | `/api/orders` | orders, order items |
| Agenda | `/api/agenda` | appointments |
| Contacts | `/api/contacts` | contacts |
| Agent | `/api/agent` | agent config, agent logs |
| Labs | `/api/labs` | feature flags / experiments |
| Config | `/api/config` | users, roles, integrations |

## Sequelize Models

| Model | File |
|-------|------|
| Business | `business.model.ts` |
| User | `user.model.ts` |
| Role | `role.model.ts` |
| Contact | `contact.model.ts` |
| ContactNote | `contact-note.model.ts` |
| Conversation | `conversation.model.ts` |
| Message | `message.model.ts` |
| PipelineStage | `pipeline-stage.model.ts` |
| Deal | `deal.model.ts` |
| Product | `product.model.ts` |
| CatalogCategory | `catalog-category.model.ts` |
| Floor | `floor.model.ts` |
| Room | `room.model.ts` |
| Table | `table.model.ts` |
| Order | `order.model.ts` |
| OrderItem | `order-item.model.ts` |
| Appointment | `appointment.model.ts` |
| AgentConfig | `agent-config.model.ts` |
| AgentLog | `agent-log.model.ts` |
| FeatureFlag | `feature-flag.model.ts` |
| Integration | `integration.model.ts` |
| Location | `location.model.ts` |

## Key Patterns

- **Auth context**: `getAuthContext(req)` extracts `{ businessId, userId }` from request headers (injected by middleware after JWT verification).
- **Response helpers**: `ok(data, status?)` returns `NextResponse.json({ data })` with 200 by default; `err(message, status)` returns error JSON.
- **Validation**: every POST/PUT handler calls `schema.safeParse(await req.json())`; on failure returns `err(issues[0].message, 422)`.
- **Pagination**: `parsePagination(req)` extracts `{ page, pageSize, offset }` from query params.
- **Multi-tenancy**: every query includes `where: { businessId }` to scope data to the authenticated business.
- **Zod schemas**: defined in `schemas/<domain>.schema.ts` and imported directly in route handlers.
- **Public routes**: `/api/auth/login` and `/api/auth/register` bypass JWT middleware.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` / `DB_*` | MySQL connection |
| `JWT_SECRET` | JWT signing secret (fallback: `fallback_secret_change_in_production`) |
| `ALLOWED_ORIGIN` | CORS allowed origin (default: `*`) |
| `NODE_ENV` | `development` / `production` |

## Feature Lifecycle

```
flow/1-to_do/     ← Business spec generated by /rf_to_do
flow/2-wip/       ← Active implementation via /rf_wip + /rf_implement
flow/3-to_review/ ← Ready for review via /rf_review
flow/4-done/      ← Completed via /rf_done
```

Use `/rf_context` to regenerate context files from requirement docs.
Use `/rf_plan` to generate a prioritized implementation plan.
Use `/rf_summary` to see all features, dependencies, and issues.
