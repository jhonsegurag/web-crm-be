---
generated: 2026-11-09
sources:
  - ai_reactive_framework/context/requirements/
  - ai_reactive_framework/context/1-features.md
  - ai_reactive_framework/context/2-dependencies.md
  - ai_reactive_framework/context/3-issues.md
---

═══════════════════════════════════════════════════════
  RF Implementation Plan
═══════════════════════════════════════════════════════

  Tech Stack:   TypeScript · Next.js 14 (App Router) · MySQL + Sequelize
  Architecture: JWT-protected REST API; multi-tenant by businessId; Zod validation on all writes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ALREADY IMPLEMENTED (in codebase, not formally tracked)
  ───────────────────────────────────────────────────────────────────────
  Module          Routes                                    Status
  ─────────────────────────────────────────────────────────────────────
  auth            POST login, POST register, GET me         complete
  pipeline        stages CRUD + deals CRUD + deal move      complete
  catalog         products CRUD + categories CRUD           complete
  orders          orders CRUD + items CRUD + status change  complete
  contacts        contacts CRUD + notes                     complete
  business        profile GET/PUT + locations CRUD          complete
  inbox           conversations CRUD + messages CRUD        complete
  agenda          appointments CRUD                         complete
  map             floors + rooms + tables CRUD              complete
  config          users + roles + integrations + toggle     complete
  agent           config GET/PUT + logs CRUD                complete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 IMPLEMENTATION ORDER
  ───────────────────────────────────────────────────────────────────────
  #  Feature                    Priority  Phase    Complexity  Blocker?
  ──────────────────────────────────────────────────────────────────────
  1  security-hardening         P0        backlog  low         R1, R2
  2  migrations                 P0        backlog  medium      R3
  3  test-suite                 P1        backlog  high        R4
  4  labs-admin                 P1        backlog  low         —
  5  pagination-guard           P2        backlog  low         —
  6  structured-error-codes     P2        backlog  low         —

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 FEATURE BREAKDOWN
  ───────────────────────────────────────────────────────────────────────

  [#1] security-hardening  ·  P0  ·  backlog
  ──────────────────────────────────────────
  Objective:      Eliminate the JWT_SECRET fallback and lock CORS to the frontend origin
  Layers needed:  middleware only
  Files to update:
    - middleware.ts  (validate JWT_SECRET at startup; set ALLOWED_ORIGIN guard)
    - .env.example   (add JWT_SECRET and ALLOWED_ORIGIN as required vars)
  Dependencies:   none (jose already installed)
  Risks:          R1 (Critical — JWT forgery), R2 (Medium — open CORS)

  [#2] migrations  ·  P0  ·  backlog
  ──────────────────────────────────────────
  Objective:      Establish a versioned DB migration system to safely evolve schema across envs
  Layers needed:  scripts + config
  Files to create:
    - scripts/migrate.ts           (migration runner via sequelize-cli or umzug)
    - migrations/<timestamp>-*.ts  (one migration per schema change)
    - .sequelizerc                 (path config for sequelize-cli)
  Files to update:
    - package.json  (add migrate / migrate:undo scripts)
  Dependencies:   sequelize-cli (add as devDep) or umzug ^3
  Risks:          R3 (Medium — schema drift between environments)

  [#3] test-suite  ·  P1  ·  backlog
  ──────────────────────────────────────────
  Objective:      Add automated integration tests for all API modules
  Layers needed:  test files per module
  Files to create:
    - jest.config.ts
    - __tests__/auth.test.ts
    - __tests__/pipeline.test.ts
    - __tests__/catalog.test.ts
    - __tests__/orders.test.ts
    - __tests__/contacts.test.ts
    - __tests__/inbox.test.ts
    - __tests__/agenda.test.ts
    - __tests__/map.test.ts
    - __tests__/config.test.ts
    - __tests__/agent.test.ts
    - __tests__/labs.test.ts
  Files to update:
    - package.json  (add jest, @types/jest, supertest deps + test script)
  Dependencies:   jest ^29, supertest ^7, @types/jest, @types/supertest
  Risks:          R4 (Medium — no safety net for regressions)

  [#4] labs-admin  ·  P1  ·  backlog
  ──────────────────────────────────────────
  Objective:      Complete the Labs module with admin CRUD for feature flags
  Layers needed:  schema + route handler
  Files to create:
    - app/api/labs/[key]/route.ts  (PUT to update flag value — already exists for GET)
    - app/api/labs/route.ts        (add POST to create flags — currently GET only)
  Files to update:
    - schemas/config.schema.ts     (add featureFlagSchema if not present)
  Dependencies:   FeatureFlag model already exists
  Risks:          none

  [#5] pagination-guard  ·  P2  ·  backlog
  ──────────────────────────────────────────
  Objective:      Cap pageSize at 100 to prevent unbounded DB queries
  Layers needed:  shared utility only
  Files to update:
    - lib/utils/pagination.ts  (add Math.min(pageSize, 100))
  Dependencies:   none
  Risks:          none

  [#6] structured-error-codes  ·  P2  ·  backlog
  ──────────────────────────────────────────
  Objective:      Add machine-readable error codes to all error responses for easier client handling
  Layers needed:  shared utility only
  Files to update:
    - lib/utils/api-response.ts  (extend err() to accept optional code string)
    - app/api/*/route.ts         (pass error codes on 404/422/500 responses)
  Dependencies:   none
  Risks:          none

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 DEPENDENCY READINESS
  ───────────────────────────────────────────────────────────────────────
  Package / Service              Status        Required by
  ─────────────────────────────────────────────────────────────────────
  next@14.2.35                   ✓ resolved    all modules
  sequelize@^6.37.8              ✓ resolved    all modules
  mysql2@^3.24.6                 ✓ resolved    all modules
  zod@^4.6.7                     ✓ resolved    all modules
  jose@^6.2.12                   ✓ resolved    auth, security-hardening
  bcryptjs@^3.0.3                ✓ resolved    auth
  sequelize-cli (devDep)         ✗ missing     migrations
  jest@^29 (devDep)              ✗ missing     test-suite
  supertest@^7 (devDep)          ✗ missing     test-suite
  @types/jest (devDep)           ✗ missing     test-suite
  @types/supertest (devDep)      ✗ missing     test-suite

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠ BLOCKERS & RISKS
  ───────────────────────────────────────────────────────────────────────
  [CRITICAL] R1 — JWT_SECRET fallback allows auth bypass in production
    Affects: security-hardening
    Action:  Add startup guard: if NODE_ENV=production && !JWT_SECRET → throw / exit

  [MEDIUM] R2 — CORS wildcard * exposes API to any origin
    Affects: security-hardening
    Action:  Enforce ALLOWED_ORIGIN in production via middleware.ts

  [MEDIUM] R3 — No DB migration framework
    Affects: migrations, any future schema change
    Action:  Add sequelize-cli + write initial migration from current model state

  [MEDIUM] R4 — No automated test suite
    Affects: test-suite, all modules
    Action:  Add Jest + Supertest; start with auth and pipeline as smoke tests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 NEXT STEPS
  ───────────────────────────────────────────────────────────────────────
  1. /rf_to_do security-hardening   — generate spec; fix JWT_SECRET + CORS in middleware.ts
  2. /rf_to_do migrations           — set up sequelize-cli + initial migration files
  3. /rf_to_do labs-admin           — complete Labs module with POST + PUT on feature flags
  4. Resolve R4                     — unblock test-suite with Jest + Supertest scaffold

═══════════════════════════════════════════════════════
