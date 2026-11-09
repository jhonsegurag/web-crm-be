# Implementation Plan — web-crm-be (Fluvo CRM)

## Development Workflow

All features follow the AI-assisted reactive framework lifecycle:

```
1. /rf_to_do      → generate business spec in flow/1-to_do/
2. /rf_wip        → move to active development in flow/2-wip/
3. /rf_implement  → implement feature code from wip spec
4. /rf_review     → move to flow/3-to_review/
5. /rf_done       → merge and archive in flow/4-done/
```

---

## Layer Implementation Pattern

Every new API feature follows this vertical slice:

```
1. Zod schema         → schemas/<domain>.schema.ts
2. Sequelize model    → lib/db/models/<entity>.model.ts  (if new table)
3. Route handler      → app/api/<module>/route.ts  (GET + POST)
4. Sub-resource       → app/api/<module>/[id]/route.ts  (GET + PUT + DELETE)
5. Special actions    → app/api/<module>/[id]/<action>/route.ts
```

### Checklist per layer

**Zod schema**
- Colocate all field schemas for a domain in `schemas/<domain>.schema.ts`.
- Use `.safeParse()` in handlers — never throw on validation failure.
- Export individual schemas per resource (e.g., `productSchema`, `categorySchema`).

**Sequelize model**
- Use UUIDs as primary keys (`defaultValue: DataTypes.UUIDV4`).
- Always include `businessId` FK for multi-tenant scoping.
- Define associations in `lib/db/models/index.ts`.
- Use `timestamps: true` (createdAt / updatedAt auto-managed).

**Route handler**
- Extract auth context first: `const { businessId } = getAuthContext(req)`.
- Scope all queries: `where: { businessId }`.
- Validate input with Zod before touching the DB.
- Return `ok(data, 201)` for creates, `ok(data)` for reads/updates, `err('Not found', 404)` for missing records.
- Wrap in try/catch; return `err('Internal server error', 500)` on exception.
- Never leak raw Sequelize errors to the response.

**Pagination**
- Use `parsePagination(req)` for all list endpoints.
- Return `{ data: rows, total: count, page, pageSize }` via `ok(...)`.

---

## Key Architectural Decisions

**Next.js App Router for API routes.** Each `route.ts` exports named functions (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`). No Express or custom server — standard Next.js conventions.

**Middleware-based JWT auth.** A single `middleware.ts` intercepts all `/api/*` requests (except public auth routes), verifies the JWT, and injects `x-business-id` / `x-user-id` headers. Handlers never re-verify the token.

**Multi-tenant by design.** Every entity has a `businessId` FK. All queries are scoped with `where: { businessId }`. Cross-business data leakage is prevented at the query level.

**Zod for all input validation.** Schemas live in `schemas/` and are imported directly in handlers. No class-validator or manual checks — Zod `safeParse` with 422 on first error.

**Sequelize 6 with MySQL.** Models are class-based with TypeScript decorators. Associations are centralized in `lib/db/models/index.ts`. Migrations are managed via scripts.

**UUID primary keys.** All models use `DataTypes.UUIDV4` as default PK — no auto-increment integers exposed to clients.

---

## Critical Reference Files

| File | Purpose |
|------|---------|
| `middleware.ts` | JWT verification + CORS + public path list |
| `lib/utils/api-response.ts` | `ok()` / `err()` response helpers |
| `lib/utils/auth-context.ts` | `getAuthContext(req)` — extracts businessId, userId |
| `lib/utils/pagination.ts` | `parsePagination(req)` — page/pageSize/offset |
| `lib/db/models/index.ts` | Model registry + association definitions |
| `schemas/*.schema.ts` | Zod schemas per domain |
| `types/auth.ts` | `JwtPayload` type |
| `ai_reactive_framework/context/` | Runtime context files managed by `/rf_*` commands |
| `ai_reactive_framework/flow/` | Feature lifecycle directories |
