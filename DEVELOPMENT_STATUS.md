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

## 2026-10-28 11:58–12:xx JST — v32 review continuation (run 4)

### Preflight / safety
- Reused existing review PR #4: https://github.com/dog820shion1995-bit/baselayer-website/pull/4 ; no new PR.
- Read previous run log and prior head `338146aadb3d1aacced6084d8d70c5b33c2ada3f`; main is a separate storage-decision journey, while v32 targets legacy v31. Before this run, branch was **28 ahead / 37 behind main**. Do not merge PR wholesale.
- GitHub workflow lookup on the prior head returned no pull-request workflow runs; this is **not** proof CI passed or failed.

### Verified source-backed data saved (review branch only)
- **1 new product:** Synology **DS925+**, with **9 newly recorded hardware specifications**, **0 existing products supplemented**.
- Source: Synology official Japanese DS925+ Product Specification, updated **2026-08-06**, https://global.download.synology.com/download/Document/Hardware/ProductSpec/DiskStation/25-year/DS925%2B/jpn/Product_Spec_DS925%2B_jpn.pdf ; reviewed **2026-10-28 JST**, pp.2–4. Records CPU Ryzen V1500B 4C/8T 2.2GHz, 4GB ECC (max 32GB), 4 SATA bays, 2 M.2 NVMe, 2 × 2.5GbE, 2 USB 3.2 Gen 1, USB-C expansion (DX525), dimensions, weight. The official source explicitly requires drive compatibility checks; availability and migration compatibility are not claimed.
- **1 new comparison relationship:** DS923+ → DS925+ as `suggested_alternative`, **not** `official_successor`. Warning documents 1GbE→2.5GbE differences, CPU and expansion-port changes, drive/DSM compatibility unknown, and need to check prices/stock.
- **0 new permitted real-product photos**; DS918+ remains the only permitted exact-model image metadata record. No manufacturer photo with unclear rights was added.
- Synced `product-data.js` and `relationship-data.js` with their source JSON files.

### Media regression tests and CI
- Added `tools/test_v32_media.py` with 10 offline cases covering valid DS918+ photo, fallback when no image, mismatched model/file, invalid license, missing creator, invalid rights source, future date, unapproved usage and duplicate model.
- Updated `.github/workflows/catalog-quality.yml` to run the unit tests on review-branch pushes and PR changes.
- PASS (V8/connector static inspection): **45 products**, **32** with sourced specifications, **4** relationships, **0** normalized brand/model duplicates, **0** missing relation endpoints, **0** source/date format errors; both generated JS files match JSON exactly; `app-v31.js`, `product-data.js`, `relationship-data.js` parse as JavaScript; CSS braces balanced; CI test command present.
- **Not verified:** actual Python unit test execution, GitHub Actions success, all external links' HTTP status, Commons image delivery, desktop/mobile browser regression, Pages deployment.
- The new DS925+ official PDF URL was accessible in web research on 2026-10-28. No main publication; PR remains review-only.

### Review branch commits
- `11840d98c65a7a0f8e628bcde1bd7cacfa219ee3` — DS925+ official-source data.
- `2db1dcf5efcb15c65a1ff5c103d9b544fa3ea1f6` — generated catalog.
- `041232e6aef951c5f3b4c282b92632300294c01e` — DS923+ comparison.
- `f3d51cf36ce5b29846725fdd0237dc115192d7d1` — generated relationships.
- `f7fd33d8e4ff06efe16a719563a2fb7f2d065f8d` — negative media tests.
- `7001b348e727b9d6096d8ff4a268dac04fa44a3c` — workflow test integration.

### Next actions
- Confirm Python test execution and workflow status; diagnose workflow non-execution if no checks appear.
- Reconcile the legacy v32 review branch with the current main storage journey in a controlled isolated integration; preserve both interfaces until browser regression is proven.
- Verify licensed Commons photo delivery and fallback on desktop/mobile; do not publish image rights or UI claims without verification.
- This run: **new products +1; existing specification supplements +0; new comparisons +1; newly licensed real photos +0; main commits 0**.

