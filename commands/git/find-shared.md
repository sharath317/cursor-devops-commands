# Find Similar Code to Reuse

## Overview

Search the monorepo for similar code patterns, components, utilities, or logic that can be reused instead of reimplementing. Helps maintain DRY principles and identify opportunities for code sharing across apps and libraries.

## Analyze Current Context

### Understanding the Need

-   [ ] What is the core functionality required?
-   [ ] What problem does it solve?
-   [ ] Are there similar features already implemented in other parts of the codebase?
-   [ ] Is this UI component, business logic, utility function, or API client?

### Search Priority by Type

**For UI Components:**

1. Check OXIDE design system first: `src/design-system/src/ui/components/`
2. Check shared business components: `src/components/src/components/`
3. Search domain libraries: `libraries/yourcompany/*/src/components/`
4. Look in similar apps: `apps/*/src/components/`

**For Utilities/Helpers:**

1. Common utilities: `libraries/core/core-common/src/` (datetime, validation, encoding, helper)
2. Browser utilities: `libraries/core/core-browser/src/` (storage, URL, device, hooks)
3. Business utilities: `libraries/yourcompany/*/src/utils/` or `*/src/helpers/`

**For API Clients:**

1. Existing API libraries: `libraries/yourcompany/api-*/`
2. Check naming pattern: `api-{service-name}`

**For Hooks:**

1. Common hooks: `libraries/core/core-common/src/hooks/`
2. Browser hooks: `libraries/core/core-browser/src/hooks/`
3. Business hooks: `libraries/yourcompany/*/src/hooks/`

**For Types/Interfaces:**

1. Common data models: `libraries/core/core-common/src/dataModels/`
2. Domain types: `libraries/yourcompany/*/src/types/` or `*/src/dataModels/`

**For Styling:**

1. Design tokens: `src/design-system/src/utils/` (spacing, color, borderRadius, rem)
2. Enums: `src/design-system/src/enums/` (OXBiggerThan, Kind)

### Search Strategies

**Semantic Search** (use codebase_search tool):

-   "How does [similar feature] work?"
-   "Where is [functionality] implemented?"
-   "What components handle [use case]?"
-   "Which utilities exist for [purpose]?"

**Pattern Search** (use grep tool):

-   Find similar function names
-   Search for interface patterns
-   Look for hook implementations
-   Find component usage patterns

### Decision Framework

**✅ Reuse if:**

-   Matches 80%+ of requirements
-   Minimal modifications needed

**🔧 Adapt if:**

-   Matches 60-80% of requirements
-   Can be extended without breaking changes
-   Located in appropriate library

**🆕 Create new if:**

-   No similar implementation exists
-   Existing code is deprecated or low quality
-   Requirements differ significantly (>50%)
-   Modifications would be too extensive

**📦 Extract to library if:**

-   Similar code exists in 2+ apps
-   Functionality is generic and stable
-   Can benefit other teams

## Output Format

Provide findings in this structure:

### Found Similar Code

**Location**: `path/to/file`
**Match %**: 85%
**Pros**: [List benefits]
**Cons**: [List limitations]
**Recommendation**: Reuse / Modify / Create New
