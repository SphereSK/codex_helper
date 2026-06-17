# Next.js Vibe-Coding Baseline — Complete Guide

Production-ready baseline for Next.js projects. Use as template for new applications.

**Stack**: Next.js 14+, TypeScript, Tailwind CSS, Prisma, Docker, PostgreSQL, Redis

---

## What's Included

### 1. GitHub Workflows & Templates
**Files**: `.github/workflows/`, `.github/ISSUE_TEMPLATE/`

- **validate-labels.yml** — Auto-enforce label rules on issues/PRs
- **auto-release.yml** — Auto-create tags + releases on version bump
- **Issue Templates** — Bug, Feature, Enhancement, Task
- **PR Template** — Structured format with checklist
- **CODEOWNERS** — Auto-assign reviewers (customize)

**Use for**: Enforcing team practices, automated releases

---

### 2. Development Setup
**Files**: `docker-compose.yml`, `Dockerfile`, `.env.example`, `LOCAL_SETUP.md`

- **Docker Compose** — PostgreSQL, Redis, Next.js dev server
- **Dockerfile** — Multi-stage build, health checks
- **.env.example** — All required environment variables
- **LOCAL_SETUP.md** — 5-minute quick start guide

**Use for**: Consistent local dev environment

---

### 3. Code Quality
**Files**: `.eslintrc.json`, `.prettierrc`, `.pre-commit-config.yaml`

- **ESLint** — TypeScript + Next.js rules
- **Prettier** — Code formatting
- **Pre-commit hooks** — Auto-format + lint before commit

**Use for**: Consistent code style, catch issues early

---

### 4. AI Integration
**File**: `AI_BRIEFING.md`

- Next.js structure explanation
- Key concepts (App Router, Server/Client Components, API Routes)
- Common patterns and recipes
- Debugging tips

**Use for**: Brief Claude/Codex/Gemini on project structure

---

### 5. Documentation

#### Testing
**File**: `TESTING_STRATEGY.md`

- Unit tests (Jest + React Testing Library)
- Integration tests
- E2E tests (Playwright)
- Coverage targets
- Mocking patterns

#### Error Handling
**File**: `ERROR_HANDLING.md`

- Standard API response format
- HTTP status codes
- Application error codes
- Client-side error boundaries
- Logging patterns

#### Debugging
**File**: `DEBUGGING.md`

- Common issues and fixes
- Hydration mismatches
- Database connection problems
- Authentication issues
- Performance bottlenecks

#### Performance
**File**: `PERFORMANCE.md`

- Core Web Vitals (LCP, FID, CLS)
- Image optimization
- Code splitting
- Database query optimization
- Caching strategies

#### Issues & PRs
**File**: `ISSUE_GUIDELINES.md`

- Issue workflow
- Status labels
- Priority system
- Writing good issues

#### Branch Protection
**File**: `BRANCH_PROTECTION.md`

- GitHub setup instructions
- Enforce review process
- Status checks
- Testing procedures

---

## Quick Start

### Option 1: Use Bootstrap Script
```bash
cd /home/datament/templates/vibe-coding
./setup-vibe-coding.sh my-next-app
cd my-next-app

# Edit configurations
nano .github/CODEOWNERS
nano AI_BRIEFING.md

# Initialize repo
git commit -m "Add vibe-coding baseline"
```

### Option 2: Manual Copy
```bash
mkdir my-next-app
cd my-next-app
cp -r /home/datament/templates/vibe-coding/.github .
cp /home/datament/templates/vibe-coding/.* .
cp /home/datament/templates/vibe-coding/*.md .
cp /home/datament/templates/vibe-coding/*.yml .
cp /home/datament/templates/vibe-coding/{Dockerfile,docker-compose.yml} .

# Initialize project structure
mkdir -p src/{components,hooks,lib,types,styles}
mkdir -p __tests__/{unit,integration,e2e}
mkdir -p prisma

# Create files
echo "# My Project" > README.md
npx create-next-app@latest --ts --tailwind

git init
git add .
git commit -m "Add vibe-coding baseline"
```

