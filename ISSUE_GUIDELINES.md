# Issue Management Guidelines

Guidelines for creating and managing issues in Code Baseline. Applied across Claude, Codex, Gemini AI assistance.

---

## Before Creating an Issue

1. **Search existing issues** — Check if already reported/planned
2. **Use correct template** — Bug? Feature? Task? Enhancement?
3. **Be specific** — "Doesn't work" → describe steps, actual behavior, expected behavior
4. **Include environment** — Python version, OS, branch, commit hash

---

## Issue Types

### Bug Report
- Something broken or behaving unexpectedly
- Requires: reproduction steps, actual vs expected behavior, error logs
- Auto-labeled: `type-bug`, `1-open`, `priority-medium`
- AI should: verify bug exists, add stack traces, confirm on main branch

### Feature Request
- New capability or API
- Requires: use case, proposed solution, alternatives considered
- Auto-labeled: `type-feature`, `1-open`, `priority-medium`
- AI should: scope clearly, break into subtasks if large

### Enhancement
- Improvement to existing feature (performance, usability, DX)
- Requires: current vs proposed behavior, benefit, backwards compatibility impact
- Auto-labeled: `type-enhancement`, `1-open`, `priority-medium`
- AI should: test backwards compatibility before implementing

### Task (Internal Work)
- Refactoring, documentation, testing, setup—no user-facing changes
- Requires: description, work items checklist, effort estimate
- Auto-labeled: `1-open`, `priority-medium`
- AI should: break into concrete steps, estimate time, mark dependencies

---

## Status Workflow

```
1-open → 2-in-progress → 3-in-testing → 4-review → 5-ready / status-closed
```

### `1-open` — New Issue
- Just created, not started
- **AI action**: Read requirements, clarify if needed, don't move yet
- **Human action**: Assign owner, set priority if needed

### `2-in-progress` — Work Started
- Development underway, or assigned to someone
- **AI action**: Update when opening branch/starting work
- **Human action**: Remove if blocked, re-open issue to discuss

### `3-in-testing` — Code Complete, Testing
- Implementation done, ready for QA/testing
- **AI action**: Mark when PR is merged or in final testing
- **Human action**: Run tests, verify behavior

### `4-review` — Awaiting Review
- Code ready for code review, waiting for approval
- **AI action**: Move when PR opened
- **Human action**: Review, approve, request changes

### `5-ready` — Ready for Merge / Deployment
- Approved, can be merged or released
- **AI action**: Move after human approval
- **Human action**: Merge or close if won't-fix

### `status-closed` — Complete / Won't Fix
- Issue resolved or deliberately closed
- **AI action**: Move when closing
- **Human action**: Verify closure reason

---

## Priority Levels

Set at creation time. Adjust if context changes.

### `priority-critical`
- **Blocks release**, production broken, security issue
- Drop everything else
- Examples: Auth broken, data loss, crash on startup
- Target: Fix same day

### `priority-high`
- **Needed before next milestone** or planned release
- Significant feature or bad UX
- Examples: Performance regression, major bug
- Target: Fix this sprint

### `priority-medium` (default)
- **Standard work**, fits in normal roadmap
- Enhancement, minor bug, tech debt
- Examples: UI polish, refactor, docs update
- Target: Fix when scheduled

### `priority-low`
- **Nice-to-have**, can defer indefinitely
- Minor issue, edge case, nice-to-have feature
- Examples: Rare error case, cosmetic bug, future optimization
- Target: Fix if time permits

---

## Labels You Control

### Type (required on PRs, optional on issues)
- `type-bug` — Bug fix
- `type-feature` — New feature
- `type-enhancement` — Improvement
- `type-docs` — Documentation
- `type-test` — Testing/CI/tooling

### Category (optional, helps with navigation)
- `category-backend` — Backend/API/server
- `category-frontend` — Frontend/UI/client
- `category-database` — Database/queries/schema
- `category-infra` — DevOps/deployment/config
- `category-docs` — Documentation/guides

