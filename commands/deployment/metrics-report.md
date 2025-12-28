---
description: Generate velocity, DORA metrics, AI impact, and ROI report for tickets/sprints
category: Ops & Monitoring
aliases: [metrics, velocity, roi-calc, report]
---

# Metrics Report - Development Velocity & ROI Tracking

Generate measurable business outcomes for engineering work.

## ⚠️ Confidence Bounds

AI-related metrics are **estimated** and **directional**:

-   AI attribution is heuristic-based, not deterministic
-   Numbers are approximate indicators, not hard KPIs
-   Use for personal measurement and trend analysis
-   **Do not** use for performance reviews or metric gaming

## Usage

```
/metrics-report {TICKET_ID}
/metrics-report --sprint current
/metrics-report --team @YourOrg/team-a
/metrics-report --period 30d
/roi-calc                              # Alias: AI ROI focus
```

## What This Does

1. **Collects metrics** - Time, velocity, quality data
2. **Calculates DORA** - Key engineering metrics
3. **Tracks AI-assisted work** - Cursor/copilot impact
4. **Generates ROI** - Business value of changes
5. **Creates report** - Shareable with leadership

## DORA Metrics (2025 Standard)

| Metric                    | Definition          | Target      |
| ------------------------- | ------------------- | ----------- |
| **Lead Time**             | Commit → Production | < 24 hours  |
| **Deployment Frequency**  | Deploys per day     | > 1 per day |
| **Change Failure Rate**   | Failed deploy %     | < 5%        |
| **Mean Time to Recovery** | Incident resolution | < 1 hour    |

## Output Format

```
📋 Generating metrics report for TICKET-123...

════════════════════════════════════════════════════════════════
  TICKET SUMMARY
════════════════════════════════════════════════════════════════

Ticket:      TICKET-123 - Marketing texts for protection packages
Type:        Story (Feature)
Priority:    Medium
Sprint:      2024-12-W51

════════════════════════════════════════════════════════════════
  ⏱️ VELOCITY METRICS
════════════════════════════════════════════════════════════════

## Timeline

| Phase | Start | End | Duration |
|-------|-------|-----|----------|
| Created | Dec 18 | - | - |
| In Progress | Dec 20 | Dec 23 | 3 days |
| In Review | Dec 23 | Dec 23 | 4 hours |
| Merged | Dec 23 | - | - |
| Deployed | Dec 23 | - | 2 hours |

## DORA Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Lead Time | 5 days | < 7 days | ✅ Good |
| Cycle Time | 3 days | < 5 days | ✅ Excellent |
| Review Time | 4 hours | < 8 hours | ✅ Excellent |
| Time to Deploy | 2 hours | < 4 hours | ✅ Excellent |

## Comparison to Team Average

| Metric | This Ticket | Team Avg | Delta |
|--------|-------------|----------|-------|
| Lead Time | 5 days | 7.2 days | -31% ✅ |
| Lines Changed | 156 | 234 | -33% ✅ |
| Files Touched | 7 | 12 | -42% ✅ |
| PR Revisions | 2 | 3.5 | -43% ✅ |

════════════════════════════════════════════════════════════════
  📊 QUALITY METRICS
════════════════════════════════════════════════════════════════

## Code Quality

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Test Coverage | 78% | > 70% | ✅ Pass |
| Mutation Score | 71% | > 65% | ✅ Pass |
| Lint Issues | 0 | 0 | ✅ Pass |
| Type Coverage | 100% | 100% | ✅ Pass |

## Post-Deployment

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Error Rate | 0.02% | 0.02% | 0% ✅ |
| LCP | 2.1s | 2.1s | 0% ✅ |
| Bundle Size | 245KB | 246KB | +0.4% ✅ |

## Review Quality

| Metric | Value |
|--------|-------|
| Comments | 5 |
| Blocking issues | 0 |
| Suggestions | 3 |
| Approvals | 2 |
| Time to first review | 45 min |

════════════════════════════════════════════════════════════════
  🤖 AI-ASSISTED DEVELOPMENT METRICS
════════════════════════════════════════════════════════════════

## Cursor/Copilot Usage

| Metric | Value |
|--------|-------|
| AI-generated code | 42% |
| AI suggestions accepted | 78% |
| Commands used | 12 |
| Time saved (estimated) | 4.5 hours |

## Commands Used

| Command | Times | Outcome |
|---------|-------|---------|
| /full-flow | 1 | Workflow orchestration |
| /gather-context | 2 | Requirements gathering |
| /pr-review | 1 | Self-review |
| /jira-test | 1 | How to Test comment |
| /jira-docs | 1 | Confluence page |

## AI ROI

```

