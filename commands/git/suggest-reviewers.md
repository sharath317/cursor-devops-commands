---
description: Suggest optimal PR reviewers based on CODEOWNERS, expertise, and availability
category: PR Management
aliases: [reviewers, who-reviews]
---

# Suggest Reviewers - Smart Reviewer Selection

Intelligently suggest optimal reviewers based on code ownership, expertise, and availability.

## Usage

```
/suggest-reviewers
/suggest-reviewers {PR_NUMBER}
/suggest-reviewers --add  # Auto-add suggested reviewers
```

## How It Works

### 1. Analyze Changed Files

```bash
# Get files changed in PR
gh pr view {PR} --json files --jq '.files[].path'
```

### 2. Map to CODEOWNERS

```bash
# For each file, find owner
for file in $(gh pr view {PR} --json files --jq '.files[].path'); do
  grep "$file" .github/CODEOWNERS | awk '{print $NF}'
done
```

### 3. Check Expertise (Git History)

```bash
# Find developers with most commits in affected files
git log --format='%an' --since='6 months ago' -- {FILE} | sort | uniq -c | sort -rn
```

### 4. Check Availability

```bash
# Check reviewer workload (open review requests)
gh api graphql -f query='
  query {
    user(login: "{USERNAME}") {
      pullRequests(states: OPEN, first: 10) {
        totalCount
      }
    }
  }
'
```

## Suggestion Output

```
════════════════════════════════════════════════════════════════
  📋 REVIEWER SUGGESTIONS FOR PR #23043
════════════════════════════════════════════════════════════════

Files changed: 6 files across 3 teams

════════════════════════════════════════════════════════════════
  RECOMMENDED REVIEWERS
════════════════════════════════════════════════════════════════

🥇 PRIMARY (Required - CODEOWNER)
┌─────────────────────────────────────────────────────────────┐
│ @team-lead                                      │
│ Team: @YourOrg/team-a                                     │
│ Owns: src/features/checkout/* (4 files changed)                │
│ Expertise: 45 commits in affected files                     │
│ Workload: 2 pending reviews (✅ Available)                  │
└─────────────────────────────────────────────────────────────┘

🥈 SECONDARY (Recommended)
┌─────────────────────────────────────────────────────────────┐
│ @teammate-1                                                 │
│ Team: @YourOrg/team-b                                │
│ Owns: src/components/* (2 files)           │
│ Expertise: 30 commits in affected files                     │
│ Workload: 1 pending review (✅ Available)                   │
└─────────────────────────────────────────────────────────────┘

🥉 OPTIONAL (Good to have)
┌─────────────────────────────────────────────────────────────┐
│ @senior-dev                                                 │
│ Team: @YourOrg/platform                               │
│ Reason: Recent work on similar tooltip feature              │
│ Expertise: 12 commits in affected patterns                  │
│ Workload: 5 pending reviews (⚠️ Busy)                       │
└─────────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════
  SKIP SUGGESTIONS
════════════════════════════════════════════════════════════════

❌ @busy-dev - 8 pending reviews (overloaded)
❌ @vacation-dev - OOO until Jan 5
❌ @new-dev - < 1 month on team (limited context)

════════════════════════════════════════════════════════════════

Add recommended reviewers? (y/n)
  - Primary: @team-lead
  - Secondary: @teammate-1
```

## Selection Criteria

### Scoring System

| Factor       | Weight | Description                     |
| ------------ | ------ | ------------------------------- |
| CODEOWNER    | 40%    | Required for files they own     |
| Expertise    | 25%    | Commits in affected files (6mo) |
| Recency      | 15%    | Recent work in area             |
| Availability | 15%    | Pending review count            |
| Team Balance | 5%     | Avoid overloading one person    |

### Expertise Score

```
Commits in last 6 months:
  50+ commits → Expert (score: 100)
  20-49 commits → Proficient (score: 75)
  5-19 commits → Familiar (score: 50)
  1-4 commits → Aware (score: 25)
  0 commits → Unknown (score: 0)
```

### Availability Score

```
Pending reviews:
  0-2 reviews → Available (score: 100)
  3-4 reviews → Moderate (score: 70)
  5-6 reviews → Busy (score: 40)
  7+ reviews → Overloaded (score: 10)
```

## Smart Features

### 1. Cross-Team Coverage

```
Your PR affects multiple teams:
  - @YourOrg/team-a (4 files)
  - @YourOrg/team-b (2 files)

Suggesting one reviewer from each team for complete coverage.
```

### 2. Related PR Context

```
Found related PRs by these developers:
  - @teammate-1: PR #22900 (similar tooltip work)
  - @senior-dev: PR #22800 (ProtectionPackageCard refactor)

Consider adding for context continuity.
```

### 3. Review History

```
Previous reviewers for this component:
  - @team-lead (reviewed 5 PRs)
  - @teammate-1 (reviewed 3 PRs)

Maintaining consistency with established reviewers.
```

### 4. Load Balancing

```
Team review distribution (this week):
  @team-lead: 8 reviews
  @teammate-1: 3 reviews
  @teammate-2: 2 reviews

Suggesting @teammate-2 to balance load.
```

## Commands Reference

```bash
# Add reviewers to PR
gh pr edit {PR} --add-reviewer @user1,@user2

# Check current reviewers
gh pr view {PR} --json reviewRequests

# Check user's pending reviews
gh api /users/{USER}/received_events | jq '[.[] | select(.type=="PullRequestReviewEvent")] | length'
```

## Integration with /full-flow

After PR creation:

```
════════════════════════════════════════════════════════════════
  📤 PR CREATED: #23043
════════════════════════════════════════════════════════════════

Suggested reviewers based on files changed:
  ✅ @team-lead (CODEOWNER, available)
  ✅ @teammate-1 (expertise in area)

Add these reviewers? (y/n)
```

## Auto-Add Mode

```
/suggest-reviewers --add
```

Automatically adds:

-   All CODEOWNER reviewers (required)
-   Top 1-2 expertise-based reviewers
-   Skips overloaded reviewers

## Learning

I remember your preferences:

-   "always add @team-lead" → Added to default list
-   "never add @slow-reviewer" → Excluded from suggestions
-   "prefer @fast-reviewer" → Boosted in scoring
