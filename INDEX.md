# Vibe Coding Templates Index

Baseline templates & scripts for new projects. Copy. Customize. Deploy.

---

## What's Here

### **setup-vibe-coding.sh**
Bootstrap script for new projects.

```bash
./setup-vibe-coding.sh my-project
```

Creates project with pre-configured:
- `.github/` workflows & issue templates
- Documentation (ISSUE_GUIDELINES, BRANCH_PROTECTION)
- Git repo (optional)

### **TEMPLATE_README.md**
Quick reference for using this template.

### **.github/**
- `ISSUE_TEMPLATE/` — Bug, Feature, Enhancement, Task templates
- `workflows/` — validate-labels, auto-release
- `CODEOWNERS` — Auto-assign reviewers
- `pull_request_template.md` — Structured PR format

### **Root Docs**
- `ISSUE_GUIDELINES.md` — Issue workflow, labels, priorities
- `BRANCH_PROTECTION.md` — GitHub setup instructions
- `SETUP_COMPLETE.md` — Full reference

---

## Quick Start

### Option 1: Script (Recommended)
```bash
cd /home/datament/templates/vibe-coding
./setup-vibe-coding.sh my-new-project
cd my-new-project
# Edit .github/CODEOWNERS
# Edit ISSUE_GUIDELINES.md
git commit -m "Add vibe-coding baseline"
git push origin main
```

### Option 2: Manual Copy
```bash
mkdir my-new-project
cd my-new-project
cp -r /home/datament/templates/vibe-coding/.github .
cp /home/datament/templates/vibe-coding/*.md .
# Customize files
git init && git add . && git commit -m "Add baseline"
```

---

## Template Structure

```
vibe-coding/
├── setup-vibe-coding.sh         # Bootstrap script
├── TEMPLATE_README.md           # Quick reference
├── INDEX.md                     # This file
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
└── SETUP_COMPLETE.md
```

---

## Workflows Included

### `validate-labels.yml`
Enforces issue/PR label rules:
- Status labels are mutually exclusive
- PRs require type label
- Auto-applies defaults to new issues
- Fails merge if validation fails

### `auto-release.yml`
Auto-creates tags + releases when version changes:
- Detects version bumps in `package.json` / `pyproject.toml` / `Cargo.toml`
- Creates git tag (e.g., `v1.2.3`)
- Creates GitHub release with notes
- Triggered automatically on push to `main`

---

## Label Schema

### Status (ONE per issue)
`1-open` → `2-in-progress` → `3-in-testing` → `4-review` → `5-ready` / `status-closed`

### Type
`type-bug` | `type-feature` | `type-enhancement` | `type-docs` | `type-test`

### Priority
`priority-critical` | `priority-high` | `priority-medium` | `priority-low`

### Optional
`category-backend` | `category-frontend` | `category-database` | `category-infra` | `category-docs`

---

## Customization Per Project

For each new project using this template:

- **CODEOWNERS** — Replace `@[username]` with real GitHub handles
- **config.yml** — Update repo URL in contact links
- **ISSUE_GUIDELINES.md** — Adjust for your team/tech stack
- **pull_request_template.md** — Add project-specific sections if needed
- **Branch Protection** — Enable in GitHub Settings (see BRANCH_PROTECTION.md)
- **Labels** — Create in GitHub (copy label names from schema above)

---

## For AI-Assisted Development

This template is designed to work with Claude, Codex, Gemini:

- Issues auto-labeled → AI can read labels and understand state
- Templates guide structure → AI fills them out correctly
- Workflows enforce rules → AI learns what's valid
- Auto-release handles versioning → AI doesn't need to manually tag

See TEMPLATE_README.md "AI Integration" section for examples.

---

## Troubleshooting

### "setup-vibe-coding.sh: command not found"
```bash
cd /home/datament/templates/vibe-coding
./setup-vibe-coding.sh my-project
```

### "Permission denied" on script
```bash
chmod +x /home/datament/templates/vibe-coding/setup-vibe-coding.sh
./setup-vibe-coding.sh my-project
```

### Workflows not running in new project
- Push `.github/workflows/` to GitHub
- Wait ~30 seconds
- Check Actions tab
- Verify YAML syntax

### Auto-release not triggering
- Ensure `package.json` (or equivalent) exists
- Version must actually change (1.0.0 → 1.0.1)
- Must be pushed to `main` branch

---

## Updates & Improvements

To update this template:
1. Edit files in `/home/datament/templates/vibe-coding/`
2. New projects will get updated version on next `setup-vibe-coding.sh`
3. Existing projects keep their version (copy template again if you want updates)

---

**Last Updated**: 2026-06-17  
**Status**: Ready for use  
**For**: New vibe-coding projects
