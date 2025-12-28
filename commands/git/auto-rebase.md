---
description: Automatically rebase branch, detect and resolve conflicts with master
category: PR Management
aliases: [rebase, sync, update-branch]
---

# Auto-Rebase - Keep PRs Up to Date

Automatically detect and resolve conflicts with master.

## Usage

```
/auto-rebase
/auto-rebase {PR_NUMBER}
/auto-rebase --check-only
```

## What This Does

1. **Detects** when your branch is behind master
2. **Attempts** automatic rebase
3. **Flags** conflicts for manual resolution
4. **Re-runs** CI after successful rebase

## Automatic Detection

When running `/full-flow` or `/pr-fix`, I check:

```bash
# Check if behind master
git fetch origin
BEHIND=$(git rev-list --count HEAD..origin/master)

if [ $BEHIND -gt 0 ]; then
  echo "Branch is $BEHIND commits behind master"
fi
```

### Detection Output

```
════════════════════════════════════════════════════════════════
  ⚠️ BRANCH BEHIND MASTER
════════════════════════════════════════════════════════════════

Your branch: TICKET-123-display-name-charges
Behind master by: 12 commits

Recent master commits:
  - abc1234: feat(TICKET-321): Add connector profile
  - def5678: fix(TICKET-456): Fix tooltip positioning
  - ghi9012: chore: Update dependencies

Potential conflicts detected in:
  ❌ src/features/checkout/src/components/PackagesV2.tsx
  ✅ src/components/src/ProtectionPackageCard.tsx (clean)

Options:
  1. Auto-rebase (attempt automatic merge)
  2. Manual rebase (I'll guide you)
  3. Skip (continue with conflicts)

Choose: (1/2/3)
```

## Auto-Rebase Flow

### Step 1: Stash Local Changes

```bash
git stash push -m "auto-rebase-$(date +%s)"
```

### Step 2: Attempt Rebase

```bash
git fetch origin master
git rebase origin/master
```

### Step 3: Handle Results

**If clean rebase:**

```
✅ Rebase successful!
   - Rebased 3 commits onto latest master
   - No conflicts detected
   - Pushing to origin...

git push --force-with-lease origin HEAD
```

**If conflicts:**

```
════════════════════════════════════════════════════════════════
  ⚠️ CONFLICTS DETECTED
════════════════════════════════════════════════════════════════

Conflicts in 2 files:

1. src/features/checkout/src/components/PackagesV2.tsx
   Lines 45-67: Both branches modified getLineItems()

2. src/features/checkout/src/types/index.ts
   Lines 12-15: Type definition changed

Options:
  A) Show me the conflicts (I'll help resolve)
  B) Abort rebase, keep original state
  C) Open in VS Code merge tool

Choose: (a/b/c)
```

### Step 4: Resolve Conflicts (If Needed)

```
════════════════════════════════════════════════════════════════
  CONFLICT: PackagesV2.tsx (lines 45-67)
════════════════════════════════════════════════════════════════

<<<<<<< HEAD (your changes)
const lineItems = getModifiedLineItems(
    rawLineItems,
    false,
    rent_frictionless_checkout_v2,
    countryAlpha2
);
=======
const lineItems = rawLineItems.map(item => ({
    ...item,
    displayName: item.display_name || item.name
}));
>>>>>>> origin/master

Analysis:
- Your version: Uses helper function (cleaner)
- Master version: Inline mapping (simpler but duplicative)

Recommendation: Keep YOUR version (helper function)
Reason: Follows DRY principle, helper already handles edge cases

Apply recommendation? (y/n)
```

### Step 5: Complete & Push

```bash
# After conflicts resolved
git add -A
git rebase --continue
git push --force-with-lease origin HEAD
```

## CI Re-run

After successful rebase:

```
✅ Rebase complete
✅ Pushed to origin

CI Status:
  ⏳ Waiting for CI to start...
  🔄 Running: lint, test, build

I'll notify you when CI completes.
```

## Commands Reference

```bash
# Check rebase status
git status

# View conflicts
git diff --name-only --diff-filter=U

# Abort if needed
git rebase --abort

# Force push after rebase
git push --force-with-lease origin HEAD
```

## Safety Features

1. **Stash before rebase** - Never lose local changes
2. **force-with-lease** - Prevents overwriting others' work
3. **Conflict preview** - Shows what will conflict before attempting
4. **Easy abort** - Can always return to original state

## Integration with /full-flow

During state detection:

```
════════════════════════════════════════════════════════════════
  STATE DETECTION
════════════════════════════════════════════════════════════════

  Branch:        ✅ TICKET-123-display-name-charges
  Commits:       ✅ 3 commits ahead
  Behind Master: ⚠️ 12 commits behind
  PR:            ✅ #23043 (draft)

⚠️ Your branch is behind master. Rebase recommended before continuing.

Auto-rebase now? (y/n)
```

## Best Practices

1. **Rebase frequently** - Don't let branch drift too far
2. **Rebase before review** - Fresh code is easier to review
3. **Rebase after review** - Incorporate latest changes before merge
4. **Never rebase shared branches** - Only your feature branches
