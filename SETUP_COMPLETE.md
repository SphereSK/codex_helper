# Baseline Workflows Setup Complete

Consolidated GitHub workflows, issue templates, and branch protection rules for Code Baseline.

---

## What Was Created

### 1. Issue Templates (`.github/ISSUE_TEMPLATE/`)
- `bug_report.md` — Report bugs with reproduction steps
- `feature_request.md` — Propose new features
- `enhancement.md` — Improve existing features
- `task.md` — Internal work (refactor, docs, setup)
- `config.yml` — Issue selector + help links

**Auto-labeling**: New issues get `1-open` + `priority-medium` by default

---

### 2. GitHub Actions Workflows (`.github/workflows/`)

#### `validate-labels.yml` (Required)
- Enforces mutually-exclusive status labels (only one per issue)
- Warns if PR missing type label
- Auto-applies defaults to new issues
- Fails if validation fails (must fix before merge)

**Status Labels**: `1-open` → `2-in-progress` → `3-in-testing` → `4-review` → `5-ready` / `status-closed`

**Type Labels**: `type-bug` | `type-feature` | `type-enhancement` | `type-docs` | `type-test`

#### `auto-release.yml` (Optional)
- Auto-creates git tags + GitHub releases when version changes on `main`
- Supports: `package.json`, `pyproject.toml`, `Cargo.toml`
- Triggered automatically (no manual tag creation needed)

---

### 3. Documentation

#### `ISSUE_GUIDELINES.md`
- How to write good issues
- Status workflow (open → in-progress → testing → review → ready → closed)
- Priority levels and what they mean
- AI workflow integration (Claude, Codex, Gemini)
- Common scenarios and checklist

#### `BRANCH_PROTECTION.md`
- Setup instructions for GitHub branch protection
- Why protect main: prevents direct pushes, requires review, enforces checks
- Step-by-step configuration
- Testing & troubleshooting
- Emergency bypass procedures

#### `pull_request_template.md`
- Structured PR format with sections
- Type of change (bug/feature/enhancement/etc)
- Testing checklist
- Backwards compatibility check
- Reviewer checklist

#### `.github/CODEOWNERS`
- Auto-assigns reviewers based on file patterns
- Customize with your team's usernames/paths
- GitHub requests review automatically on PR open

---

## Label Schema Reference

### Status (mutually exclusive — pick ONE)
| Label | Meaning | Who moves it |
|-------|---------|-------------|
| `1-open` | New, not started | Auto-applied |
| `2-in-progress` | Work in progress | Developer/AI |
| `3-in-testing` | Code done, testing | Developer/AI |
| `4-review` | Awaiting code review | Developer/AI |
| `5-ready` | Ready to merge/release | Reviewer |
| `status-closed` | Complete/won't-fix | Developer/AI |

### Type (describe the change)
| Label | Meaning |
|-------|---------|
| `type-bug` | Bug fix |
| `type-feature` | New feature |
| `type-enhancement` | Improvement |
| `type-docs` | Documentation |
| `type-test` | Testing/CI/tooling |

### Priority (urgency)
| Label | Meaning |
|-------|---------|
| `priority-critical` | Blocks release |
| `priority-high` | Needed this sprint |
| `priority-medium` | Standard (default) |
| `priority-low` | Nice-to-have, deferrable |

### Optional Categories
| Label | Meaning |
|-------|---------|
| `category-backend` | Backend/API |
| `category-frontend` | Frontend/UI |
| `category-database` | Database |
| `category-infra` | DevOps/deployment |
| `category-docs` | Documentation |

### Workflow
| Label | Meaning |
|-------|---------|
| `blocked` | Waiting on something else |
| `help-wanted` | Looking for contributor |
| `wontfix` | Deliberately closed |

---

## Next Steps

### 1. Push to GitHub
```bash
git add .github/ ISSUE_GUIDELINES.md BRANCH_PROTECTION.md
git commit -m "Add baseline GitHub workflows, issue templates, and documentation"
git push origin main
```

### 2. Customize CODEOWNERS
Edit `.github/CODEOWNERS`:
- Replace `@[lead-username]`, `@[backend-lead]`, etc with real GitHub handles
- Add paths specific to your project structure
- Commit and push

### 3. Configure Branch Protection
1. Go to GitHub repository **Settings** → **Branches**
2. Add rule for `main` (see `BRANCH_PROTECTION.md` for full setup)
3. Require status checks: `validate-labels`
4. Require 1+ code review approvals
5. Enable "Dismiss stale reviews"

### 4. Create Initial Labels (Optional)
GitHub doesn't auto-create labels. Create them manually or via CLI:

