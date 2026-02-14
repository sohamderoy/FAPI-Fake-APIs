![FAPI Logo](./assets/img/fapi-logo.svg)

# Release Strategy & Versioning Guide

> **Document Version:** v1.0.0
> **Document Last Updated:** December 28, 2025

This document outlines the release strategy, versioning workflow, and branching model for the FAPI project.

**For contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md)**

---

## Table of Contents

- [Semantic Versioning](#semantic-versioning)
- [Branching Strategy](#branching-strategy)
- [Release Workflow](#release-workflow)
- [Version Commands](#version-commands)

---

## Semantic Versioning

This project follows [Semantic Versioning 2.0.0](https://semver.org/). Version format: **MAJOR.MINOR.PATCH[-PRERELEASE]**

### Version Components

```
     0  .  2  .  1  -  alpha  .  0
     ↑     ↑     ↑      ↑        ↑
   MAJOR MINOR PATCH  Stage  Iteration
```

### When to Bump Each Number

- **MAJOR (X.0.0):** Incompatible API changes, breaking changes

  - Example: `0.1.0 → 1.0.0` (removed a feature, changed API)

- **MINOR (0.X.0):** New features, backwards-compatible

  - Example: `0.1.0 → 0.2.0` (added new endpoint functionality)

- **PATCH (0.0.X):** Bug fixes, backwards-compatible
  - Example: `0.1.0 → 0.1.1` (fixed a critical bug)

### Pre-release Identifiers

- **alpha:** Early development, unstable, breaking changes expected
- **beta:** Feature-complete, testing phase, API stabilizing
- **rc (Release Candidate):** Production-ready candidate, final testing only

**Progression:** `feature/ bugfix branch` -> `develop` -> `release branch` -> `release alpha` → `release beta` → `release candidate rc` → `stable release` -> `main`

## Branching Strategy

### Branch Overview

```
main
  ↑
  │ (PR from release branches)
  │
release/X.Y.Z
  ↑
  │ (created from develop)
  │
develop
  ↑
  │ (PR from feature/bugfix/hotfix branches)
  │
feature/[name], bugfix/[name], etc.
```

### Branch Descriptions

#### `main`

- Production-ready, stable code only
- Matches published npm stable versions (v0.1.0, v0.2.0, etc.)
- Updates only via PR from release branches
- Branch protection enabled

#### `develop`

- Active development, may be unstable
- Default branch for all contributor PRs
- Updates via PRs from feature branches
- Branch protection enabled

#### `release/X.Y.Z`

- Short-lived branches for pre-release testing
- Created from develop when features are ready for release
- Bug fixes and version bumps only (no new features)
- Can be deleted after merging to main and develop (optional)

#### `feature/[name]`, `bugfix/[name]`, `hotfix/[name]`

- Feature branches for new functionality
- Bugfix branches for fixing bugs in develop
- Hotfix branches for urgent production fixes (branched from main)
- Created from develop (or main for hotfixes), merged to develop only
- Short-lived. Can be deleted (optional)

---

## Release Workflow

### Step-by-Step Process

#### 1. Create Release Branch

When features are ready for release:

```bash
git checkout develop
git pull origin develop
git checkout -b release/0.2.0
git push origin release/0.2.0
```

#### 2. Create Pre-release Versions

Start with alpha:

```bash
git checkout release/0.2.0
npm version preminor --preid=alpha  # → 0.2.0-alpha.0
git push origin release/0.2.0 --follow-tags
npm publish --tag alpha
```

Fix bugs and increment:

```bash
npm version prerelease  # → 0.2.0-alpha.1
git push origin release/0.2.0 --follow-tags
npm publish --tag alpha
```

Move to beta:

```bash
npm version prerelease --preid=beta  # → 0.2.0-beta.0
git push origin release/0.2.0 --follow-tags
npm publish --tag beta
```

Move to release candidate:

```bash
npm version prerelease --preid=rc  # → 0.2.0-rc.0
git push origin release/0.2.0 --follow-tags
npm publish --tag rc
```

#### 3. Finalize Stable Release

```bash
git checkout release/0.2.0
npm version minor  # → 0.2.0
git push origin release/0.2.0 --follow-tags
npm publish
```

#### 4. Merge to Main

Create PR on GitHub:

- Target: `main`
- From: `release/0.2.0`
- Wait for PR Review
- Merge after PR Approval

#### 5. Merge Back to Develop

Create PR on GitHub:

- Target: `develop`
- From: `release/0.2.0`
- Resolve any merge conflicts
- Wait for PR Review
- Merge after PR Approval

#### 6. Delete Release Branch (optional)

```bash
# Via GitHub UI or:
git branch -d release/0.2.0
git push origin --delete release/0.2.0
```

---

## Version Commands

### Standard Releases

```bash
npm version patch   # 0.1.0 → 0.1.1 (bug fixes)
npm version minor   # 0.1.0 → 0.2.0 (new features)
npm version major   # 0.1.0 → 1.0.0 (breaking changes)
```

### Pre-releases

```bash
# Start pre-release
npm version prepatch --preid=alpha   # 0.1.0 → 0.1.1-alpha.0
npm version preminor --preid=alpha   # 0.1.0 → 0.2.0-alpha.0
npm version premajor --preid=alpha   # 0.1.0 → 1.0.0-alpha.0

# Increment within same stage
npm version prerelease               # 0.2.0-alpha.0 → 0.2.0-alpha.1

# Move to next stage
npm version prerelease --preid=beta  # 0.2.0-alpha.2 → 0.2.0-beta.0
npm version prerelease --preid=rc    # 0.2.0-beta.1 → 0.2.0-rc.0

# Finalize
npm version minor                    # 0.2.0-rc.1 → 0.2.0
```

### Publishing

```bash
npm publish --tag alpha   # Publish as alpha
npm publish --tag beta    # Publish as beta
npm publish --tag rc      # Publish as release candidate
npm publish               # Publish as latest (stable)
```

---

### Important Rules

- All PRs from contributors go to `develop`
- PRs to `main` are not allowed (maintainer can only merge to main via release branches)
- All merges to `main` and `develop` via Pull Requests (no direct pushes)
- Git tags are preserved forever
