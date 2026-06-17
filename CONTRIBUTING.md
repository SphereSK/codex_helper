# Contributing to Vibe App

Welcome! We're excited to have you contribute.

---

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-org/vibe-app.git
   cd vibe-app
   ```

2. **Setup local development**
   ```bash
   cp .env.example .env.local
   npm install
   docker-compose up -d
   npm run db:migrate
   npm run dev
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/my-feature
   ```

---

## Development Workflow

### Before Coding

- [ ] Check issue tracker for related work
- [ ] Create issue if none exists
- [ ] Discuss approach if significant change
- [ ] Get assigned to prevent duplicate work

### While Coding

- [ ] Follow code style (ESLint + Prettier)
- [ ] Write tests for new features
- [ ] Update documentation if needed
- [ ] Keep commits focused and clear

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve null pointer in dashboard
docs: update API documentation
test: add tests for auth middleware
refactor: simplify error handling
```

Commit example:
```bash
git commit -m "feat: add password reset endpoint (closes #123)"
```

### Before Submitting PR

```bash
# Format code
npm run format

# Check linting
npm run lint

# Run tests
npm test

# Type check
npm run type-check

# Build
npm run build
```

---

## Pull Request Process

### PR Title Format

```
[TYPE] Brief description
```

Examples:
- `[FEATURE] Add dark mode toggle`
- `[FIX] Resolve authentication timeout`
- `[DOCS] Update API reference`
- `[TEST] Add E2E tests for login flow`

### PR Description

Include:
- ✅ What changed and why
- ✅ Closes/Fixes #issue-number
- ✅ Testing instructions
- ✅ Screenshots (if UI changes)
- ✅ Breaking changes (if any)

### Code Review

- At least 1 approval required
- Status checks must pass
- Resolve conversations before merge
- Keep discussions professional

---

## Testing Requirements

### Unit Tests
```bash
npm test
```

- Minimum 70% coverage
- Test happy path and error cases
- Mock external dependencies

### Integration Tests
```bash
npm run test:integration
```

- Test API endpoints
- Verify database interactions
- Check middleware behavior

### E2E Tests
```bash
npm run test:e2e
```

- Test critical user flows
- Verify UI interactions
- Check form submissions

---

## Code Style

### ESLint + Prettier

Automatically fixed on commit:
```bash
npm run format    # Auto-format code
npm run lint      # Check style
```

### Naming Conventions

```ts
// Components: PascalCase
export function UserCard() {}

// Utilities/hooks: camelCase
export function useAuth() {}
export function formatDate() {}

// Constants: UPPER_CASE
export const MAX_RETRIES = 3

// Types: PascalCase
export interface UserProfile {}
export type Status = 'active' | 'inactive'
```

### File Organization

```
src/
├── components/        # React components
├── hooks/            # Custom hooks
├── lib/              # Utilities (db, auth, etc)
├── types/            # TypeScript types
├── middleware/       # Request middleware
└── styles/           # Global styles
```

---

## Documentation

### Update When:
- Adding new feature
- Changing API
- Fixing unclear behavior
- Adding configuration option

### Document:
- README.md — Feature overview
- docs/ — Detailed guides
- Code comments — Non-obvious logic
- CHANGELOG.md — User-facing changes

---

## Common Issues

### Pre-commit hooks failing
```bash
# Lint errors: Fix manually or run
npm run format

# Type errors: Check tsconfig.json
npm run type-check
```

### Tests failing
```bash
# Run tests with verbose output
npm test -- --verbose

# Check specific test
npm test -- Button.test.tsx

# Update snapshots if intended
npm test -- -u
```

### Database migration issues
```bash
# Reset database (destructive!)
npm run db:reset

# Or manually check migrations
npx prisma migrate status
```

---

## Questions?

- **Slack**: #development channel
- **Discussions**: GitHub Discussions tab
- **Issues**: Open an issue with `[QUESTION]` prefix

---

## Code of Conduct

Be respectful, inclusive, and constructive:

- 🙏 Assume good intent
- 💡 Give and receive feedback gracefully
- 🤝 Help others grow
- 🚫 No harassment or discrimination

---

**Thank you for contributing!** 🎉
