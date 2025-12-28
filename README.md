# 🔧 Cursor DevOps Commands

> DevOps & Git Commands for Cursor IDE - Security, Deployment, Git Operations

[![npm version](https://badge.fury.io/js/cursor-devops-commands.svg)](https://www.npmjs.com/package/cursor-devops-commands)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Install

```bash
npx cursor-devops-commands
```

One command installs 10 DevOps commands for Cursor.

## What is DevOps Commands?

DevOps Commands provides:

- **Git Operations** - Auto-rebase, smart reviewer suggestions
- **Security Audits** - Pre-PR security scanning
- **Deployment Verification** - Post-deploy health checks

## 📦 Command Bundles

| Bundle | Commands | Use Case |
|--------|----------|----------|
| **Minimal** | 4 | Git only |
| **Standard** | 7 | + Security |
| **Complete** | 10 | + Deployment |

## 🔧 Commands Reference

### 🔀 Git Operations

| Command | Description |
|---------|-------------|
| `/auto-rebase` | Rebase branch with conflict resolution help |
| `/suggest-reviewers` | Smart reviewer suggestions based on CODEOWNERS |
| `/find-shared` | Find shared code dependencies |
| `/decision-record` | Create architecture decision records |

### 🔒 Security

| Command | Description |
|---------|-------------|
| `/security-audit` | Scan for secrets, vulnerabilities, supply chain risks |
| `/rollback-impact` | Assess rollback risk and dependencies |

### 🚀 Deployment

| Command | Description |
|---------|-------------|
| `/post-deploy-check` | Verify feature health after deployment |
| `/metrics-report` | Generate metrics dashboard |

## 💡 Example Usage

### Auto-Rebase with Conflict Help

```
/auto-rebase

════════════════════════════════════════════════════════════════
  ⚠️ BRANCH BEHIND MASTER
════════════════════════════════════════════════════════════════

Your branch: feature/new-checkout
Behind master by: 12 commits

Potential conflicts detected in:
  ❌ src/features/checkout/PackagesV2.tsx
  ✅ src/components/ProtectionPackageCard.tsx (clean)

Options:
  1. Auto-rebase (attempt automatic merge)
  2. Manual rebase (I'll guide you)
  3. Skip

Choose: (1/2/3)
```

### Security Audit

```
/security-audit

════════════════════════════════════════════════════════════════
  SECURITY SCAN RESULTS
════════════════════════════════════════════════════════════════

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 0 | ✅ Pass |
| 🟠 High | 2 | ⚠️ Review |
| 🟡 Medium | 5 | 📝 Note |

🟠 HIGH FINDINGS

1. Potential XSS via dangerouslySetInnerHTML
   File: src/components/RichText.tsx:45
   Mitigation: Use DOMPurify.sanitize()
```

### Smart Reviewer Suggestions

```
/suggest-reviewers

════════════════════════════════════════════════════════════════
  RECOMMENDED REVIEWERS
════════════════════════════════════════════════════════════════

🥇 PRIMARY (CODEOWNER)
┌─────────────────────────────────────────────────────────────┐
│ @team-lead                                                  │
│ Owns: src/features/checkout/* (4 files)                    │
│ Expertise: 45 commits in affected files                    │
│ Workload: 2 pending reviews (✅ Available)                 │
└─────────────────────────────────────────────────────────────┘

Add recommended reviewers? (y/n)
```

## 🛠️ CLI Commands

```bash
npx cursor-devops-commands              # Interactive install
npx cursor-devops-commands --bundle complete -y  # Non-interactive
npx cursor-devops-commands status       # Check installation
npx cursor-devops-commands list         # List all commands
npx cursor-devops-commands help         # Show help
```

## 📂 Installation Structure

After installation:

```
.cursor/
└── commands/
    ├── auto-rebase.md
    ├── suggest-reviewers.md
    ├── find-shared.md
    ├── decision-record.md
    ├── security-audit.md
    ├── rollback-impact.md
    ├── post-deploy-check.md
    └── metrics-report.md
```

## 🤝 Works With

- [Buddy OS](https://github.com/sharath317/buddy-os) - Role-aware autonomous agent
- [Cursor Full-Flow](https://github.com/sharath317/cursor-full-flow) - Jira to PR automation
- [Cursor Quality Suite](https://github.com/sharath317/cursor-quality-suite) - Testing & quality

## 📄 License

MIT © Sharath Chandra

---

**Secure, smart DevOps right in your editor.**