## 2026-10-28 12:59–13:xx JST — v32 review continuation (run 5)

### Preflight and publication boundary
- Reused review PR #4: https://github.com/dog820shion1995-bit/baselayer-website/pull/4 . The PR's review endpoint was accessible, but issue-search returned no PR results; do not infer mergeability from that search.
- Inspected previous status and prior commit `e79520152e594fa5d89bfe54411fbc6813c7ec05`, branch content, workflow, and current `main`. At start: review branch 35 ahead / 37 behind main.
- Current `main/index.html` is the storage/backup journey (not the v31 catalog); main head `31e7997b2f4c6f376a96cb66885e7f84e927454d`. **No main publication, no PR merge**; the review branch is still incompatible with a blind merge.

### Saved review-branch quality improvements
- Strengthened `tools/validate_v32_media.py`: Commons file-page and redirect path must match; rights evidence must identify the same Commons file; filename must contain the exact recorded model token; duplicate photo-file reuse is rejected; invalid media records are not counted as permitted.
- Added five negative media regression cases (15 media cases total).
- Reworked `tools/validate_relationships.py` to reject orphan comparison endpoints, missing/invalid/future evidence dates, missing suggested-alternative limitations, duplicate relationships, and unsubstantiated official-successor labels. Official-successor records now require same-brand manufacturer-hosted evidence and an attributable manufacturer statement; **these checks do not independently establish factual truth**.
- Added eight offline relationship tests. Workflow now includes both v32 test suites (**23 test definitions**) and Python compilation check.
- No new product specifications or comparison claims were introduced without fresh official evidence. No new photo was published without reuse permission.

### Review commits
- `18c0ea758d057b3fb7d52560767df6bb1d61396a` — tighten Commons media identity/rights gate.
- `4c3a96b979d862067501633892c6579d1595afce` — add five media negative cases.
- `7e7f7de3859ca058d4b75c61f1402bc6574f2003` — fail-closed relationship validation.
- `febd9c3007bf5252f9acaa0ebe056c9210241ba6` — add eight relationship cases.
- `47ff9799c40879a96c456a58d172216ca56a1067` — integrate both suites in CI.
- `953de810b9aecc196eb87255f909383ed65a5fe8` — Python compilation step.

### Validation and remaining blockers
- PASS (connector-fetched data checked in V8): 45 catalog products, 32 with recorded official-source specifications, 4 suggested-alternative relationships, 1 licensed-photo metadata record, no duplicate normalized product IDs, no orphan relationships, no invalid/future recorded source dates, JSON/JS generated data match, DS918+ Commons filename model-token match, v32 media fallback code present, workflow configured for both suites.
- NOT VERIFIED: Python `compileall` and 23 unittest cases actually executed, GitHub Actions passing result, external URLs' HTTP status, live image delivery, desktop/mobile browser regressions, current `main` deployment. The available workflow-run lookup is restricted to PR-triggered runs and returned no results; this does **not** prove push-triggered runs failed or never started.
- No live images or unsupported specifications were published. The one Commons image remains a review-branch metadata entry with CC BY-SA 4.0 attribution; actual rendering still unverified.
- This run's saved delta: **new products 0; existing specs supplemented 0; comparison relationships added 0; newly permitted real photos 0; main commits 0**.
- **Next:** obtain GitHub Actions run details and execute the Python suites; resolve the 37-commit divergence with current storage-journey architecture in isolated changes; verify actual Commons photo delivery and fallback on desktop/mobile before considering a small safe main release.

## 2026-10-28 14:00 JST — v32 review continuation (run 6)

