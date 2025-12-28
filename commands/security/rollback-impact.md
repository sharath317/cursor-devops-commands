---
description: Analyze impact of reverting a PR - dependency chains, downstream effects
category: Ops & Monitoring
aliases: [rollback, revert-impact, undo-impact]
---

# Rollback Impact - Simulate Revert Risk and Dependencies

Analyze the impact of reverting a PR, including dependency chains and downstream effects.

## Usage

```
/rollback-impact {PR_NUMBER}
/rollback-impact {COMMIT_SHA}
/rollback-impact {PR_NUMBER} --simulate    # Dry run
```

## What This Does

1. **Identifies all changes** - Files, exports, types modified
2. **Traces dependencies** - What depends on changed code
3. **Simulates revert** - Tests if revert would compile
4. **Estimates blast radius** - Apps, teams, features affected
5. **Recommends action** - Safe rollback vs. fix-forward

## Dependency Analysis

```
┌─────────────────────────────────────────────────────────────┐
│  DEPENDENCY CHAIN ANALYSIS                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PR #23043 (LineItems.tsx)                                  │
│      ↓                                                      │
│  ProtectionPackageCard.tsx (imports TooltipTitle)           │
│      ↓                                                      │
│  FLFPackagesV2.tsx (uses ProtectionPackageCard)             │
│      ↓                                                      │
│  CoverageAndAddOns/index.tsx (exports FLFPackagesV2)        │
│      ↓                                                      │
│  rent-checkout app (renders CoverageAndAddOns)              │
│                                                             │
│  BLAST RADIUS: 1 app, 4 components, 1 team                  │
└─────────────────────────────────────────────────────────────┘
```

## Risk Assessment Matrix

| Risk Factor             | Weight   | Description                 |
| ----------------------- | -------- | --------------------------- |
| **Type changes**        | High     | Breaking type modifications |
| **Export changes**      | High     | New/removed exports         |
| **API changes**         | Critical | External contract changes   |
| **Database migrations** | Critical | Data model changes          |
| **Feature flag deps**   | Medium   | Flag-dependent code         |
| **Style changes**       | Low      | CSS/styled changes only     |

## Output Format

````
📋 Analyzing rollback impact for PR #23043...

════════════════════════════════════════════════════════════════
  PR SUMMARY
════════════════════════════════════════════════════════════════

PR:          #23043 - [TICKET-123] Marketing texts for protection
Author:      SharathChandraSIXT
Merged:      2024-12-23 15:30:00 UTC
Commits:     3

Files Changed:
  - src/components/src/.../LineItems.tsx
  - src/components/src/.../ProtectionPackageCard.styled.ts
  - src/components/src/.../ProtectionPackageCard.types.ts
  - src/features/checkout/src/.../helpers.ts
  - src/features/checkout/src/.../PackagesV2.tsx

════════════════════════════════════════════════════════════════
  DEPENDENCY ANALYSIS
════════════════════════════════════════════════════════════════

## Direct Dependencies (files importing changed code)

| File | Import | Risk |
|------|--------|------|
| ProtectionPackageCard.tsx | TooltipTitle | 🟠 Medium |
| FLFPackagesV2.tsx | getModifiedLineItems | 🔴 High |
| PackagesV2.tsx | getModifiedLineItems | 🔴 High |

## Transitive Dependencies (downstream)

| Level | Files | Apps | Teams |
|-------|-------|------|-------|
| Direct | 5 | 1 | 1 |
| Level 2 | 8 | 1 | 1 |
| Level 3 | 12 | 2 | 2 |
| **Total Blast Radius** | **25 files** | **2 apps** | **2 teams** |

## Type Analysis

| Change | Type | Revert Risk |
|--------|------|-------------|
| Added `originalName?: string` to ILineItemInfo | Addition | ✅ Safe |
| Added `LineItemInfoWithOriginalName` type | Addition | ✅ Safe |
| Added `TooltipTitle` styled component | Addition | ✅ Safe |
| Modified `getModifiedLineItems` signature | Modification | 🟠 Medium |

════════════════════════════════════════════════════════════════
  REVERT SIMULATION
════════════════════════════════════════════════════════════════

## Compile Test
```bash
git revert ed304bcf4fb --no-commit
pnpm compile
````

Result: ✅ COMPILES SUCCESSFULLY

## Type Check

No breaking type changes detected.

## Runtime Risk

🟠 MEDIUM - Some call sites may expect new behavior

════════════════════════════════════════════════════════════════
RECOMMENDATION
════════════════════════════════════════════════════════════════

## Risk Score: 35/100 (Low-Medium)

### Option A: Safe Rollback ✅

-   Revert is compile-safe
-   No breaking type changes
-   Feature flag can disable behavior
-   Estimated time: 15 minutes

### Option B: Fix Forward

-   If issue is minor, fix in new PR
-   Preserves git history
-   Estimated time: 30-60 minutes

**RECOMMENDED: Option A (Safe Rollback)**

Rollback command:

```bash
git revert ed304bcf4fb
git push origin master
```

Post-rollback:

1. Monitor error rates for 30 minutes
2. Notify team in #web-booking
3. Create follow-up ticket for investigation

````

## Commands Used

```bash
# Get PR details
gh pr view {PR_NUMBER} --json files,commits,mergeCommit

# Find dependents
grep -rl "TooltipTitle\|getModifiedLineItems" --include="*.tsx" apps/ libraries/

# Simulate revert
git stash
git checkout master
git revert {SHA} --no-commit
pnpm compile
git reset --hard HEAD
git stash pop

# Check CODEOWNERS for affected teams
for file in $(gh pr diff {PR} --name-only); do
    grep -E "^$(dirname $file)" .github/CODEOWNERS
done | awk '{print $NF}' | sort -u
````

## Risk Scoring

| Factor           | Points | Max            |
| ---------------- | ------ | -------------- |
| Type changes     | 0-30   | Breaking = 30  |
| Export changes   | 0-25   | Removed = 25   |
| Dependency depth | 0-20   | >3 levels = 20 |
| Apps affected    | 0-15   | >2 apps = 15   |
| Teams affected   | 0-10   | >2 teams = 10  |

**Score Interpretation:**

-   0-25: ✅ Safe to rollback
-   26-50: 🟠 Rollback with caution
-   51-75: 🟠 Consider fix-forward
-   76-100: 🔴 Fix-forward recommended

## AI Execution

When user runs `/rollback-impact {PR}`:

1. **Fetch PR details** - Files, commits, merge info
2. **Trace dependencies** - Find all importing files
3. **Calculate blast radius** - Apps, teams, depth
4. **Simulate revert** - Test compilation
5. **Score risk** - Calculate impact score
6. **Recommend action** - Rollback vs fix-forward
