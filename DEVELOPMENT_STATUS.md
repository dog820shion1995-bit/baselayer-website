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
- Await and inspect GitHub Actions result for v32 branch; browser/UI smoke test remains outstanding.
- Inspect manufacturer reuse terms before adding any real photos; do not treat public URLs as permission.
- Add official-source-backed products and carefully scoped suggested alternatives; preserve v31 and legacy editors.
- Confirm real thumbnails and fallback rendering on desktop/mobile after permitted images become available.

## Run log
- 2026-10-27: Verified branch exists and initially matched main; reviewed PR #1, #2, #3; created initial v32 progress record.

## Demo run — verified results (2026-10-27 23:12 JST)
- Draft review PR: https://github.com/dog820shion1995-bit/baselayer-website/pull/4
- Progress baseline commit: `7113c9a42b6d54fa5333496754d6b150e48dfa8a`
- Thumbnail slot / licensing gate implementation: `3a438cc313373fdbc5af44443a4dbe74252d6b51`
- Responsive thumbnail styles: `1825d71a1a87c23447ab78e53a192e463b41de8f`
- Image review-date regex correction: `8d873d3992f716406072ad6dd98016c924846007`
- Product thumbnail slots are now rendered for home highlights, catalog search, detail dialog, comparison, alternatives, and configuration comparison. All 41 existing records currently fall back to category SVG illustrations; **no real product photos have been licensed or added**.
- JavaScript parse check: PASS (V8 `new Function`, syntax only; not a browser interaction test).
- Product JSON parse: PASS; 41 records, 28 with recorded source/date/specs, 0 duplicate brand/model pairs.
- Media date regex: PASS after correction.
- GitHub comparison: 4 commits ahead of main, 0 behind; only `DEVELOPMENT_STATUS.md`, `app-v31.js`, and `site-v31.css` changed.
- GitHub Actions `BASELAYER catalog data validation`: queued at check time; **not yet reported as passing**.
- New v32 products: **0**; specifications supplemented: **0**; new relationships: **0**; permitted real photos: **0**.
- main unchanged. PR remains draft and unmerged.

## Licensed real-photo pilot — 2026-10-27
- Commit `343fd0adbb920e71bc28583bf771b14af3c14cec` adds `image-pilot-v32.html` on the review branch only.
- Three exact-model real-photo pilot cards: Dell UltraSharp U2713HM (Dāvis Mosāns, CC BY 2.0), Synology DS 101 Rev 3.0 (Thiemo Schuff, CC BY-SA 3.0 DE), Synology DS918+ (mculi, CC BY-SA 4.0). Wikimedia Commons file pages and attribution/license links appear on each card.
- Pilot uses Wikimedia Commons image redirects; external image delivery and browser rendering have not yet been tested. Each card has a broken-image fallback.
- This is a separate photo pilot, **not three new verified catalog products**. No main merge or publication. Next: browser smoke test, image delivery check, then integrate suitable licensed photos with catalog records and product-media metadata only after matching exact models.

## 2026-10-28 08:55–09:00 JST — v32 review continuation

### Repository/PR preflight
- Existing draft PR: https://github.com/dog820shion1995-bit/baselayer-website/pull/4 (open; reuse this PR, do not open another).
- Prior branch head: `84e9cd0f4fad0d6d046fa5cd545a77ac06e25f53`.
- **Critical drift:** `main` has moved to a storage/backup decision-journey implementation. Before this run, v32 was 7 ahead / 37 behind; after the review changes it is 13 ahead / 37 behind, and GitHub reports **mergeable: false**. The v32 code targets legacy `app-v31.js`, not the current public architecture. **Do not merge PR #4 or copy its UI to main without an explicit integration and regression pass.** No public files were changed in this run.
- Previous workflow run #8 for the old head passed. New CI run for this head has not yet been confirmed; the unmergeable PR may prevent pull_request checks.

