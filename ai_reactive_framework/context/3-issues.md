# Issues & Blockers — web-crm-be (Fluvo CRM)

## Open Issues

_No open issues documented at this time._

---

## Risks

### R1 — JWT_SECRET fallback in production
- **Probability:** Medium (misconfiguration during deployment)
- **Impact:** Critical — tokens signed with the fallback secret are universally forgeable
- **Affected component:** `middleware.ts` — JWT verification
- **Mitigation:** Enforce `JWT_SECRET` as a required env var at startup; reject startup if missing in `NODE_ENV=production`.
- **Description:** The current code falls back to `"fallback_secret_change_in_production"` when `JWT_SECRET` is unset. Any token signed with this known string is valid, allowing auth bypass.

### R2 — CORS wildcard `*` in production
- **Probability:** Medium (default if `ALLOWED_ORIGIN` is not set)
- **Impact:** Medium — cross-origin requests from any domain are accepted
- **Affected component:** `middleware.ts` — CORS headers
- **Mitigation:** Set `ALLOWED_ORIGIN` to the frontend origin in production env. Document this requirement in deployment runbook.
- **Description:** `ALLOWED_ORIGIN` defaults to `*`. In production this should be locked to the Angular frontend's origin to prevent CSRF-style attacks.

### R3 — No database migration framework
- **Probability:** High (affects every new model or schema change)
- **Impact:** Medium — schema changes require manual coordination or ad-hoc scripts
- **Affected component:** `lib/db/models/` — Sequelize models
- **Mitigation:** Adopt `sequelize-cli` migrations or `umzug` to manage schema versions. Keep scripts in `scripts/migrate-database.js`.
- **Description:** Currently there is no formal migration system. Schema is applied ad-hoc. This creates risk of drift between environments.

### R4 — No test suite
- **Probability:** High (no test files observed)
- **Impact:** Medium — regressions are caught only in manual testing or production
- **Affected component:** All API route handlers
- **Mitigation:** Add Jest + Supertest for integration tests per module. Mock Sequelize with `sequelize-mock` or use an in-memory SQLite instance.
- **Description:** No unit or integration tests exist. Any change to a route handler or schema has no automated safety net.

---

## Known Limitations

| # | Component | Limitation | Acceptable? |
|---|-----------|-----------|-------------|
| 1 | Validation | Only the first Zod issue is returned (`issues[0].message`) — clients receive one error at a time | Yes — simple; can improve to return all issues later |
| 2 | Error responses | Raw `'Internal server error'` with no error code — debugging requires server logs | Yes for now; consider structured error codes |
| 3 | Auth middleware | Public path list is hardcoded in `middleware.ts` — adding new public routes requires code change | Yes — intentional; reduces accidental exposure |
| 4 | Pagination | No max `pageSize` enforced — a client could request thousands of rows | Acceptable short-term; add `Math.min(pageSize, 100)` guard |

---

## Knowledge Base Gaps

| Area | Missing Information | Source File Expected | Priority |
|------|--------------------|--------------------|---------|
| Testing | No testing conventions or patterns documented | `ai_reactive_framework/4-assisted_code_layer/testing/testing_template.md` | P0 |
| Migrations | No migration strategy documented | `scripts/migrate-database.js` or dedicated migration docs | P0 |
| Observability | No logging or metrics strategy defined | `ai_reactive_framework/3-observability_layer/metrics/suggested_metrics.md` | P1 |
| Deployment | No Docker / CI/CD runbook for production deployment | `Dockerfile`, `docker-compose.yml` present but undocumented | P1 |

---

## Build & Infrastructure Issues

| # | Issue | Component | Status |
|---|-------|-----------|--------|
| 1 | No integration test suite — no automated tests for any API route | `app/api/` | Open |
| 2 | `JWT_SECRET` not validated at startup — missing env var silently uses insecure fallback | `middleware.ts` | Open |
| 3 | No formal DB migration system — schema changes are applied manually | `lib/db/models/` | Open |
| 4 | `ALLOWED_ORIGIN` defaults to `*` — CORS is fully open if env var not set | `middleware.ts` | Open |

---

## Resolved Issues

_No resolved issues documented at this time._
