---
feature: manage-order/service-on-pipeline
phase: to_review
priority: P0
created: 2026-11-09
wip_started: 2026-11-09
review_requested: 2026-11-09
source: ai_reactive_framework/context/requirements/fluvo-rfc.md
---

# Business Specification — manage-order/service-on-pipeline

---

## 1. Objective

This feature enables a CRM user to create, edit, move, and delete deals (order/service cards) within pipeline stages. A deal represents a business opportunity linked to a contact, an order, and a pipeline stage. It captures the value, probability, expected close date, and position within a stage column. The pipeline board is the primary productivity surface for sales teams, so this feature is core to the CRM's value proposition. The move action specifically allows drag-and-drop reordering between stages, keeping the board in sync with the actual sales workflow.

---

## 2. Scope

| In scope | Out of scope |
|----------|-------------|
| Create a deal on a pipeline stage | Creating the pipeline stage itself (`/api/pipeline/stages`) |
| List deals, optionally filtered by stage | Real-time push updates to connected clients (WebSocket) |
| Get a single deal by ID | Sending notifications on deal status change |
| Update deal fields (title, value, probability, etc.) | Payment processing or invoicing |
| Move a deal to a different stage and/or position | Order item management (handled by `/api/orders`) |
| Delete a deal | Generating reports or analytics from deal data |
| Link a deal to a contact and/or an order | Authentication and authorization (handled by middleware) |

---

## 3. Actors

| Actor | Description |
|-------|-------------|
| Authenticated User | A logged-in CRM user (manager, collaborator, admin) who manages deals on the pipeline board |
| Business | The multi-tenant owner of all pipeline stages and deals; all data is scoped by `businessId` |
| Contact | An existing CRM contact referenced by a deal as the associated customer |
| Order | An existing order optionally linked to a deal for fulfillment tracking |

---

## 4. User Stories

### Story 1 — Create a deal on a stage

**Given** a user is viewing the pipeline board and a stage exists  
**When** they submit a new deal with a title, value, stageId, and contactId  
**Then** the deal is created and appears at the top (or given position) of the target stage column

### Story 2 — Move a deal between stages

**Given** a deal exists on stage A  
**When** the user drags it to stage B at position 2  
**Then** the deal's `stageId` and `position` are updated and the board reflects the new arrangement

### Story 3 — Update deal details

**Given** a deal exists with an initial probability and expected close date  
**When** the sales rep updates the probability to 95% and changes the close date  
**Then** the deal record is updated and the board card reflects the new values

---

## 5. Acceptance Criteria

- [ ] `POST /api/pipeline/deals` creates a deal scoped to the authenticated `businessId` and returns `201` with the created deal
- [ ] `GET /api/pipeline/deals` returns a paginated list of deals for the business; supports filtering by `stageId`
- [ ] `GET /api/pipeline/deals/:id` returns a single deal; returns `404` if not found or belongs to a different business
- [ ] `PUT /api/pipeline/deals/:id` updates allowed fields; returns `422` if Zod validation fails; returns `404` if not found
- [ ] `POST /api/pipeline/deals/:id/move` updates `stageId` and `position`; returns `200` with updated deal; returns `404` if deal or target stage not found
- [ ] `DELETE /api/pipeline/deals/:id` removes the deal; returns `204`; returns `404` if not found
- [ ] All endpoints return `401` for requests with missing or invalid JWT
- [ ] All queries are scoped by `businessId` — a user cannot access deals from another business

---

## 6. API Contract

### Endpoint — List deals

```
GET /api/pipeline/deals?stageId=<uuid>&page=1&pageSize=20
```

