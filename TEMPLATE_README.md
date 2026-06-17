# Vibe Coding Baseline Template

Reusable GitHub workflows, issue templates, and guidelines for new projects.

Use this as a starting point for projects that need:
- Structured issue/PR workflow
- Automated label validation
- Auto-releases from version bumps
- Code review automation
- AI-friendly practices (Claude, Codex, Gemini)

---

## Quick Setup

### Option 1: Copy Template to New Project

```bash
# Create new project
mkdir my-new-project
cd my-new-project
git init

# Copy template
cp -r /home/datament/templates/vibe-coding/.github .
cp /home/datament/templates/vibe-coding/*.md .

# Customize
# 1. Edit .github/CODEOWNERS (add team usernames)
# 2. Update links in .github/ISSUE_TEMPLATE/config.yml
# 3. Customize ISSUE_GUIDELINES.md for your team
# 4. Create project structure

git add .github/ *.md
git commit -m "Add vibe-coding baseline"
git push origin main
```

### Option 2: Use Setup Script

```bash
./setup-vibe-coding.sh my-new-project
```

---

## Template Contents

### `.github/ISSUE_TEMPLATE/`
- `bug_report.md` — Bug reports with reproduction steps
- `feature_request.md` — New feature proposals
- `enhancement.md` — Improvements to existing features
- `task.md` — Internal work (refactor, docs, infra)
- `config.yml` — Issue selector + help links

### `.github/workflows/`
- `validate-labels.yml` — Enforce label rules on every issue/PR
- `auto-release.yml` — Auto-create tags + releases on version bump

### `.github/`
- `CODEOWNERS` — Auto-assign reviewers by file pattern
- `pull_request_template.md` — Structured PR format

### Root Docs
- `ISSUE_GUIDELINES.md` — Issue workflow, status labels, priorities
- `BRANCH_PROTECTION.md` — Enable & configure branch protection
- `SETUP_COMPLETE.md` — Full reference + label schema

---

## Customization Checklist

For each new project:

- [ ] **CODEOWNERS** — Replace placeholders with real GitHub usernames
- [ ] **config.yml** — Update GitHub repo URL in contact links
- [ ] **ISSUE_GUIDELINES.md** — Adjust for your team/tech stack
- [ ] **pull_request_template.md** — Optional: add project-specific sections
- [ ] **Branch Protection** — Enable on `main` branch in GitHub Settings
- [ ] **Labels** — Create labels in GitHub (or use `gh label create`)

---

## Label Schema (Copy to New Repo)

### Status (mutually exclusive — ONE per issue)
- `1-open` — New, not started
- `2-in-progress` — Active work
- `3-in-testing` — Code done, in testing
- `4-review` — Awaiting code review
- `5-ready` — Ready to merge/release
- `status-closed` — Complete/won't-fix

### Type
- `type-bug` — Bug fix
- `type-feature` — New feature
- `type-enhancement` — Improvement
- `type-docs` — Documentation
- `type-test` — Testing/CI/tooling

### Priority
- `priority-critical` — Blocks release
- `priority-high` — This sprint
- `priority-medium` — Standard (default)
- `priority-low` — Deferrable

### Categories (optional)
- `category-backend` — Backend/API
- `category-frontend` — Frontend/UI
- `category-database` — Database
- `category-infra` — DevOps/deployment
- `category-docs` — Documentation

---

## Create Labels in GitHub

```bash
# Status labels
gh label create "1-open" --color "0075ca" --description "New, not started"
gh label create "2-in-progress" --color "fbca04" --description "Work in progress"
gh label create "3-in-testing" --color "f7e7ce" --description "Code done, testing"
gh label create "4-review" --color "d4a574" --description "Awaiting review"
gh label create "5-ready" --color "c2e0c6" --description "Ready to merge"
gh label create "status-closed" --color "eaeaea" --description "Complete/closed"

# Type labels
gh label create "type-bug" --color "d73a4a" --description "Bug fix"
gh label create "type-feature" --color "a2eeef" --description "New feature"
gh label create "type-enhancement" --color "7057ff" --description "Improvement"
gh label create "type-docs" --color "0075ca" --description "Documentation"
gh label create "type-test" --color "cccccc" --description "Testing/CI"

# Priority labels
gh label create "priority-critical" --color "b60205" --description "Blocks release"
gh label create "priority-high" --color "ff6b47" --description "This sprint"
gh label create "priority-medium" --color "fbca04" --description "Standard"
gh label create "priority-low" --color "cccccc" --description "Deferred"
```

---

## Enable Workflows in New Project

1. Push `.github/workflows/` to GitHub
2. Go to **Actions** tab → workflows should appear
3. They activate automatically on next issue/PR/push

For `auto-release.yml` to work:
- Ensure `package.json`, `pyproject.toml`, or `Cargo.toml` exists
- Bump version → commit → push → workflow creates tag + release

---

## AI Integration

Template is designed for AI-assisted development:

### Claude/Codex/Gemini Workflow
```
AI reads templates → Creates issue with correct structure
Auto-label enforces consistency → AI respects label transitions
PR template guides description → Workflow validates format
Auto-release handles versioning → No manual tag creation
```

### Example: AI Feature Implementation
```bash
1. User: "Add feature X"
2. Claude: Creates #42 with feature_request template
   → Auto-labeled: type-feature, 1-open, priority-medium
3. Claude: Creates branch, commits, pushes
4. Claude: Opens PR using pr_template.md
5. Workflow: Validates labels ✓
6. Human: Reviews, approves
7. Claude: Merges, updates version in package.json
8. Workflow: Creates tag v1.2.3 + release ✓
```

---

## File Structure

```
my-new-project/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── config.yml
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   ├── enhancement.md
│   │   └── task.md
│   ├── workflows/
│   │   ├── validate-labels.yml
│   │   ├── auto-release.yml
│   │   └── README.md
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── ISSUE_GUIDELINES.md
├── BRANCH_PROTECTION.md
├── SETUP_COMPLETE.md
├── README.md (project-specific)
├── src/
├── tests/
└── [other project files]
```

---

## Tips

- **Start small** — Copy template, customize CODEOWNERS, enable branch protection
- **Iterate** — Adjust label schema if team prefers different categories
- **Document locally** — Keep ISSUE_GUIDELINES.md in sync with team practices
- **Automate labels** — Let workflows handle defaults; humans override for edge cases
- **Track metrics** — Monitor open/closed ratio, time-to-close, by priority

---

## Troubleshooting

### Workflows Not Running
- Workflows only trigger after push to remote `main`
- Check GitHub Actions tab for errors
- Verify YAML syntax (copy from template, don't edit by hand if unsure)

### Labels Not Auto-Applying
- Ensure `validate-labels.yml` is in `.github/workflows/`
- Ensure workflow has permission to edit issues
- New issues created after workflow push will be labeled

### Release Not Created
- Ensure `package.json` or equivalent exists
- Verify version actually changed (e.g., 1.0.0 → 1.0.1)
- Check GitHub Actions logs for errors

---

## Questions?

- See `ISSUE_GUIDELINES.md` for workflow details
- See `BRANCH_PROTECTION.md` for setup instructions
- See `.github/workflows/README.md` for workflow docs

---

**Template Version**: 2026-06-17  
**Based on**: Datament Code Baseline  
**Use for**: New vibe-coding projects across teams