### Workflow (optional)
- `help-wanted` — Looking for contributor help
- `blocked` — Waiting on something else
- `needs-design` — Needs design review first
- `needs-security-review` — Security review required
- `wontfix` — Deliberately closed, won't implement

---

## Writing Good Issues

### Title Format
```
[Type]: [Brief description]

Bug: Database connection pool exhausted on high load
Feature: Add webhook support for notifications
Enhance: Improve CLI output formatting
Task: Refactor auth middleware
```

### Description Structure
```
## Problem / Goal
[One sentence: what's broken or what's needed?]

## Details / Context
[2-3 sentences explaining the issue, use case, or why it matters]

## Acceptance Criteria
- [ ] Concrete, measurable requirement
- [ ] Another requirement
- [ ] Another requirement

## Related Issues
- Blocks: #123
- Depends on: #456
- Related: #789
```

### Common Mistakes to Avoid
- ❌ Vague title: "Fix stuff" → ✅ "Fix database timeout on concurrent writes"
- ❌ No reproduction steps → ✅ "Steps: 1) Create user, 2) Run sync, 3) Error appears"
- ❌ No expected behavior → ✅ "Expected: Success message; Actual: Silent failure"
- ❌ Missing environment → ✅ "Python 3.11, Linux, main branch"
- ❌ No acceptance criteria → ✅ "Must pass existing tests AND new test for edge case"

---

## AI Issue Workflow

When Claude, Codex, or Gemini work on issues:

### Opening an Issue
1. Use correct template (bug/feature/task/enhancement)
2. Fill all required fields
3. Set priority if context makes it clear
4. Link related issues
5. Include environment/context

### Moving Through States
1. Move to `2-in-progress` when starting work (create branch)
2. Move to `4-review` when PR is open
3. Move to `5-ready` when PR is approved (before merge)
4. Move to `status-closed` after merge or explicit closure

### PR and Issue Linking
```
# In PR description:
Closes #123
Relates to #456

# In commits:
git commit -m "Fix database timeout (fixes #123)"
```

GitHub auto-closes issues when PR is merged with "Closes #N".

---

## Review Checklist

Before closing an issue:
- [ ] Requirements met (all acceptance criteria checked)
- [ ] Tests pass (unit + integration if applicable)
- [ ] Documentation updated (README, comments, guides)
- [ ] No regressions (related features still work)
- [ ] Backwards compatible (or deprecation notice given)
- [ ] Performance acceptable (no 10x slowdown)

---

## Common Scenarios

### "I want to start working on this"
1. Request assignment (or self-assign if you can)
2. Move to `2-in-progress`
3. Create feature branch: `git checkout -b issue-123-description`
4. Commit with reference: `git commit -m "Fix X (issue #123)"`

### "This is blocked on something else"
1. Add `blocked` label
2. Leave comment: "Blocked waiting for #456 to merge"
3. Link the blocking issue in "Related Issues"
4. Move back to `1-open`

### "This is a duplicate"
1. Add `wontfix` label
2. Comment: "Duplicate of #123"
3. Move to `status-closed`

### "We won't do this"
1. Add `wontfix` label
2. Leave clear explanation: "Decided not to pursue due to X"
3. Move to `status-closed`

---

## CI/CD Integration

The label validation workflow (`validate-labels.yml`) automatically:
- ✅ Rejects multiple status labels (only 1 allowed)
- ✅ Warns if PR missing type label
- ✅ Auto-adds `1-open` + `priority-medium` to new unlabeled issues
- ❌ Fails the check if validation fails (must fix before proceeding)

---

## Metrics to Track

Over time, measure:
- **Time to close** — From `1-open` to `status-closed`
- **Type distribution** — Bugs vs features vs tasks
- **Priority accuracy** — Do critical issues get done first?
- **Open count** — Growing or shrinking backlog?
- **Blocked count** — How many issues are stuck?

---

**Last Updated**: 2026-06-17  
**For**: Code Baseline + AI Assistance  
**Contact**: Team lead or repository maintainer