---

## Setup Checklist

### Before Starting
- [ ] Node 18+ installed
- [ ] Docker installed
- [ ] Git configured

### After Creating Project
1. **Customize** (2 min)
   - [ ] Edit `.github/CODEOWNERS` (add team usernames)
   - [ ] Update `.env.example` (add your vars)
   - [ ] Review `AI_BRIEFING.md` (update as needed)

2. **Setup Local Dev** (3 min)
   - [ ] `cp .env.example .env.local`
   - [ ] `docker-compose up -d`
   - [ ] `docker-compose exec app npx prisma migrate dev`
   - [ ] Open http://localhost:3000

3. **Verify Everything Works** (5 min)
   - [ ] `docker-compose exec app npm run lint`
   - [ ] `docker-compose exec app npm test`
   - [ ] `docker-compose exec app npm run build`

4. **Enable in GitHub** (5 min)
   - [ ] Push `.github/` files
   - [ ] Enable branch protection on `main`
   - [ ] Create labels (see below)
   - [ ] Configure status checks: `validate-labels`

---

## Label Schema (Create in GitHub)

### Status (ONE per issue)
- `1-open` — New, not started
- `2-in-progress` — Work in progress
- `3-in-testing` — Code done, testing
- `4-review` — Awaiting code review
- `5-ready` — Ready to merge
- `status-closed` — Complete/won't-fix

### Type
- `type-bug` — Bug fix
- `type-feature` — New feature
- `type-enhancement` — Improvement
- `type-docs` — Documentation
- `type-test` — Testing/CI

### Priority
- `priority-critical` — Blocks release
- `priority-high` — This sprint
- `priority-medium` — Standard (default)
- `priority-low` — Deferrable

---

## Essential Commands

```bash
# Development
npm run dev           # Start dev server (localhost:3000)
npm run lint          # Check code quality
npm run format        # Auto-format code
npm test              # Run tests
npm run test:watch    # Watch tests

# Database
npx prisma migrate dev                # Create migration
npx prisma studio                    # Browse database (http://5555)
npx prisma migrate reset              # Reset database (destructive!)

# Docker
docker-compose up -d                  # Start services
docker-compose down                   # Stop services
docker-compose logs -f app            # View logs
docker-compose exec app npm run lint  # Run command in container

# Production
npm run build          # Build for production
npm run start          # Start production server
```

---

## Project Structure

```
my-next-app/
├── .github/                   # GitHub workflows & templates
│   ├── workflows/
│   │   ├── validate-labels.yml
│   │   ├── auto-release.yml
│   │   └── README.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   ├── enhancement.md
│   │   ├── task.md
│   │   └── config.yml
│   ├── CODEOWNERS
│   └── pull_request_template.md
│
├── app/                       # Next.js App Router
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── api/                   # API routes
│   │   └── users/route.ts
│   └── error.tsx              # Error boundary
│
├── src/
│   ├── components/            # Reusable components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useFetch.ts
│   ├── lib/                   # Utilities
│   │   ├── db.ts              # Database client
│   │   ├── api.ts             # HTTP client
│   │   ├── errors.ts          # Error handling
│   │   └── logger.ts          # Logging
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   └── styles/                # CSS
│       └── globals.css
│
├── __tests__/                 # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── prisma/                    # Database
│   └── schema.prisma
│
├── public/                    # Static files
│
├── .github/                   # GitHub config
├── docker-compose.yml         # Local dev services
├── Dockerfile                 # App container
├── .env.example               # Environment template
├── .eslintrc.json            # Linting rules
├── .prettierrc                # Formatting
├── .pre-commit-config.yaml   # Git hooks
├── tsconfig.json             # TypeScript config
├── next.config.js            # Next.js config
├── jest.config.js            # Test config
├── package.json
├── package-lock.json
│
├── AI_BRIEFING.md            # For AI assistance
├── LOCAL_SETUP.md            # Quick start
├── TESTING_STRATEGY.md        # Testing guide
├── ERROR_HANDLING.md          # Error patterns
├── DEBUGGING.md               # Common issues
├── PERFORMANCE.md             # Optimization
├── ISSUE_GUIDELINES.md        # Issue workflow
├── BRANCH_PROTECTION.md       # GitHub setup
└── README.md                  # Project docs
```

