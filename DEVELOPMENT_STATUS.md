# BASELAYER v32 — Development status

Last reviewed: 2026-10-27 (JST)
Branch: `feature/v32-catalog-media-office`
Target: `main` (review only; do not merge or publish)

## Baseline and safety
- At the start of this review, the v32 branch matched `main` exactly (0 commits ahead).
- PR #2 (v31 UI) and PR #3 (catalog enrichment) are merged. PR #1 (manufacturer evidence) is open and is not the v32 review PR.
- PR #3 reports 41 catalog records, 28 records with recorded manufacturer evidence, and one suggested-alternative relationship. These are prior results, **not new v32 additions**.
- Never commit to `main`; never merge or publish without user approval.
- Keep v32 work in one draft PR and record each successful commit.

## v32 objectives
1. Add accessible product thumbnail slots to search, compare, detail, and network views, with stable category illustrations when no licensed image is available.
2. Permit real photos only with a verified reuse license or permission; record source URL, permission evidence, and check date. Do not assume that a publicly accessible image is licensed for reuse.
3. Add source-backed product records and category-specific comparisons. Do not infer exact specs, successors, or compatibility.
4. Validate JavaScript syntax, JSON integrity, model uniqueness, provenance, and UI behavior when tools allow.

## Initial progress
- Created this status file as the first small, auditable v32 commit.
- New product records in this commit: **0**.
- Existing records supplemented in this commit: **0**.
- New relationships in this commit: **0**.
- Permitted real-product photographs in this commit: **0**.
- UI changes in this commit: **0**.

## Next actions
- Create one draft v32 PR against `main`.
- Inspect the current v31 HTML/CSS/JS data contracts.
- Implement thumbnail fallback without changing legacy search or network editor behavior.
- Run syntax/data validation; record actual results, failures, and commit SHAs here.

## Run log
- 2026-10-27: Verified branch exists and initially matched main; reviewed PR #1, #2, #3; created initial v32 progress record.