### Preflight and deployment boundary
- Scheduled task confirmed enabled at start. Reused the existing PR #4: https://github.com/dog820shion1995-bit/baselayer-website/pull/4 . Read previous commit `62d7390e3597973cef69d529e4595f3238f52516`, branch, progress file, CI configuration and current main homepage before editing.
- At start, branch was **42 commits ahead / 37 behind** main; after review changes (before this status commit) **48 ahead / 37 behind**. Main remains a different storage/backup journey, so the whole PR is not safe to merge. **No main changes and no public release.**
- The container could not resolve github.com for a clone, and GitHub connector exposes no general push-workflow-run listing. A PR-triggered workflow lookup and combined-status lookup returned no entries; this is **not evidence of CI passing or failing**.

### Official-source additions (review branch only)
- Added two separate exact-SKU QNAP 4-bay NAS products: **TS-464-8G** and **TS-464-4G**, each with **10 official-source-backed hardware fields**: CPU, memory, 4 SATA bays, 2 M.2 slots, dual 2.5GbE, PCIe expansion, USB, HDMI, dimensions and weight.
- Source: [QNAP official Japanese TS-464 hardware specification](https://www.qnap.com/ja-jp/product/ts-464/specs/hardware), inspected **2026-10-28 JST**. The 8GB base-memory statement is specifically for the TS-464-8G entry **from 2024-01 onward**; the 4G SKU is separately identified. No current stock, support, price, drive compatibility, or photo usage rights were assumed.
- Added `www.qnap.com` to the QNAP-only official-source host allowlist; synchronized generated `product-data.js`.
- Added **two** evidence-linked `suggested_alternative` records: QNAP TS-464-4G → TS-464-8G (memory variant comparison) and Synology DS925+ → QNAP TS-464-8G (cross-brand 4-bay/dual-2.5GbE comparison). Both have explicit caveats and are **not** official-successor, interchangeability, or purchase claims. Synchronized `relationship-data.js`.
- Added isolated `nas-catalog-v32-preview.html` for review only: responsive NAS list, model/brand search, official-source links, specification disclosures, evidence-linked comparison notes, exact-model Commons license gate and category fallback. No manufacturer image without verified reuse rights is loaded. This preview is not linked from the current main site and has `noindex,nofollow`.

### Commits and verification
- `87e3a29fe94150e39f6a78a6d44ad69a3552ab71` — QNAP official-host allowlist.
- `c655f1f0156d47ab3a9dfd894a32c9f5ae4b9c81` — two sourced TS-464 SKU records.
- `387aea06aa7f63593211bb065afcea30a9e0f514` — regenerated product JS.
- `48b314f9a936877f477e851a0379e7d034691ed2` — two alternative relationships.
- `966b720ae6945f9010095e77ea8248a9827d5f7e` — regenerated relationship JS.
- `a26e7257b6a167e956cd48e7bf85940e3f2f5dfd` — isolated NAS review UI.
- PASS (connector-fetched files checked in V8): **47** products, **34** with source/spec metadata, **6** comparisons, **0** duplicate normalized product IDs, **0** orphan comparisons, source/date checks for new QNAP records, generated JS/JSON data equality, JS parse for `app-v31.js`, `product-data.js`, `relationship-data.js`, and preview inline JS; CSS braces balanced.
- Newly rights-approved real photos: **0**; cumulative licensed photo metadata: **1** (DS918+). No photo rights were invented.
- NOT VERIFIED: Python unittest execution (23 tests), GitHub Actions success, actual Commons image delivery, desktop/mobile browser interactions, deployment. The preview's static JavaScript parse does not prove functional browser behavior.

### Saved delta this run
- **New products +2; existing products' specification supplements +0; new-product specification fields +20; comparison relationships +2; newly rights-approved real photos +0; main commits 0.**
- Next: obtain actual GitHub Actions run details; run the Python tests and browser smoke checks; reconcile v32 with the live storage/backup architecture in a small tested integration; verify remote licensed image loading and fallback before any main release.