### Verified, saved work on review branch
- New product: **1**, Synology **DS918+** (historical 4-bay NAS; *not* represented as currently sold or recommended).
- New product's **7** source-backed specification fields: Intel Celeron J3455, 4GB DDR3L (max 8GB), 4 SATA bays, 2 M.2 NVMe 2280 slots, 2 × 1GbE, 2 USB 3.0 + 1 eSATA, 166 × 199 × 223mm. Source: [Synology official datasheet, hardware specifications p.3](https://global.download.synology.com/download/Document/Hardware/DataSheet/DiskStation/18-year/DS918%2B/enu/Synology_DS918_Plus_Data_Sheet_enu.pdf), checked **2026-10-28 JST**. These are historical published specs, not a claim of present-day support.
- **1** new permitted exact-model real-photo metadata record: DS918+ photographed by **mculi**, [Wikimedia Commons file page](https://commons.wikimedia.org/wiki/File:Synology_DS918%2B.png), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), rights checked **2026-10-28 JST**. This is one licensed image **metadata record**, not proof that remote image delivery works in every browser.
- Hardened `app-v31.js`: media only displays with exact brand/model identity, known CC license, creator, rights evidence, source, license URL, review date; otherwise category SVG fallback. Added visible creator/license credit and image-error fallback. Responsive attribution styles added to `site-v31.css`.
- Added `tools/validate_v32_media.py` and wired it into `.github/workflows/catalog-quality.yml` for exact-model, CC license, URL, and duplicate checks. `data/products.json` and generated `product-data.js` synchronized.

### Commits (review branch only)
- `de0b27d89a387b4ddb35ca893fc59d26eb2bb42e` — source-backed DS918+ record + licensed image metadata.
- `1cd03b5a43f3d97eeb47d2eb678b754ccaecb79a` — generated catalog synchronized.
- `2ed00e171d7443a97f1e59f4d3290a0483b52839` — exact-model media gate and attribution.
- `2dde1e8fa2dc4240fe8641e68e142a6bd1a73065` — attribution CSS.
- `f59f3b3e8b13625949c7247917029045f4e37629` — offline media validation.
- `eb156333003ef7f564af7a03bc82ddb65ce5cc34` — CI integration.

### Validation and unresolved work
- PASS: JSON parse, **42** total review-branch products, **29** records with source/date/specs, **0** duplicate normalized brand/model pairs, generated JS data matches JSON, `app-v31.js` parses as JavaScript, CSS brace balance, 1 exact-model permitted image metadata record.
- NOT YET VERIFIED: newly added Python CI check actually runs and passes, Commons image redirect delivery, desktop/mobile browser smoke test, and public deployment.
- **Blocking:** PR #4 cannot be safely merged with the new `main` architecture. Future run should reconcile the review branch against the latest `main` without losing the existing draft PR, adapt the photo/attribution design to current storage journey components, and run current-site regression tests. Do not force-merge or silently revert the new homepage.
- This run: new products **1**, existing product specs supplemented **0**, new comparison relationships **0**, permitted photo metadata records **1**. All changes are review-only.

## 2026-10-28 09:59 JST — v32 review continuation (run 2)

### Preflight
- Reused existing draft PR #4: https://github.com/dog820shion1995-bit/baselayer-website/pull/4; no new PR created.
- Inspected prior status, previous commit `c3d923234c7bf320091b27fc58a2f8fce6eaa6b5`, review branch and main comparison.
- Before changes: review branch 14 commits ahead and 37 behind main. The live homepage is now a storage/backup journey, not the old v31 catalog. **No main changes and no PR merge**; branch reconciliation and current-site browser regression remain blocking.

### Source-backed changes (review branch only)
- **1 new product**: Synology DS920+, historical 4-bay NAS, with **7 verified specifications** (CPU J4125, 4GB DDR4/max 8GB, 4 SATA bays, 2 M.2 NVMe slots, dual 1GbE, USB/eSATA, dimensions). Synology official Japanese product specification (2023-01-06 edition): https://global.download.synology.com/download/Document/Hardware/ProductSpec/DiskStation/20-year/DS920%2B/jpn/Product_Spec_DS920%2B_jpn.pdf ; checked **2026-10-28**. No claim of current availability/support.
- **1 new evidence-linked comparison**: DS918+ → DS920+ as `suggested_alternative`, **not** `official_successor`. This is a historical feature comparison, not a current buying recommendation or a verified migration/drive compatibility path. The source and warning are stored in `data/relationships.json` and displayed in the candidate UI.
- **0 existing product specification supplements** and **0 new licensed image records**. The prior DS918+ image record remains the only approved image metadata entry; Wikimedia Commons identifies mculi and CC BY-SA 4.0 at https://commons.wikimedia.org/wiki/File:Synology_DS918%2B.png (rechecked 2026-10-28). Actual browser image loading still unverified.
- Generated `product-data.js` and `relationship-data.js` synchronized with JSON. Added escaped comparison caution text and readable CSS.
- CI workflow now also triggers on review-branch pushes, since PR merge conflicts can prevent pull-request checks. GitHub workflow result **not yet available** when checked; this is not a CI PASS claim.

### Review commits
- `2a3f7071df449560be54e07ddac31ae25c20cf3c` — official-source DS920+ data.
- `f19ad25c2728f572f59aac6cf8d2a83dced304d0` — generated catalog.
- `8115db25d8dedf8a3c62f4b1f13dbb3205e19e3d` — historical comparison relationship.
- `096ad7b97ff29dc96211466729c074a0f3146da2` — generated relationships.
- `0154e0cc225d7926f0045a453139740a4074442f` — escaped comparison warning UI.
- `5d33bbcf3c18d5e4bee40fe4ae8f07e42d1f6c01` — warning CSS.
- `0d472ecb7157bb684f1d6755e2c8803c4aeaf8dd` — review-branch CI push trigger.

### Checks and remaining work
- PASS (connector-fetched code checked in V8): JavaScript syntax of `app-v31.js`, `product-data.js`, `relationship-data.js`; JSON parse; 43 product records, 2 comparison relationships; zero duplicate normalized model IDs; valid HTTPS source/date metadata; valid relation endpoints and types; generated JS/JSON exact data match; 1 rights-metadata-approved exact-model image; CSS brace count; relation warning present.
- NOT VERIFIED: GitHub Actions execution, Python validator runtime, network link status beyond inspected official PDF/Commons pages, browser interaction/mobile rendering, image delivery, live deployment.
- Post-change branch: 20 commits ahead / 37 behind main; PR #4 remains review-only and not safe to merge wholesale.
- **Next**: confirm CI execution; reconcile old v31 UI with current storage journey without overwriting the public homepage; implement a small isolated current-architecture component with real licensed media and category fallback; browser smoke test before any main publication.

## 2026-10-28 11:00 JST — v32 review continuation (run 3)

### Preflight and safety
- Reused the existing draft review PR #4: https://github.com/dog820shion1995-bit/baselayer-website/pull/4. GitHub PR changed-file listing confirmed it exists; no additional PR was opened.
- Read the v32 branch, prior commit `4ebd5462155ca88ec50f1d34f65f5a2c77ca74e2`, and this progress file. Before this run the branch was 22 commits ahead / 37 behind `main`.
- Current `main/index.html` is the storage/backup decision journey. The v32 UI still targets legacy `app-v31.js`; do **not** merge PR #4 wholesale. No main publication in this run.

### New sourced data and corrections (review branch only)
- Added **Synology DS923+** (one new product; 8 new-product hardware fields, **0 existing product fields supplemented**). Official Japanese datasheet: https://global.download.synology.com/download/Document/Hardware/DataSheet/DiskStation/23-year/DS923%2B/jpn/Synology_DS923%2B_Data_Sheet_jpn.pdf (2022 edition, p.5 hardware table), checked **2026-10-28 JST**. Fields: Ryzen R1600 dual-core CPU, 4 GB DDR4 ECC / max 32 GB, 4 SATA bays, 2 M.2 NVMe slots, dual 1GbE, optional 10GbE upgrade, USB/eSATA, dimensions. No claim of current sales/support.
- Added **one** DS920+ → DS923+ `suggested_alternative` comparison with source and explicit limitations. It is **not** an official-successor designation, migration compatibility assurance, or current purchase recommendation.
- Fixed an existing CI blocker: `tools/catalog_quality.py` had no Synology official-domain allowlist even though DS918+ and DS920+ already had sourced specs. Added only `global.download.synology.com` for Synology.
- Synchronized generated `product-data.js` and `relationship-data.js`. No new image was added; DS918+ remains the sole licensed-image metadata record.

### Review-only commits
- `e3f7fe5544194590653b4f79c18a96ff95cd8ac1` — Synology domain validator fix.
- `9bc2bcb2ddccb3ed123c7e4716bc48bbf2ac4e44` — DS923+ with eight sourced fields.
- `be8e4f0bffab3da106bd876001616012ff1c8268` — generated catalog.
- `f6b5aeb48a2d32a1cf04e616e7e4b8edeff6ac39` — suggested comparison.
- `1b639be6a25f66614d5a2fad66f12d373ae9e092` — generated comparison data.

### Checks and remaining blockers
- PASS (connector data checked with V8): **44** products; **31** with source/date/specs; **3** relationships; **0** duplicate normalized model IDs; **0** missing comparison endpoints; all source-backed product domains on approved allowlist; valid recorded dates; generated JSON/JS exact matches; JS parse of `app-v31.js`, `product-data.js`, and `relationship-data.js`; category fallback code present.
- Rights: **0 new** permitted real-product photos; **1 total** (DS918+ metadata). Commons source identifies author mculi and CC BY-SA 4.0, checked 2026-10-28: https://commons.wikimedia.org/wiki/File:Synology_DS918%2B.png. Remote image delivery and browser rendering still unverified.
- NOT VERIFIED: Python validators actually executed in GitHub Actions, workflow success, browser desktop/mobile regression, deployed pages, DS918+ image delivery. GitHub commit workflow lookup and combined statuses returned no runs/statuses for the latest commit at check time; this is **not** a passing CI result.
- After five code/data commits: branch 27 ahead / 37 behind `main`. Continue to preserve the current public storage journey. No main changes or PR merge.
- **Next:** confirm CI or diagnose workflow non-execution; add focused media-license negative tests; adapt the reviewed image/fallback component to the current storage journey in an isolated PR change, then run real browser tests before publishing any small complete unit.

### This run's saved delta
- New products: **1**; existing product specs supplemented: **0**; evidence-linked comparison relationships: **1**; newly rights-approved real photos: **0**; main commits: **0**.
