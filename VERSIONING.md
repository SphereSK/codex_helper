# Versioning — Semantic Versioning & Releases

Standard version numbering: `MAJOR.MINOR.PATCH`

---

## Semantic Versioning (SemVer)

### Version Format: MAJOR.MINOR.PATCH

- **MAJOR** — Breaking API changes (users must update)
- **MINOR** — New features, backwards compatible
- **PATCH** — Bug fixes, backwards compatible

### Examples

```
1.0.0  — Initial release
1.0.1  — Bug fix (1.0.0 → 1.0.1)
1.1.0  — New feature (1.0.1 → 1.1.0)
2.0.0  — Breaking change (1.X.X → 2.0.0)
```

---

## When to Bump Version

### PATCH (Bug fixes)

```
1.0.0 → 1.0.1
```

**When:**
- Fix data validation bug
- Fix security issue
- Fix typo in error message
- Performance improvement
- Internal refactoring (no API change)

**Do not bump:**
- Adding new features
- Changing API signature
- Removing deprecated features

**Example commit:**
```
fix: handle null user on dashboard (fixes #123)
```

---

### MINOR (New features)

```
1.0.0 → 1.1.0
```

**When:**
- Add new endpoint
- Add new hook/utility
- Add new component
- Extend existing endpoint (backwards compatible)
- New optional parameter

**Backwards compatible:**
- Old code still works
- Old API still available
- No breaking changes

**Example commits:**
```
feat: add password reset endpoint
feat: add useLocalStorage hook
```

---

### MAJOR (Breaking changes)

```
1.0.0 → 2.0.0
```

**When:**
- Remove endpoint
- Change API response format
- Rename function/component
- Change required parameter
- Remove support for old feature
- Database schema change requiring migration

**Breaking changes require:**
- Migration guide in release notes
- Deprecation notice (give users time before major)
- Clear communication

**Example commits:**
```
feat!: remove deprecated /api/auth/login endpoint
feat!: change POST /api/users response format
```

---

## Deprecation Policy

### Timeline for Breaking Changes

```
v1.5.0 — Add deprecation warning
v1.6.0 — More prominent warning
v2.0.0 — Remove deprecated feature
```

### Deprecation Notice

In code:
```ts
export function oldFunction() {
  console.warn(
    'oldFunction is deprecated. Use newFunction instead. ' +
    'Will be removed in v2.0.0'
  )
}
```

In release notes:
```markdown
## Deprecations

- `POST /api/users/login` → Use `POST /api/auth/login` instead
  Will be removed in v2.0.0
```

---

## Automated Releases

### How It Works

1. Update version in `package.json`:
```json
{
  "version": "1.2.3"
}
```

2. Commit to main:
```bash
git add package.json
git commit -m "Release v1.2.3"
```

3. GitHub Action triggers automatically:
   - Creates git tag: `v1.2.3`
   - Creates GitHub release
   - Publishes release notes

See `auto-release.yml` for details.

---

## Release Notes Format

### Template

```markdown
# Release v1.2.3

## New Features
- Add dark mode support
- Add search filtering

## Bug Fixes
- Fix validation error on signup
- Fix missing notification sound

## Performance
- Reduce bundle size by 15%
- Optimize database queries

## Breaking Changes
- Removed deprecated POST /api/login endpoint
- Changed POST /api/posts response format

## Migration Guide
If upgrading from v1.2.2:
1. Update your imports
2. Run database migrations
3. No other changes needed

## Contributors
- @alice (5 commits)
- @bob (3 commits)
```

### Sections

**New Features** — What's new and exciting
**Bug Fixes** — What was broken and is fixed
**Performance** — Speed/size improvements
**Breaking Changes** — What changed that breaks old code
**Migration Guide** — How to upgrade
**Contributors** — Who made this release
**Known Issues** — What's still broken (if any)

---

## Command Reference

### Bump Version Manually

```bash
# Patch (1.0.0 → 1.0.1)
npm version patch

# Minor (1.0.0 → 1.1.0)
npm version minor

# Major (1.0.0 → 2.0.0)
npm version major
```

This updates `package.json` and creates a git tag automatically.

### Check Current Version

```bash
npm run version
# or
cat package.json | grep version
```

### Create Release Manually

```bash
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3
# auto-release.yml creates the GitHub release
```

---

## Pre-Release Versions

For beta, alpha, rc versions:

```
1.2.3-alpha.1    — Early development
1.2.3-beta.1     — Beta testing
1.2.3-rc.1       — Release candidate
1.2.3            — Final release
```

**In package.json:**
```json
{
  "version": "1.2.3-beta.1"
}
```

---

## Versioning Across Ecosystem

If you have multiple packages:

```
my-app               v1.5.0
my-app/api           v1.2.0
my-app/web           v2.1.0
my-app-cli           v1.0.0
```

**Lock versions together (recommended):**
```bash
# Update all to v2.0.0
npm version major  # All packages bumped together
```

**Or version independently:**
```bash
# Just bump API
cd packages/api
npm version minor

# Just bump CLI
cd packages/cli
npm version patch
```

---

## Git Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat` — New feature (triggers MINOR bump)
- `fix` — Bug fix (triggers PATCH bump)
- `feat!` — Breaking change (triggers MAJOR bump)
- `docs` — Documentation
- `style` — Code style (no logic change)
- `refactor` — Code reorganization (no behavior change)
- `perf` — Performance improvement
- `test` — Test changes
- `chore` — Tooling, dependencies

### Examples

```
feat: add user authentication

fix: handle null values in dashboard

feat!: change POST /api/posts response format
BREAKING CHANGE: Response now includes { data: {...} } wrapper
```

---

## Changelog File

Keep `CHANGELOG.md` up-to-date:

```markdown
# Changelog

## [1.2.3] - 2026-06-17

### Added
- Dark mode support
- Search filtering

### Fixed
- Validation error on signup
- Missing notification sound

### Changed
- Updated dependencies

### Security
- Fixed XSS vulnerability

## [1.2.2] - 2026-06-10

### Added
- User preferences endpoint

### Fixed
- Database connection timeout
```

---

## Tools

### Release Management
- `npm version` — Bump version
- `gh release create` — Create GitHub release
- `semantic-release` — Automated releases (advanced)

### Changelog Generation
- `conventional-changelog` — Auto-generate from commits
- Manual editing (recommended for clarity)

---

## Best Practices

✅ **Do:**
- Use SemVer consistently
- Document breaking changes
- Provide migration guides
- Give deprecation warnings
- Tag releases in git
- Test before releasing

❌ **Don't:**
- Skip version bumps (no v1.0.0 → v1.0.0)
- Release breaking changes in PATCH
- Use non-standard versioning (v1.0.0.1)
- Forget to document changes
- Release untested code

---

**Last Updated**: 2026-06-17  
**Standard**: Semantic Versioning 2.0.0  
**Commit Convention**: Conventional Commits
