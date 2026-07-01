---
name: git-release-commit
description: >-
  QA Bug Assistant release commit and semver versioning workflow. Use when the
  user says commit, release, version bump, changelog, or version history for this
  repository.
---

# Git Release Commit (QA Bug Assistant)

When the user asks to **commit**, treat it as a **versioned release commit** unless they explicitly say otherwise (e.g. "docs-only, no version bump").

## Commit title format

```
Release vX.Y.Z: <short summary in sentence case>.
```

Examples from this repo:

- `Release v1.2.1: Add about page, info controls, and project documentation.`
- `Release v1.2.2: Add attribution footer and LinkedIn author links.`

**Do not** use generic titles like `Add attribution footer...` without the `Release vX.Y.Z:` prefix.

## Commit body format

```
CHANGELOG (X.Y.Z):

- <bullet 1>
- <bullet 2>
```

Use the same version in the title and `CHANGELOG (X.Y.Z):` header.

## Version bump checklist (every release commit)

Bump **semver** `x.y.z` in all of:

1. `package.json` → `"version"`
2. `src/extension/config/packageMetadata.json` → `"version"`
3. `src/extension/manifest/manifest.json` → `"version"`
4. `about/about.js` → web fallback version string
5. `README.md` → `**Version:**` line, version history table (new row at top), extension zip filename if present
6. `CHANGELOG.md` → new `## [X.Y.Z] — YYYY-MM-DD` section at top with Added / Changed / Fixed bullets

Version style matches QALens / Chrome extensions page: plain semver only (e.g. `1.2.2`), no suffix in UI.

## Patch vs minor

| Change type | Bump |
|-------------|------|
| Bug fix, footer, copy, small UX | patch (`1.2.2`) |
| New feature, new screen, new API route | minor (`1.3.0`) |
| Breaking change | major (`2.0.0`) |

## Git steps

1. `git status`, `git diff`, `git log --oneline -5`
2. Run relevant tests (`npm test`; `npm run extension:release` if extension changed)
3. Stage source files only — **never** commit `dist-extension.zip` or old release zips unless explicitly requested
4. Commit with title + CHANGELOG body (PowerShell: multiple `-m` flags)
5. `git status` to verify

## Do not commit unless asked

Only create commits when the user requests it.

## Optional tag

Offer `git tag -a vX.Y.Z` after release; do not tag without user approval if Smart Mode blocks it.
