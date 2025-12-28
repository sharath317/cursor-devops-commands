---
description: Scan for secrets, vulnerabilities, supply chain risks before PR
category: Code Quality
aliases: [security, scan, audit]
---

# Security Shift-Left - Pre-PR Security Scanning

Scan for vulnerabilities, secrets, and supply chain risks before PR.

**Alias:** `/security-audit`, `/supply-chain-audit`

## Usage

```
/security-audit
/security-audit {FILE_PATH}
/security-audit --pr {PR_NUMBER}
/security-audit --deep                  # Full SAST scan
```

## Why This Matters

2025 has seen a rise in:

-   **MCPoison attacks** - Malicious MCP servers
-   **Prompt injection** - AI command manipulation
-   **Secret leakage** - API keys in code/prompts
-   **Dependency vulnerabilities** - Supply chain attacks

## What This Does

1. **Secret scanning** - API keys, tokens, credentials
2. **Dependency audit** - CVEs in npm packages
3. **SAST analysis** - Static security patterns
4. **Prompt injection** - AI-specific vulnerabilities
5. **Code patterns** - XSS, injection, auth issues

## Security Checks

### 🔴 Critical (Block PR)

| Check        | Pattern                               | Action |
| ------------ | ------------------------------------- | ------ |
| API Keys     | `/[A-Za-z0-9_-]{32,}/`                | Block  |
| AWS Keys     | `/AKIA[0-9A-Z]{16}/`                  | Block  |
| Private Keys | `/-----BEGIN.*PRIVATE KEY-----/`      | Block  |
| Passwords    | `/password\s*[:=]\s*['"][^'"]+['"]/i` | Block  |
| Tokens       | `/token\s*[:=]\s*['"][^'"]+['"]/i`    | Review |

### 🟠 High (Requires Review)

| Check                     | Issue          | Mitigation        |
| ------------------------- | -------------- | ----------------- |
| `dangerouslySetInnerHTML` | XSS risk       | Sanitize input    |
| `eval()`                  | Code injection | Remove usage      |
| `innerHTML`               | XSS risk       | Use textContent   |
| Unsanitized URLs          | Open redirect  | Validate URLs     |
| SQL concatenation         | Injection      | Use parameterized |

### 🟡 Medium (Warning)

| Check         | Issue            | Recommendation     |
| ------------- | ---------------- | ------------------ |
| `console.log` | Info leakage     | Remove in prod     |
| Hardcoded IPs | Environment leak | Use env vars       |
| `any` type    | Type safety      | Use specific types |
| Missing CSRF  | Security gap     | Add protection     |

## Output Format

````
📋 Running security audit...

════════════════════════════════════════════════════════════════
  SECURITY SCAN RESULTS
════════════════════════════════════════════════════════════════

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 0 | ✅ Pass |
| 🟠 High | 2 | ⚠️ Review |
| 🟡 Medium | 5 | 📝 Note |
| 🟢 Low | 8 | ℹ️ Info |

════════════════════════════════════════════════════════════════
  🔴 CRITICAL FINDINGS
════════════════════════════════════════════════════════════════

None found ✅

════════════════════════════════════════════════════════════════
  🟠 HIGH FINDINGS
════════════════════════════════════════════════════════════════

## 1. Potential XSS via dangerouslySetInnerHTML

**File:** src/features/checkout/src/components/RichText.tsx:45
**Code:**
```typescript
<div dangerouslySetInnerHTML={{ __html: content }} />
````

**Risk:** User-controlled content could execute scripts
**Mitigation:** Use `DOMPurify.sanitize()` or `OXRichTextBlock`

**Suggested fix:**

```typescript
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

---

## 2. Missing Input Validation

**File:** src/features/checkout/src/hooks/useBookingUpdate.ts:67
**Code:**

```typescript
const url = `${API_BASE}/${userInput}`;
fetch(url);
```

**Risk:** URL manipulation, SSRF
**Mitigation:** Validate and sanitize userInput

════════════════════════════════════════════════════════════════
🟡 MEDIUM FINDINGS
════════════════════════════════════════════════════════════════

| #   | File       | Issue                         | Line |
| --- | ---------- | ----------------------------- | ---- |
| 1   | helpers.ts | console.log in production     | 23   |
| 2   | api.ts     | Hardcoded timeout value       | 45   |
| 3   | config.ts  | Environment variable fallback | 12   |
| 4   | types.ts   | Use of `any` type             | 78   |
| 5   | auth.ts    | Token stored in localStorage  | 34   |

════════════════════════════════════════════════════════════════
🔍 DEPENDENCY AUDIT
════════════════════════════════════════════════════════════════

Running `npm audit`...

| Package | Severity | CVE            | Fixed In |
| ------- | -------- | -------------- | -------- |
| lodash  | High     | CVE-2021-23337 | 4.17.21  |
| axios   | Medium   | CVE-2023-45857 | 1.6.0    |

**Recommendation:** Run `pnpm update lodash axios`

════════════════════════════════════════════════════════════════
🤖 AI/PROMPT SECURITY
════════════════════════════════════════════════════════════════

## Prompt Injection Scan

Checking for:

-   [ ] User input in AI prompts: None found ✅
-   [ ] Unvalidated MCP calls: None found ✅
-   [ ] Prompt templates with injection risk: None found ✅

## MCP Server Audit

Connected MCP servers:

-   Atlassian (Jira) - ✅ Official
-   GitHub - ✅ Official
-   Figma - ✅ Official

⚠️ No untrusted MCP servers detected

════════════════════════════════════════════════════════════════
VERDICT
════════════════════════════════════════════════════════════════

## Overall Security Score: 78/100 (🟠 Needs Attention)

### Blocking Issues: 0

### Review Required: 2

### Improvements Suggested: 5

**Recommendation:**

1. Fix the 2 HIGH findings before PR
2. Address MEDIUM findings in follow-up
3. Run `pnpm audit fix` for dependencies

### Pre-PR Checklist

-   [ ] Fix dangerouslySetInnerHTML (HIGH)
-   [ ] Add URL validation (HIGH)
-   [ ] Remove console.log statements
-   [ ] Update vulnerable dependencies

````

## Commands Used

```bash
# Secret scanning
grep -rn "AKIA\|api[_-]key\|password\s*=" --include="*.ts" .

# Dependency audit
pnpm audit --json

# SAST with semgrep (if available)
semgrep --config=p/security-audit .

# Find dangerous patterns
grep -rn "dangerouslySetInnerHTML\|eval(\|innerHTML" --include="*.tsx" .
````

## Integration with Workflow

This command is automatically invoked by:

-   `/full-flow` - Before PR creation
-   `/pre-pr-check` - As part of validation
-   `/orchestrate` - Via Security Agent

## AI Execution

When user runs `/security-audit`:

1. **Scan secrets** - Regex patterns for credentials
2. **Audit dependencies** - npm/pnpm vulnerability check
3. **SAST analysis** - Security antipatterns
4. **Prompt security** - AI-specific risks
5. **Generate report** - Severity-ranked findings
6. **Recommend fixes** - Specific mitigations
