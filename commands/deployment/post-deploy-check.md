---
description: Monitor feature health after deploy - errors, metrics, rollout status
category: Ops & Monitoring
aliases: [deploy-check, monitor, verify-deploy]
---

# Post-Deploy Check - Verify Feature Health After Deployment

Monitor and verify the health of a feature after deployment using observability tools.

## Usage

```
/post-deploy-check {TICKET_ID}
/post-deploy-check {TICKET_ID} --env production
/post-deploy-check {TICKET_ID} --duration 30m
```

## What This Does

1. **Identifies deployed changes** - Maps ticket to deployed commits
2. **Monitors error rates** - Checks for spikes in Sentry/Instana
3. **Tracks performance metrics** - Bundle size, LCP, FID
4. **Validates feature flags** - Confirms Statsig rollout status
5. **Generates health report** - Pass/Fail with recommendations

## Monitoring Integration

```
┌─────────────────────────────────────────────────────────────┐
│  MONITORING SOURCES                                         │
├─────────────────────────────────────────────────────────────┤
│  Instana    → Error rates, latency, traces                  │
│  Sentry     → JavaScript errors, breadcrumbs                │
│  Statsig    → Feature flag status, experiment results       │
│  CloudWatch → Lambda metrics, API gateway                   │
│  GitHub     → Deployment status, commit info                │
└─────────────────────────────────────────────────────────────┘
```

## Health Check Dimensions

| Dimension       | Metrics                | Threshold       |
| --------------- | ---------------------- | --------------- |
| **Errors**      | Error rate, new errors | < 0.1% increase |
| **Performance** | LCP, FID, CLS          | No regression   |
| **Bundle**      | JS size, chunk sizes   | < 5% increase   |
| **API**         | Latency, 5xx rate      | < p95 baseline  |
| **Feature**     | Flag status, rollout % | As configured   |

## Output Format

```
📋 Post-Deploy Check for TICKET-123...

════════════════════════════════════════════════════════════════
  DEPLOYMENT INFO
════════════════════════════════════════════════════════════════

Ticket:      TICKET-123 - Marketing texts for protection packages
Commit:      ed304bcf4fb
Deployed:    2024-12-23 15:30:00 UTC
Environment: Production (EU)
Duration:    30 minutes monitored

════════════════════════════════════════════════════════════════
  HEALTH METRICS
════════════════════════════════════════════════════════════════

## Error Rate
┌──────────────────────────────────────────────────────────────┐
│  Before: 0.02%  │  After: 0.02%  │  Change: +0.00%  │  ✅    │
└──────────────────────────────────────────────────────────────┘

## New Errors (Sentry)
✅ No new errors detected in affected components

## Performance (Web Vitals)
| Metric | Before | After | Change | Status |
|--------|--------|-------|--------|--------|
| LCP | 2.1s | 2.1s | +0.00s | ✅ |
| FID | 45ms | 44ms | -1ms | ✅ |
| CLS | 0.05 | 0.05 | +0.00 | ✅ |

## Bundle Size
| Chunk | Before | After | Change | Status |
|-------|--------|-------|--------|--------|
| rent-checkout | 245KB | 246KB | +0.4% | ✅ |
| business-modules | 128KB | 128KB | +0.0% | ✅ |

## Feature Flags (Statsig)
| Flag | Status | Rollout | Exposures |
|------|--------|---------|-----------|
| rent_frictionless_checkout_v2 | ✅ Active | 100% | 12,340 |

## API Health
| Endpoint | p50 | p95 | 5xx Rate |
|----------|-----|-----|----------|
| /booking/v2 | 120ms | 350ms | 0.01% |

════════════════════════════════════════════════════════════════
  VERDICT: ✅ HEALTHY
════════════════════════════════════════════════════════════════

All metrics within acceptable thresholds.
Feature deployed successfully with no regressions.

Recommended: Continue monitoring for 24h before closing ticket.
```

## Commands Used

```bash
# Get deployment info from GitHub
gh api repos/YourCompany/com.yourcompany.web.public/deployments \
  --jq '.[] | select(.environment == "production") | {sha, created_at}'

# Check Sentry for new issues (requires SENTRY_API_TOKEN)
curl -H "Authorization: Bearer $SENTRY_API_TOKEN" \
  "https://sentry.io/api/0/projects/yourcompany/web-public/issues/?query=firstSeen:>=$DEPLOY_TIME"

# Check bundle size from CI artifacts
gh run view {RUN_ID} --json jobs \
  --jq '.jobs[] | select(.name == "bundle-analysis") | .steps[].outputs'

# Check Statsig feature status
curl -H "STATSIG-API-KEY: $STATSIG_KEY" \
  "https://statsigapi.net/console/v1/gates/rent_frictionless_checkout_v2"
```

## Alerting Rules

| Condition                  | Action                      |
| -------------------------- | --------------------------- |
| Error rate > 0.5% increase | 🔴 Alert + suggest rollback |
| LCP regression > 500ms     | 🟠 Warning + investigate    |
| New Sentry errors > 10     | 🟠 Warning + triage         |
| Bundle size > 10% increase | 🟡 Note for review          |
| Feature flag disabled      | 🔴 Alert + investigate      |

## AI Execution

When user runs `/post-deploy-check {TICKET_ID}`:

1. **Map ticket to deployment** - Find commit SHA from PR
2. **Identify baseline** - Metrics before deployment
3. **Collect current metrics** - Query monitoring tools
4. **Compare and analyze** - Calculate deltas
5. **Generate report** - Health status with recommendations
6. **Alert if needed** - Trigger rollback suggestion if critical
