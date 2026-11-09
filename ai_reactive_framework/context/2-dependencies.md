# Dependencies — web-crm-be (Fluvo CRM)

## External Dependencies

### Public Registry (npmjs.com)

#### Runtime

| Package | Import Path | Version | Purpose |
|---------|-------------|---------|---------|
| Next.js | `next` | 14.2.35 | App Router, API routes, middleware |
| Sequelize | `sequelize` | ^6.37.8 | ORM for MySQL |
| mysql2 | `mysql2` | ^3.24.6 | MySQL driver (Sequelize peer dep) |
| Zod | `zod` | ^4.6.7 | Runtime schema validation |
| jose | `jose` | ^6.2.12 | JWT sign / verify (Web Crypto API) |
| bcryptjs | `bcryptjs` | ^3.0.3 | Password hashing |
| dotenv | `dotenv` | ^18.0.8 | Env var loading |
| React | `react` | ^18 | Next.js peer dep |
| React DOM | `react-dom` | ^18 | Next.js peer dep |

#### Dev

| Package | Import Path | Version | Purpose |
|---------|-------------|---------|---------|
| TypeScript | `typescript` | ^5 | Type checking |
| @types/node | `@types/node` | ^20 | Node.js type definitions |
| @types/react | `@types/react` | ^18 | React type definitions |
| @types/bcryptjs | `@types/bcryptjs` | ^3.0.0 | bcryptjs types |
| ts-node | `ts-node` | ^10.9.2 | TypeScript script runner (migrations) |
| tsconfig-paths | `tsconfig-paths` | ^4.2.0 | Path alias resolution for ts-node |

---

## Internal Dependencies

### Layer → Layer Mapping

| Caller | Called | Pattern |
|--------|--------|---------|
| `middleware.ts` | `jose` | JWT verify on every protected request |
| `app/api/*/route.ts` | `lib/utils/auth-context.ts` | Extract businessId / userId from headers |
| `app/api/*/route.ts` | `lib/utils/api-response.ts` | Uniform `ok()` / `err()` responses |
| `app/api/*/route.ts` | `lib/utils/pagination.ts` | Extract page / pageSize / offset |
| `app/api/*/route.ts` | `schemas/<domain>.schema.ts` | Zod validation of request body |
| `app/api/*/route.ts` | `lib/db/models/index.ts` | Sequelize CRUD operations |

### Shared Utilities

| Utility | Path | Used By |
|---------|------|---------|
| Response helpers | `lib/utils/api-response.ts` | All route handlers |
| Auth context | `lib/utils/auth-context.ts` | All protected route handlers |
| Pagination | `lib/utils/pagination.ts` | All list (GET) endpoints |
| DB models | `lib/db/models/` | All route handlers |
| Zod schemas | `schemas/` | All POST/PUT handlers |
| JWT payload type | `types/auth.ts` | `middleware.ts`, `auth-context.ts` |

### Module → Schema Mapping

| Module | Schema File |
|--------|-------------|
| auth | `schemas/auth.schema.ts` |
| business | `schemas/business.schema.ts` |
| inbox | `schemas/conversation.schema.ts` |
| pipeline | `schemas/pipeline.schema.ts` |
| catalog | `schemas/catalog.schema.ts` |
| map | `schemas/map.schema.ts` |
| orders | `schemas/order.schema.ts` |
| agenda | `schemas/appointment.schema.ts` |
| contacts | `schemas/contact.schema.ts` |
| agent | `schemas/agent.schema.ts` |
| config | `schemas/config.schema.ts` |

### Module → Models Mapping

| Module | Models Used |
|--------|-------------|
| auth | User, Business, Role |
| business | Business, Location |
| inbox | Conversation, Message, Contact |
| pipeline | PipelineStage, Deal, Contact, Order |
| catalog | Product, CatalogCategory |
| map | Floor, Room, Table |
| orders | Order, OrderItem, Contact, Product, Table, Location |
| agenda | Appointment, Contact, User |
| contacts | Contact, ContactNote |
| agent | AgentConfig, AgentLog |
| labs | FeatureFlag |
| config | User, Role, Integration |

---

## Knowledge Base Directory

| Domain | Directory | Files |
|--------|-----------|-------|
| Architecture spec | `ai_reactive_framework/2-core_layer/architecture_specification/` | `patterns_design_catalog.md`, `architecture_patterns_catalog.md` |
| Platform spec | `ai_reactive_framework/2-core_layer/platform_specification/` | TypeScript/Next.js conventions |
| Observability | `ai_reactive_framework/3-observability_layer/metrics/` | `suggested_metrics.md` |
| Business templates | `ai_reactive_framework/1-business_layer/templates/` | `business_rules_template.md`, `plan_template.md` |
| Testing | `ai_reactive_framework/4-assisted_code_layer/testing/` | `testing_template.md` |

---

## Constraints

- All API routes except `/api/auth/login` and `/api/auth/register` require a valid JWT Bearer token.
- Every DB query MUST include `where: { businessId }` — no cross-business data access.
- `JWT_SECRET` must be set in production — the fallback value is insecure.
- `ALLOWED_ORIGIN` should be set to the actual frontend origin in production — do not leave as `*`.
- Sequelize model associations must be registered in `lib/db/models/index.ts` before use.
- Use `DataTypes.UUIDV4` for all primary keys — no auto-increment integers.
