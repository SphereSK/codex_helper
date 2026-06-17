# Vibe-Coding Baseline 🚀

Production-ready **Next.js + TypeScript** baseline with **better-auth**, middleware, testing, and full deployment setup.

**65 files • 432 KB • Zero to shipping in 5 minutes**

[![GitHub](https://img.shields.io/badge/GitHub-vibe--coding-blue?logo=github)](https://github.com/your-org/vibe-coding-baseline)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](./COMPLETE.md)

---

## 🎯 What This Is

A **complete, production-ready baseline** for Next.js projects. Copy it, customize it, ship it.

Includes everything you need:
- ✅ Frontend (Next.js + React + TypeScript + Tailwind)
- ✅ Backend (API Routes + Better Auth)
- ✅ Database (PostgreSQL + Prisma)
- ✅ Middleware (Auth, Rate Limit, Logging, CORS, Errors)
- ✅ Testing (Jest + Playwright)
- ✅ DevOps (PM2 + Docker)
- ✅ Workflows (GitHub Actions)
- ✅ Documentation (18+ guides)

**No boilerplate. No cruft. Everything you actually need.**

---

## 📦 Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | Next.js 14+ • React 18+ • TypeScript • Tailwind • Radix UI |
| **Backend** | Node.js • Express/API Routes • Better Auth |
| **Data** | PostgreSQL 15 • Prisma ORM |
| **Cache** | Redis 7 • ioredis |
| **Testing** | Jest • Playwright • React Testing Library |
| **DevOps** | PM2 • Docker • GitHub Actions |
| **Security** | JWT • bcryptjs • Rate Limiting • Security Headers |

---

## 🚀 Quick Start

### 1. Create Project
```bash
# Clone or download this baseline
git clone https://github.com/your-org/vibe-coding-baseline.git my-app
cd my-app

# Or use the setup script
./setup-vibe-coding.sh my-app
cd my-app
```

### 2. Setup Environment
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values (database, secrets, etc)
nano .env.local
```

### 3. Install & Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or with Docker: docker-compose up -d && npm run dev

# Open browser
open http://localhost:3000
```

**That's it!** You're ready to develop.

---

## 📚 Documentation

| Document | What It Covers |
|----------|---|
| **[NEXTJS_BASELINE.md](./NEXTJS_BASELINE.md)** | Complete feature overview |
| **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** | 5-minute quick start guide |
| **[USAGE.md](./USAGE.md)** | How to use and customize |
| **[AI_BRIEFING.md](./AI_BRIEFING.md)** | Brief Claude/Codex on structure |
| **[MIDDLEWARE.md](./MIDDLEWARE.md)** | Auth, rate limiting, logging |
| **[TESTING_STRATEGY.md](./TESTING_STRATEGY.md)** | Jest, Playwright, RTL |
| **[ERROR_HANDLING.md](./ERROR_HANDLING.md)** | Standard error responses |
| **[DEBUGGING.md](./DEBUGGING.md)** | Common issues & fixes |
| **[PERFORMANCE.md](./PERFORMANCE.md)** | Optimization guide |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Docker & PM2 deployment |
| **[HEALTH_CHECKS.md](./HEALTH_CHECKS.md)** | Monitoring & observability |
| **[VERSIONING.md](./VERSIONING.md)** | SemVer & release process |
| **[PRISMA_MIGRATIONS.md](./PRISMA_MIGRATIONS.md)** | Database migrations |
| **[ISSUE_GUIDELINES.md](./ISSUE_GUIDELINES.md)** | Issue workflow & labels |
| **[BRANCH_PROTECTION.md](./BRANCH_PROTECTION.md)** | GitHub branch setup |
| **[ADR-TEMPLATE.md](./ADR-TEMPLATE.md)** | Architecture decisions |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | How to contribute |
| **[SECURITY.md](./SECURITY.md)** | Security policy |

**👉 Start here:** [LOCAL_SETUP.md](./LOCAL_SETUP.md)

---

## 📁 Project Structure

```
my-app/
├── app/                    # Next.js App Router
│   ├── middleware.ts      # Global security headers
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── api/               # API routes
│       ├── auth/
│       └── health/
├── src/
│   ├── components/        # React components
│   ├── hooks/            # Custom hooks (useAuth)
│   ├── lib/              # Utilities
│   │   ├── db.ts         # Prisma client
│   │   ├── redis.ts      # Redis client
│   │   ├── auth.ts       # Auth helpers
│   │   └── fetch.ts      # HTTP client
│   ├── types/            # TypeScript interfaces
│   ├── middleware/       # Reusable middleware
│   │   ├── auth.ts       # JWT verification
│   │   ├── rateLimit.ts  # Rate limiting
│   │   ├── logging.ts    # Request logging
│   │   ├── cors.ts       # CORS headers
│   │   └── errors.ts     # Error handling
│   └── styles/           # Global CSS
├── .github/
│   ├── workflows/        # GitHub Actions
│   ├── ISSUE_TEMPLATE/   # Issue templates
│   └── CODEOWNERS        # Auto-assign reviewers
├── __tests__/            # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database changes
├── .env.example          # Environment template
├── .eslintrc.json        # Linting rules
├── .prettierrc            # Code formatting
├── tsconfig.json         # TypeScript config
├── jest.config.js        # Test config
├── playwright.config.ts  # E2E config
├── next.config.js        # Next.js config
├── package.json          # Dependencies
├── ecosystem.config.js   # PM2 configuration
├── docker-compose.yml    # Services
└── Makefile              # Common commands
```

---

## 🔥 Key Features

### 🔐 Authentication
```ts
import { requireAuth } from '@/middleware/auth'

export const GET = requireAuth(async (request, user) => {
  return Response.json({ user })
})
```

### 🚦 Rate Limiting
```ts
import { withRateLimit } from '@/middleware/rateLimit'

export const POST = withRateLimit(handler, { points: 5, duration: 60 })
```

### 📝 Request Logging
```ts
import { withLogging } from '@/middleware/logging'

export const GET = withLogging(handler)
// Logs: timestamp, method, path, status, duration
```

### ❌ Error Handling
```ts
import { ValidationError, withErrorHandling } from '@/middleware/errors'

export const POST = withErrorHandling(async (request) => {
  throw new ValidationError('Email required')
})
```

### 🧪 Testing
```ts
// Jest unit test
import { render, screen } from '@testing-library/react'
import Button from '@/components/Button'

it('renders button', () => {
  render(<Button>Click</Button>)
  expect(screen.getByRole('button')).toBeInTheDocument()
})

// Playwright E2E test
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=email]', 'test@example.com')
  await page.click('button[type=submit]')
  await expect(page).toHaveURL('/dashboard')
})
```

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm test                # Run tests
npm run test:watch      # Watch tests
npm run lint            # Check code quality
npm run format          # Auto-format code

# Database
npm run db:migrate      # Create migration
npm run db:seed        # Seed data
npm run db:studio      # Open Prisma Studio
npm run db:reset       # Reset database

# Docker
docker-compose up -d   # Start services
docker-compose down    # Stop services
docker-compose logs    # View logs

# Build & Deploy
npm run build          # Build for production
npm start              # Start production server
pm2 start ecosystem.config.js

# See Makefile for more
make help
```

---

## 🎯 Workflow Example

```bash
# 1. Create issue
# GitHub → New Issue → Select "Feature Request"

# 2. Create branch
git checkout -b feature/my-feature

# 3. Make changes
# - Edit code
# - Write tests
# - Update types

# 4. Pre-commit hook runs automatically
# - ESLint fixes code
# - Prettier formats
# - TypeScript type-check
# - Tests run

# 5. Commit
git commit -m "feat: add user authentication"

# 6. Push & create PR
git push origin feature/my-feature
# GitHub → New Pull Request

# 7. GitHub Actions validate
# - Labels checked
# - Tests run
# - Type checking passes

# 8. Code review & merge
# - Team reviews
# - Approves
# - Merges PR

# 9. Auto-release (on version bump)
# - GitHub Action triggers
# - Creates git tag
# - Creates GitHub release
```

---

## 🚀 Deployment Options

### Option 1: PM2 (Recommended for VPS)
```bash
npm run build
pm2 start ecosystem.config.js --env production
```

See: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Option 2: Docker (For containers)
```bash
docker build -t my-app .
docker run -d -p 3000:3000 my-app
```

### Option 3: Vercel (For ease)
```bash
# Push to GitHub
# Vercel auto-deploys
```

---

## ✅ What's Included

- ✅ **65 files** with everything you need
- ✅ **18+ documentation** guides
- ✅ **GitHub workflows** (label validation, auto-release)
- ✅ **Issue templates** (bug, feature, enhancement, task)
- ✅ **Middleware** (auth, rate limit, logging, cors, errors)
- ✅ **Database** (Prisma + migrations + seeding)
- ✅ **Testing** (Jest + Playwright)
- ✅ **Type safety** (TypeScript strict mode)
- ✅ **Code quality** (ESLint + Prettier)
- ✅ **Git hooks** (pre-commit validation)
- ✅ **PM2 config** (process management)
- ✅ **Docker setup** (optional)
- ✅ **Health checks** (monitoring)
- ✅ **Security** (headers, rate limiting, validation)
- ✅ **Contributing guide**
- ✅ **Security policy**

---

## 🆘 Getting Help

### Stuck?
1. **Check docs** — Most answers are in [NEXTJS_BASELINE.md](./NEXTJS_BASELINE.md) or [DEBUGGING.md](./DEBUGGING.md)
2. **Search guide** — Relevant guide in the documentation index above
3. **GitHub Issues** — Ask community or open a new issue

### Common Issues?
- **App won't start?** → [LOCAL_SETUP.md](./LOCAL_SETUP.md)
- **Tests failing?** → [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- **Database error?** → [PRISMA_MIGRATIONS.md](./PRISMA_MIGRATIONS.md)
- **Deployment issue?** → [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Security concern?** → [SECURITY.md](./SECURITY.md)

---

## 📝 License

MIT License — See [LICENSE](./LICENSE) file

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Development setup
- Code style guidelines
- Testing requirements
- PR process

---

## 📊 Stats

| Metric | Value |
|--------|-------|
| Files | 65 |
| Size | 432 KB |
| Documentation | 18+ guides |
| Middleware modules | 6 |
| GitHub workflows | 2 |
| Time to first deploy | 5 min |
| Setup time | 2 min |

---

## 🎓 Learn More

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Better Auth**: https://better-auth.js.org
- **TypeScript**: https://www.typescriptlang.org/docs
- **Testing Library**: https://testing-library.com

---

## 📢 Feedback

Found a bug? Want to improve? Open an issue or PR!

---

**Made with ❤️ for teams building with Next.js**

**Status:** ✅ Production Ready | **Last Updated:** 2026-06-17 | **Version:** 1.0.0