Without AI Assistance (Estimated):
Development: 16 hours
Testing: 4 hours
Documentation: 2 hours
Total: 22 hours

With AI Assistance (Actual):
Development: 9 hours
Testing: 2 hours
Documentation: 0.5 hours
Total: 11.5 hours

Time Saved: 10.5 hours (48%)

```

════════════════════════════════════════════════════════════════
  💰 BUSINESS VALUE
════════════════════════════════════════════════════════════════

## Feature Impact

| Metric | Value |
|--------|-------|
| Users Affected | ~50,000/day |
| Conversion Impact | TBD (A/B test) |
| Revenue Impact | TBD (post-rollout) |

## Engineering Investment

| Category | Hours | Cost (est.) |
|----------|-------|-------------|
| Development | 11.5 | €1,150 |
| Review | 1.5 | €150 |
| Testing | 2 | €200 |
| **Total** | **15** | **€1,500** |

## ROI Calculation

```

Investment: €1,500 (15 engineer hours)
Expected Return: €4,500/month (improved conversion)
Payback Period: ~10 days
Annual ROI: 3,500%

```

════════════════════════════════════════════════════════════════
  📈 TRENDS
════════════════════════════════════════════════════════════════

## Your Velocity (Last 30 Days)

| Week | Tickets | Avg Lead Time | Quality |
|------|---------|---------------|---------|
| W49 | 3 | 6.2 days | 92% |
| W50 | 4 | 5.8 days | 95% |
| W51 | 3 | 5.0 days | 97% |

Trend: ↑ Improving (+19% velocity, +5% quality)

## Team Comparison

| Developer | Tickets | Velocity | Quality |
|-----------|---------|----------|---------|
| You | 10 | ████████ 92% | ██████████ 95% |
| Team Avg | 8 | ██████ 78% | ████████ 88% |

════════════════════════════════════════════════════════════════
  📋 EXECUTIVE SUMMARY
════════════════════════════════════════════════════════════════

## TICKET-123 Metrics at a Glance

| Category | Score | Details |
|----------|-------|---------|
| Velocity | ⭐⭐⭐⭐⭐ | 31% faster than average |
| Quality | ⭐⭐⭐⭐ | 78% coverage, 0 regressions |
| AI Impact | ⭐⭐⭐⭐⭐ | 48% time saved |
| Business Value | ⭐⭐⭐⭐ | High (user-facing feature) |

**Key Highlights:**
- Feature delivered 2 days ahead of estimate
- Zero production issues post-deploy
- AI assistance reduced development time by ~50%
- Comprehensive documentation created automatically

**Recommendation:**
Continue using AI-assisted workflow for similar tickets.
Consider as template for team adoption.
```

## Data Sources

```bash
# Get ticket timeline from Jira
jira issue view {TICKET} --plain

# Get PR metrics from GitHub
gh pr view {PR} --json createdAt,mergedAt,reviews,comments

# Get deployment info
gh api repos/YourCompany/com.yourcompany.web.public/deployments

# Get code metrics
git log --oneline --after="2024-12-01" --author="$USER" | wc -l

# Get coverage
pnpm test:coverage -- --coverageReporters=json-summary
```

## AI Execution

When user runs `/metrics-report {TICKET}`:

1. **Collect data** - Jira, GitHub, monitoring
2. **Calculate DORA** - Lead time, deployment freq, etc.
3. **Track AI usage** - Commands, time saved
4. **Estimate ROI** - Business value projection
5. **Compare trends** - Historical performance
6. **Generate report** - Executive-ready summary
