# SIPELKA Dashboard — Review & Backend Improvements

_Reviewed: 2026-05-31_

This document reviews the SIPELKA admin **dashboard** feature (web) and records the
backend changes that were implemented, a summary of frontend issues (left
unchanged on purpose), and recommend-only items found along the way.

## Scope

- **Backend:** fixed where it improves today's behavior; new **additive**
  endpoints added for a future frontend to adopt. The frontend was **not**
  modified.
- **Frontend:** documented only — no edits made.
- `application.yaml` config issues are **recommendations only** (not auto-changed,
  to avoid breaking local dev).

## Architecture (as-is)

- **Backend:** Spring Boot 4.0.5, Java 21, Spring Data JPA + Hibernate, PostgreSQL,
  JWT auth (stateless). `ddl-auto=update`, no migration tool (Flyway/Liquibase).
- **Frontend:** Next.js 16 / React 19 / TypeScript, Axios, Tailwind. The dashboard
  lives in `front-end-web-sipelka/app/dashboard/`.
- The dashboard overview (`app/dashboard/page.tsx`) renders 3 stat cards, a
  6-month "Monthly Research Trends" bar chart, a "Budget Utilization" donut, and a
  "Recent Submissions" table. It calls `GET /api/proposals/stats`,
  `GET /api/proposals`, and `GET /api/hibah`.

---

## Backend changes implemented

### 1. DB-level stats aggregation (was: load-all + 3 stream passes)
`ProposalService.getStats()` previously called `findAllWithPenelitiAndHibah()`,
loading **every** proposal and join-fetching `peneliti` + `hibah` it never used,
then ran three in-memory `stream().filter().count()` passes.

- **Now:** a single `GROUP BY status` query
  (`ProposalRepository.countGroupedByStatus()`), assembled into the same
  `ProposalStats(total, active, pending, ruleFailed)` record. **Response shape
  unchanged** — the frontend keeps working.

### 2. `getProposalsByPeneliti` — removed full-table scan + N+1
Previously `findAll().stream().filter(p -> p.getPeneliti().getId()...)`, which
loaded the whole table and lazily loaded `peneliti` per row.

- **Now:** `ProposalRepository.findByPenelitiIdWithDetails(UUID)` — a single
  fetch-join query. The `existsById` guard is retained.

### 3. Caching on stats
- New `config/CacheConfig.java` (`@EnableCaching`, default in-memory
  `ConcurrentMapCache` — **no new Maven dependency**).
- `@Cacheable("proposalStats")` on `getStats()`;
  `@CacheEvict(value="proposalStats", allEntries=true)` on `createProposal`,
  `updateProposal`, `submitProposal`.

### 4. Indexes on hot columns
Added to the `Proposal` entity `@Table(indexes=…)`:
`idx_proposal_status` (`status_proposal`), `idx_proposal_peneliti`
(`peneliti_id`), `idx_proposal_created_at` (`created_at`). Created automatically
by Hibernate via `ddl-auto=update`.

### 5. New: monthly trends endpoint (additive)
`GET /api/proposals/stats/monthly?months=6` → list of `{year, month, count}`,
computed in PostgreSQL (`countMonthlySince`) and zero-filled server-side.
**Fixes the frontend year-collision bug (F1) at the source** by keying on year
**and** month.

### 6. New: disbursement/budget stats endpoint (additive)
`GET /api/pencairan/stats` → `{totalCeiling, totalDisbursed, totalInProcess,
totalPending}`. Gives a **truthful** funding picture so a future frontend can
replace the misleading "Total Budget Allocated" card (F3). Sums computed at the
DB level.

### 7. New: recent proposals endpoint (additive)
`GET /api/proposals/recent?limit=5` → newest N by `createdAt desc`
(`findRecentWithDetails` with `Pageable`). Lets the "Recent Submissions" widget
stop fetching the entire table (F4).

> All new endpoints are additive and `ADMIN`-guarded by the existing
> `SecurityConfig` rules.

---

## Frontend issues (summary only — NOT changed)

| ID | Issue | Location | Notes |
|----|-------|----------|-------|
| **F1** | **Monthly-trends year collision.** Proposals bucketed by month *name* only (`months[d.getMonth()]`), so May 2025 and May 2026 merge. Also recomputed client-side over all rows. | `app/dashboard/page.tsx:54-71` | Fixed at source by new `/stats/monthly` (#5). |
| **F2** | **Budget donut is decorative, not data.** `strokeDasharray={programs.length * 25}` — arc length unrelated to actual values, yet labelled "Budget Utilization". | `page.tsx:266-268` | Needs a real proportional chart. |
| **F3** | **"Total Budget Allocated" mislabel.** Sums program `totalDanaMaksimal` (ceilings), not allocated/disbursed money. | `page.tsx:73,174` | Switch to `/api/pencairan/stats` (#6). |
| **F4** | **Over-fetching.** Pulls the full proposals list to show a 5-row table + the chart. | `page.tsx:29,35` | Use `/recent` (#7) and `/stats/monthly` (#5). |
| **F5** | **"Pending Reviews" includes DRAFTs.** `stats.pending` = `SUBMITTED` + `DRAFT`; drafts aren't awaiting review. | shown at `page.tsx:195` | Backend shape kept identical; changing it is a product decision. |
| **F6** | **Arbitrary 8s loading-timeout fallback** flips `loading=false` regardless of fetch state. | `page.tsx:45-47` | Drive loading off the request lifecycle. |
| **F7** | **Mixed languages.** "Belum ada data" among otherwise-English UI. | `page.tsx:221,261` | Pick one language / use i18n. |

---

## Other backend issues (recommend-only — not changed)

1. **JWT secret committed** in `application.yaml`. Externalize to `${JWT_SECRET}`.
2. **`spring.jpa.show-sql=true`** — noisy/slow outside dev; gate behind a profile.
3. **Authorization scope.** All dashboard data endpoints are **ADMIN-only**
   (`config/SecurityConfig.java`). Confirm REVIEWERs aren't meant to view it.

---

## Verification

1. **Build:** `mvnw.cmd clean compile` → **BUILD SUCCESS** (confirmed).
2. **Boot:** `mvnw.cmd spring-boot:run`. With `show-sql=true`, confirm Hibernate
   emits `create index` for the three new indexes.
3. **Stats unchanged + cached:** `GET /api/proposals/stats` returns the same JSON
   keys; SQL is now a single `GROUP BY`; second call is a cache hit; create/submit
   evicts.
4. **New endpoints:** `GET /api/proposals/stats/monthly?months=6`,
   `GET /api/proposals/recent?limit=5`, `GET /api/pencairan/stats` return valid JSON.
5. **Per-researcher:** `GET /api/proposals/peneliti/{id}` uses a single fetch-join
   query (no N+1 in the SQL log).
