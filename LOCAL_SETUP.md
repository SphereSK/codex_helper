# Local Development Setup — Next.js + Docker

Get project running locally in <5 minutes.

---

## Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development without Docker)
- Git

---

## Quick Start (Docker)

### 1. Clone & Setup
```bash
git clone <repo-url>
cd my-app
cp .env.example .env.local
```

### 2. Start Services
```bash
docker-compose up -d
```

This starts:
- **Next.js dev server** — http://localhost:3000
- **PostgreSQL database** — localhost:5432 (if using database)
- **Redis cache** — localhost:6379 (if using cache)

### 3. Run Migrations (if using Prisma)
```bash
docker-compose exec app npx prisma migrate dev
```

### 4. Seed Data (optional)
```bash
docker-compose exec app npm run seed
```

---

## Local Development Commands

```bash
# Start dev server (with Docker)
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f app

# Run command in container
docker-compose exec app npm run lint

# Open database shell
docker-compose exec db psql -U postgres -d app_dev

# Clear Docker volumes (clean slate)
docker-compose down -v
```

---

## Environment Setup

### .env.local (git-ignored)
Copy from `.env.example` and customize:

```bash
# Copy template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

### Key Variables
```
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/app_dev
NEXTAUTH_SECRET=your-secret-key-here
NODE_ENV=development
```

**⚠️ Important:**
- `.env.local` is git-ignored (never commit secrets)
- Prefix public vars with `NEXT_PUBLIC_`
- Never hardcode secrets in code

---

## Docker Compose Services

See `docker-compose.yml`:

### App Service
- Runs Next.js dev server
- Mounts code volume (hot reload)
- Exposes port 3000

### Database (optional)
- PostgreSQL 15
- Persistent volume
- Accessible on localhost:5432

### Redis (optional)
- Caching layer
- Accessible on localhost:6379

---

## Without Docker (Local Node)

If you prefer running locally without Docker:

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup (if using Prisma)
```bash
# Ensure PostgreSQL is running
# Update DATABASE_URL in .env.local

npx prisma migrate dev
npx prisma db seed
```

### 3. Start Dev Server
```bash
npm run dev
```

Server runs at http://localhost:3000

### 4. Development Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm test             # Run tests
npm run test:watch   # Watch tests
```

---

## Database (Prisma)

### Schema
```
prisma/schema.prisma — Define models, relationships
```

### Migrations
```bash
# Create migration (after schema change)
npx prisma migrate dev --name add_user_model

# View migrations
ls prisma/migrations/

# Reset database (DESTRUCTIVE)
npx prisma migrate reset
```

### Database Studio (Prisma)
```bash
npx prisma studio
# Opens http://localhost:5555 — browse/edit database
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Docker Container Won't Start
```bash
# Check logs
docker-compose logs app

# Rebuild image
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Database Connection Error
```bash
# Verify services are running
docker-compose ps

# Check DATABASE_URL in .env.local
# Format: postgresql://user:password@host:port/database

# Test connection
docker-compose exec db psql -U postgres -d app_dev
```

### Node Modules Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# With Docker
docker-compose exec app npm install
```

### Hot Reload Not Working
- Kill dev server: `Ctrl+C`
- Restart: `npm run dev` or `docker-compose up`
- Check that files are saved

---

## IDE Setup

### VS Code
1. Install extensions:
   - **ES7+ React/Redux/React-Native snippets**
   - **Prettier**
   - **ESLint**
   - **Thunder Client** (API testing)

2. Settings (`.vscode/settings.json`):
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### TypeScript
- IntelliSense works automatically
- Type errors show in editor
- `npm run lint` for full check

---

## Git Hooks

Pre-commit hooks run automatically:
```bash
# Hooks installed by husky/.pre-commit-config.yaml
# On commit:
# ✓ Prettier formats code
# ✓ ESLint checks syntax
# ✓ TypeScript type check
# ✓ Tests run (optional)

# If check fails, commit is blocked
# Fix issues and try again
```

---

## Performance Tips

### Build Times
```bash
# Full rebuild is slow. Use:
npm run dev  # Fast incremental builds
npm run build  # Full production build (for CI)
```

### Database Performance
```bash
# Create indexes for queries
prisma/schema.prisma:
model Post {
  id Int @id @default(autoincrement())
  title String
  createdAt DateTime @default(now())
  
  @@index([createdAt])  // Speed up date queries
}

npx prisma migrate dev --name add_indexes
```

---

## First Time Setup Checklist

- [ ] Clone repository
- [ ] Copy `.env.example` → `.env.local`
- [ ] Start Docker: `docker-compose up -d`
- [ ] Run migrations: `docker-compose exec app npx prisma migrate dev`
- [ ] Check app: http://localhost:3000
- [ ] Tests pass: `docker-compose exec app npm test`
- [ ] ESLint passes: `docker-compose exec app npm run lint`

---

**Last Updated**: 2026-06-17  
**Stack**: Next.js 14+, TypeScript, Docker, PostgreSQL, Prisma
