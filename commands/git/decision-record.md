---
description: Create Architecture Decision Records (ADRs) for technical decisions
category: Documentation
aliases: [adr, decision, record]
---

# Decision Record - Capture Architectural Decisions

Capture important technical and architectural decisions as Architecture Decision Records (ADRs).

**This is the biggest missing piece** — turns tribal knowledge into institutional memory.

## Usage

```
/decision-record {TITLE}
/decision-record {TITLE} --context="{TICKET_OR_PR}"
/decision-record --list                    # List all decisions
/decision-record --search="{KEYWORD}"      # Search decisions
```

## Examples

```
/decision-record "Use React Query for data fetching"
/decision-record "Split ProtectionPackageCard into sub-components" --context="TICKET-123"
/decision-record "Migrate from styled-components to CSS modules" --context="PR#23100"
```

## Why This Matters

Without decision records:

-   ❌ Repeated debates on the same topics
-   ❌ Inconsistent enforcement
-   ❌ Loss of architectural intent
-   ❌ "Why was this done?" questions forever

With decision records:

-   ✅ Single source of truth
-   ✅ Onboarding accelerated
-   ✅ Consistent enforcement
-   ✅ Architectural alignment

## What This Creates

Creates a file at: `/docs/decisions/ADR-{NUMBER}-{slug}.md`

```markdown
# ADR-042: Use React Query for Data Fetching

## Status

Accepted | Proposed | Deprecated | Superseded by ADR-XXX

## Date

2024-12-23

## Context

What is the issue that we're seeing that is motivating this decision?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

What becomes easier or more difficult to do because of this change?

## Alternatives Considered

What other options were evaluated?

## Evidence

Links to PRs, metrics, incidents, or discussions that informed this decision.
```

## Decision Record Format

```
════════════════════════════════════════════════════════════════
  DECISION RECORD: {TITLE}
════════════════════════════════════════════════════════════════

📋 CONTEXT
  Triggered by: {ticket/PR/discussion}
  Problem: {what issue we're solving}
  Scope: {what areas this affects}

🤔 OPTIONS CONSIDERED

  Option A: {description}
    ✅ Pros: {benefits}
    ❌ Cons: {drawbacks}
    📊 Evidence: {data/examples}

  Option B: {description}
    ✅ Pros: {benefits}
    ❌ Cons: {drawbacks}
    📊 Evidence: {data/examples}

  Option C: {description}
    ✅ Pros: {benefits}
    ❌ Cons: {drawbacks}
    📊 Evidence: {data/examples}

✅ DECISION
  Chosen: Option {X}
  Rationale: {why this option}

⚖️ TRADEOFFS
  We accept:
    - {tradeoff_1}
    - {tradeoff_2}
  In exchange for:
    - {benefit_1}
    - {benefit_2}

📈 SUCCESS CRITERIA
  - {metric_1}
  - {metric_2}

🔗 REFERENCES
  - Jira: {ticket}
  - PR: #{number}
  - Confluence: {link}
  - Incident: {if applicable}

════════════════════════════════════════════════════════════════
```

## Common Decision Categories

### Architecture Decisions

-   State management approach
-   Data fetching patterns
-   Component structure
-   Module boundaries
-   API design

### Technology Decisions

-   Library choices
-   Build tool changes
-   Testing frameworks
-   Styling approaches

### Process Decisions

-   Code review standards
-   PR size limits
-   Branch strategy
-   Release process

### Migration Decisions

-   Deprecation plans
-   Upgrade paths
-   Breaking changes

## AI Execution

When user runs `/decision-record {TITLE}`:

### Step 1: Gather Context

```
I'll help you document this decision.

1. What problem or question prompted this decision?
2. What options did you consider?
3. What did you decide and why?
4. What are the tradeoffs?
```

### Step 2: Generate ADR

```bash
# Determine next ADR number
NEXT_NUM=$(ls docs/decisions/ADR-*.md 2>/dev/null | wc -l | xargs -I{} expr {} + 1)

# Create ADR file
touch docs/decisions/ADR-${NEXT_NUM}-{slug}.md
```

### Step 3: Link to Context

```bash
# If Jira ticket provided
jira issue comment add {TICKET} "📝 Decision recorded: ADR-${NEXT_NUM}"

# If PR provided
gh pr comment {PR} --body "📝 Decision recorded: ADR-${NEXT_NUM}"
```

### Step 4: Confirm

```
════════════════════════════════════════════════════════════════
  ✅ DECISION RECORDED
════════════════════════════════════════════════════════════════

📄 File: docs/decisions/ADR-042-use-react-query-for-data-fetching.md
🔗 Linked to: TICKET-123, PR #23043

This decision is now:
  - Searchable in the codebase
  - Referenced in project docs
  - Available for future discussions

View all decisions: /decision-record --list
```

## Decision Lifecycle

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌────────────┐
│ Proposed │ ──▶ │ Accepted │ ──▶ │ Active   │ ──▶ │ Deprecated │
└──────────┘     └──────────┘     └──────────┘     └────────────┘
                                        │
                                        ▼
                                  ┌────────────────┐
                                  │ Superseded by  │
                                  │ ADR-XXX        │
                                  └────────────────┘
```

## Searching Decisions

```
/decision-record --search="state management"
```

Output:

```
════════════════════════════════════════════════════════════════
  DECISIONS MATCHING: "state management"
════════════════════════════════════════════════════════════════

1. ADR-015: Use Context for shared component state (Active)
   Date: 2024-03-15
   Scope: Component-level state

2. ADR-023: Use React Query for server state (Active)
   Date: 2024-06-20
   Scope: API data caching

3. ADR-008: Redux for global app state (Deprecated)
   Date: 2023-09-10
   Superseded by: ADR-023

View details: /decision-record --view=ADR-023
```

## Quick Decision Template

For informal decisions that don't need full ADR:

```
/decision-record "Use OXTypography for all text" --quick
```

Creates a lightweight record:

```markdown
# Quick Decision: Use OXTypography for all text

**Date:** 2024-12-23
**Decided by:** @team-lead
**Reason:** Consistency with design system, automatic theme support
**Enforcement:** Code review, linting rule
```

## Integration with Other Commands

| Command                     | Integration                                               |
| --------------------------- | --------------------------------------------------------- |
| `/full-flow`                | Prompts for decision record if significant pattern change |
| `/refactor-new`             | Links to relevant ADRs before refactoring                 |
| `/pr-review --architecture` | Checks alignment with ADRs                                |
| `/pattern-drift`            | Flags violations of recorded decisions                    |
| `/learn-from-prs`           | Suggests new ADRs based on repeated patterns              |

## Directory Structure

```
docs/
└── decisions/
    ├── README.md           # Index and guidelines
    ├── ADR-001-*.md
    ├── ADR-002-*.md
    ├── ...
    └── templates/
        ├── full-adr.md
        └── quick-decision.md
```