**Response — 200 OK**
```json
{
  "data": [
    {
      "id": "uuid",
      "stageId": "uuid",
      "title": "Deal title",
      "value": 12000,
      "currency": "USD",
      "probability": 95,
      "contactId": "uuid",
      "assignedTo": "uuid",
      "expectedCloseDate": "2026-12-31T00:00:00.000Z",
      "notes": "Notes about deal",
      "tags": ["tag1"],
      "position": 0,
      "orderId": "uuid",
      "createdAt": "2026-11-09T00:00:00.000Z",
      "updatedAt": "2026-11-09T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

### Endpoint — Create deal

```
POST /api/pipeline/deals
```

**Request body:**

```json
{
  "stageId": "uuid-of-stage",
  "title": "Deal title",
  "value": 12000,
  "currency": "USD",
  "probability": 95,
  "contactId": "uuid-of-contact",
  "assignedTo": "uuid-of-user",
  "expectedCloseDate": "2026-12-31T00:00:00.000Z",
  "notes": "Notes about deal",
  "tags": ["business_name"],
  "position": 0,
  "orderId": "uuid-of-order"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `stageId` | `string (uuid)` | Yes | Must reference an existing PipelineStage belonging to the business |
| `title` | `string` | Yes | min length 1 |
| `value` | `number` | No | ≥ 0 |
| `currency` | `string` | No | default `"USD"` |
| `probability` | `number` | No | 0–100 |
| `contactId` | `string (uuid)` | No | Must reference an existing Contact in the business |
| `assignedTo` | `string (uuid)` | No | Must reference an existing User in the business |
| `expectedCloseDate` | `string (ISO 8601)` | No | Valid date |
| `notes` | `string` | No | — |
| `tags` | `string[]` | No | — |
| `position` | `number (int)` | No | ≥ 0, default 0 |
| `orderId` | `string (uuid)` | No | Must reference an existing Order in the business |

**Response — 201 Created:** deal object

---

### Endpoint — Move deal

```
POST /api/pipeline/deals/:id/move
```

**Request body:**

```json
{
  "stageId": "uuid-of-target-stage",
  "position": 2
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `stageId` | `string (uuid)` | Yes | Must reference an existing PipelineStage belonging to the business |
| `position` | `number (int)` | Yes | ≥ 0 |

**Response — 200 OK:** updated deal object

---

### Response — Error

```json
{
  "message": "human-readable message",
  "error": "error_type_key",
  "status": 404
}
```

---

## 7. Business Rules

| # | Rule | Rationale |
|---|------|-----------|
| BR-01 | All deal reads and writes are scoped to the authenticated `businessId` — no cross-business access | Multi-tenancy isolation requirement |
| BR-02 | `stageId` on create/move must belong to the same business as the deal | Prevents orphaned deals on foreign stages |
| BR-03 | `position` values within a stage do not need to be contiguous — gaps are acceptable | Avoids expensive re-sequencing on every move; clients sort by position ascending |
| BR-04 | Deleting a deal does not delete the linked Order — the relationship is optional and non-cascading | An order may exist independently of the pipeline |
| BR-05 | A deal may exist without a `contactId` or `orderId` — these are optional links | Allows early-stage prospecting before a contact or order is created |

---

## 8. State Transitions

```
[stage A, position N] ──[move]──► [stage B, position M]
```

| From | Trigger | To | Guard condition |
|------|---------|-----|----------------|
| Any stage | `POST /deals/:id/move` | Target stage, new position | Target stageId must belong to the same business |
| Active deal | `DELETE /deals/:id` | Deleted (soft or hard) | Deal must belong to the authenticated business |

---

## 9. Error Cases

| Scenario | Error Type | HTTP Status | Message |
|----------|-----------|-------------|---------|
| Missing required field (`stageId`, `title`) | `bad_request_error` | 422 | Zod validation message for the failing field |
| Deal not found or belongs to another business | `not_found_error` | 404 | "Deal not found" |
| Target stage not found on move | `not_found_error` | 404 | "Stage not found" |
| Invalid JWT or no Authorization header | `unauthorized_error` | 401 | "Unauthorized" |
| Unexpected DB or server failure | `internal_server_error` | 500 | "Internal server error" |

---

## 10. Non-Functional Requirements

| Attribute | Target |
|-----------|--------|
| Latency (p99) | < 300 ms (simple CRUD); < 500 ms (move with re-sequencing) |
| Availability | 99.9% |
| Throughput | Matches platform MySQL connection pool limits |
| Data sensitivity | Non-PII (deal titles/values); `contactId` is a reference, not PII itself |

---

## 11. Dependencies

| System | Type | Purpose |
|--------|------|---------|
| `lib/db/models/deal.model.ts` | Sequelize / MySQL | Persist and query deal records |
| `lib/db/models/pipeline-stage.model.ts` | Sequelize / MySQL | Validate stageId FK and business scoping on move |
| `lib/db/models/contact.model.ts` | Sequelize / MySQL | Optional FK resolution for contactId |
| `lib/db/models/order.model.ts` | Sequelize / MySQL | Optional FK resolution for orderId |
| `schemas/pipeline.schema.ts` | Zod schema | Input validation for create and move payloads |
| `lib/utils/auth-context.ts` | Internal utility | Extract businessId / userId from request headers |
| `lib/utils/api-response.ts` | Internal utility | Uniform `ok()` / `err()` response format |
| `lib/utils/pagination.ts` | Internal utility | Page / pageSize / offset for list endpoint |
| `ai_reactive_framework/context/0-context.md` | Knowledge base | Tech stack and architectural conventions |
| `ai_reactive_framework/1-business_layer/templates/business_rules_template.md` | Template | Spec structure |

---

## 12. Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| OQ-01 | Should moving a deal re-sequence all positions within the target stage to close gaps, or leave gaps? | — | — |
| OQ-02 | Should deal deletion be soft (set `deletedAt`) or hard? If soft, is there a restore flow needed? | — | — |