```bash
# Using gh CLI
gh label create "1-open" --description "New, not started" --color "0075ca"
gh label create "2-in-progress" --description "Work in progress" --color "fbca04"
gh label create "3-in-testing" --description "Testing phase" --color "f7e7ce"
gh label create "4-review" --description "Code review" --color "d4a574"
gh label create "5-ready" --description "Ready to merge" --color "c2e0c6"
gh label create "status-closed" --description "Complete/closed" --color "eaeaea"

gh label create "type-bug" --description "Bug fix" --color "d73a4a"
gh label create "type-feature" --description "New feature" --color "a2eeef"
gh label create "type-enhancement" --description "Improvement" --color "7057ff"
gh label create "type-docs" --description "Documentation" --color "0075ca"
gh label create "type-test" --description "Testing/CI" --color "cccccc"

gh label create "priority-critical" --description "Blocks release" --color "b60205"
gh label create "priority-high" --description "This sprint" --color "ff6b47"
gh label create "priority-medium" --description "Standard" --color "fbca04"
gh label create "priority-low" --description "Deferred" --color "cccccc"
```

### 5. Document Team Guidelines
Edit `ISSUE_GUIDELINES.md` to reflect your team's conventions:
- Issue naming conventions
- Review expectations
- Deployment procedures
- On-call rotation (if applicable)

### 6. Test the Workflows
1. Create a test issue → Check for auto-labels
2. Open a PR without type label → Should warn
3. Add multiple status labels → Should fail validation
4. Merge a PR → Verify branch protection works

---

## AI Integration (Claude, Codex, Gemini)

The baseline enables AI tools to:

1. **Create issues** using templates → Auto-labeled correctly
2. **Move issues** through workflow → Status labels transition logically
3. **Open PRs** with type labels → Passes validation
4. **Auto-release** → Tag created when version bumps
5. **Self-serve** → AI doesn't need manual label management

### Example AI Workflow
```
User: "Add feature X"
  ↓
Claude creates issue #42 using feature_request template
  → Auto-labeled: type-feature, 1-open, priority-medium
  ↓
Claude creates branch: issue-42-feature-x
  ↓
Claude codes, commits: "Add feature X (closes #42)"
  ↓
Claude opens PR, adds type-feature label
  → Workflow validates labels ✓
  ↓
Claude updates issue to 4-review
  ↓
Human reviews, approves
  ↓
Claude merges PR
  → Issue auto-closes (Closes #42 in commit)
  → Workflow detects version bump
  → auto-release.yml creates tag v1.2.3 + release
  ✓ Done
```

---

## Files Checklist

- [x] `.github/ISSUE_TEMPLATE/bug_report.md`
- [x] `.github/ISSUE_TEMPLATE/feature_request.md`
- [x] `.github/ISSUE_TEMPLATE/enhancement.md`
- [x] `.github/ISSUE_TEMPLATE/task.md`
- [x] `.github/ISSUE_TEMPLATE/config.yml`
- [x] `.github/workflows/validate-labels.yml`
- [x] `.github/workflows/auto-release.yml`
- [x] `.github/workflows/README.md`
- [x] `.github/pull_request_template.md`
- [x] `.github/CODEOWNERS` (customize needed)
- [x] `ISSUE_GUIDELINES.md`
- [x] `BRANCH_PROTECTION.md`
- [x] `SETUP_COMPLETE.md` (this file)

---

## Troubleshooting

### Workflows Not Showing in GitHub Actions Tab
- Workflows only activate after being pushed to remote `main`
- Push `.github/workflows/` files and wait ~30 seconds
- Check GitHub Actions tab → should show runs

### Labels Not Auto-Applying
- Check that `validate-labels.yml` is enabled
- Ensure workflow syntax is valid (check GitHub Actions logs)
- New issues created after workflow push will be labeled

### Status Checks Not Blocking Merge
- Need branch protection rule configured (see `BRANCH_PROTECTION.md`)
- Rule must include `validate-labels` in required checks
- Without branch protection rule, workflows run but don't block merge

### CODEOWNERS Not Requesting Review
- Edit `.github/CODEOWNERS` with real GitHub usernames
- Create a test PR → reviewers should be auto-requested
- GitHub handles are case-sensitive

---

## Related Files
- `ISSUE_GUIDELINES.md` — Issue workflow & best practices
- `BRANCH_PROTECTION.md` — Setup & enforcement
- `.github/workflows/README.md` — Workflow details
- `.github/pull_request_template.md` — PR structure

---

**Created**: 2026-06-17  
**Status**: Ready for GitHub push  
**Next**: Configure branch protection + customize CODEOWNERS + push to main