---

## For AI-Assisted Development

### Briefing Claude/Codex/Gemini

When asking AI to work on the project:

1. **Provide context**:
   ```
   "Add feature X to my Next.js app. Use the structure in AI_BRIEFING.md.
   Stack: TypeScript, Tailwind, Prisma. Database: PostgreSQL.
   Tests: Jest + React Testing Library.
   Error format: See ERROR_HANDLING.md"
   ```

2. **AI understands**:
   - ✅ Project structure from `AI_BRIEFING.md`
   - ✅ Testing approach from `TESTING_STRATEGY.md`
   - ✅ Error handling from `ERROR_HANDLING.md`
   - ✅ Git workflow from `ISSUE_GUIDELINES.md`

3. **AI delivers**:
   - ✅ Properly structured components
   - ✅ Tests included
   - ✅ Consistent error handling
   - ✅ Follows team conventions

---

## Customization Guide

### For Your Team

1. **CODEOWNERS** — Add your team members
2. **AI_BRIEFING.md** — Update specific conventions
3. **ISSUE_GUIDELINES.md** — Team practices
4. **TESTING_STRATEGY.md** — Coverage targets
5. **ERROR_HANDLING.md** — Error code definitions
6. **.eslintrc.json** — Additional rules
7. **.pre-commit-config.yaml** — Extra checks

### For Your Tech Stack

If using different databases:
- **PostgreSQL**: Use provided Prisma schema
- **MySQL**: Change `provider` in `prisma/schema.prisma`
- **MongoDB**: Change to `mongodb` provider
- **DynamoDB**: Different client, not Prisma

If using different auth:
- **NextAuth.js**: Integrated easily
- **Clerk**: Change auth patterns
- **Auth0**: API route adapters
- **Custom JWT**: See `ERROR_HANDLING.md` examples

---

## Maintenance

### Keep Up to Date

```bash
# Update dependencies
npm update

# Security audit
npm audit fix

# Check for outdated packages
npm outdated

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

### Regular Checks

- [ ] Run `npm audit` monthly
- [ ] Update dependencies quarterly
- [ ] Review test coverage
- [ ] Check bundle size
- [ ] Profile performance

---

## Troubleshooting

**Container won't start?**
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

**Linting fails?**
```bash
npm run format  # Auto-fix code
npm run lint    # Check again
```

**Tests fail?**
```bash
npm test -- --verbose
npm test -- --testNamePattern="specific-test"
```

See `DEBUGGING.md` for more issues.

---

## Files Reference

| File | Purpose |
|------|---------|
| `AI_BRIEFING.md` | Next.js structure for AI tools |
| `LOCAL_SETUP.md` | 5-minute quick start |
| `TESTING_STRATEGY.md` | Testing patterns & config |
| `ERROR_HANDLING.md` | API responses & error codes |
| `DEBUGGING.md` | Common issues & fixes |
| `PERFORMANCE.md` | Optimization strategies |
| `ISSUE_GUIDELINES.md` | Issue workflow & labels |
| `BRANCH_PROTECTION.md` | GitHub setup instructions |
| `.github/workflows/` | Automated checks & releases |
| `docker-compose.yml` | Local dev environment |
| `.eslintrc.json` | Code quality rules |
| `.pre-commit-config.yaml` | Git hooks |

---

## Related Links

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Version**: 2026-06-17  
**For**: Next.js 14+, TypeScript, Docker  
**Use**: Template for new vibe-coding projects  
**Maintained by**: Development Team
