# Branch Protection Setup

Enable branch protection on `main` to enforce baseline rules.

---

## Why Branch Protection?

Prevents:
- Direct pushes to `main` (all changes via PR)
- Merges without code review
- Merges with failing status checks
- Merges with invalid labels
- Force pushes that rewrite history

---

## Setup Instructions

### Step 1: Enable Branch Protection Rule

1. Go to repository **Settings** → **Branches**
2. Click **Add rule**
3. Set **Branch name pattern**: `main`
4. Click **Create**

---

### Step 2: Require Status Checks to Pass

Under "Require status checks to pass before merging":

- [ ] **Require branches to be up to date before merging**
- [ ] **Require status checks to pass**
  - Select: `validate-labels` (or any other CI checks)

This ensures:
- Label validation passes before merge
- All CI tests pass before merge
- Branch is up-to-date with main

---

### Step 3: Require Code Review

Under "Require a pull request before merging":

- [x] **Require pull requests before merging**
- [x] **Require approvals**: Set to **1** (or more for larger teams)
- [x] **Require review from Code Owners** (optional, if CODEOWNERS file exists)
- [x] **Dismiss stale pull request approvals when new commits are pushed**
- [x] **Require approval of the latest reviewable commit**

---

### Step 4: Enforce Restrictions

Under "Restrictions":

- [x] **Restrict who can push to matching branches**
  - Allow: `admin` (or specific teams)
  - This prevents accidental main pushes

---

### Step 5: Additional Rules (Optional)

- [x] **Require conversation resolution before merging** — Requires all comments resolved
- [x] **Require signed commits** — Requires GPG/S256 signed commits (security)
- [x] **Lock branch** — Makes branch read-only during deployments

---

## YAML Configuration (Alternative)

If your repo uses branch protection via code (e.g., Terraform, GitHub Actions), use:

```yaml
branch_protection:
  pattern: main
  require_status_checks: true
  status_checks:
    - validate-labels
    - ci-tests  # or your CI check name
  require_pull_request_reviews: true
  required_approving_review_count: 1
  dismiss_stale_reviews: true
  require_code_owner_reviews: false
  require_signed_commits: false
  restrict_pushes:
    admin_enforced: true
```

---

## Testing the Setup

### Verify Protection Works

1. Try pushing directly to `main`:
   ```bash
   git push origin main
   ```
   **Expected**: Rejected with "protected branch" error

2. Create branch and PR without labels:
   ```bash
   git checkout -b test-feature
   git commit --allow-empty -m "test"
   git push origin test-feature
   # Open PR
   ```
   **Expected**: Workflow warns about missing type label

3. Create PR with multiple status labels:
   ```bash
   # Manually add 1-open + 2-in-progress to PR
   ```
   **Expected**: Workflow rejects with error message

4. Try merging without approval:
   **Expected**: GitHub blocks merge, shows "Need approval"

---

## Team Workflow

With branch protection enabled:

```
1. Create feature branch
   git checkout -b issue-123-description

2. Make commits
   git commit -m "Fix bug (fixes #123)"
   git commit -m "Add test"

3. Push and create PR
   git push origin issue-123-description
   # Open PR on GitHub

4. GitHub workflow validates labels
   ✓ Auto-applies type label if missing
   ✓ Rejects if multiple status labels
   ✗ Stops merge if labels invalid

5. Request review
   - Comment: "Ready for review"
   - Assign reviewer

6. Reviewer approves
   - Reviews code
   - Approves PR

7. Merge PR
   - All checks pass
   - One approval given
   - Branch up-to-date with main
   - Can now merge safely

8. GitHub closes issue
   - If PR title has "Closes #123"
   - Issue auto-closes when PR merges
```

---

## Troubleshooting

### "Branch is protected. Required status checks must pass."
- Wait for CI checks to complete
- Fix any failing checks
- Push new commit to retry

### "Pull request cannot be merged"
- Wait for required approval
- Request review from team member
- Ensure all status checks pass

### "This branch is out of date"
- Update branch: `git fetch origin && git rebase origin/main`
- Force push to PR branch: `git push --force-with-lease origin [branch]`

### "Multiple status labels detected"
- Go to PR/issue labels
- Remove conflicting status labels (keep only one)
- Workflow will auto-comment with guidance

---

## Exceptions

### Allow direct pushes (emergency only)
1. Go to **Settings** → **Branches** → `main` rule
2. Under "Restrict who can push": Add yourself temporarily
3. Make emergency fix
4. Immediately remove permission

### Bypass for critical hotfix
1. Create hotfix branch: `git checkout -b hotfix-critical`
2. Make changes and test locally
3. Merge via PR (still requires review)
4. If absolutely urgent: contact admin for bypass

---

## Best Practices

1. **Always use PRs** — Never force push to main
2. **Keep reviews small** — <400 lines of code per PR
3. **Resolve before merge** — Fix all failing checks before merging
4. **One approval minimum** — At least one human review
5. **Up-to-date branches** — Rebase on latest main before merge
6. **Meaningful commits** — Each commit should build on previous

---

**Last Updated**: 2026-06-17  
**Status**: Recommended Configuration  
**Enforces**: Baseline Standards
