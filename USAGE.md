# How to Use Vibe-Coding Baseline

Quick guide for developers using this template.

---

## For New Projects

### Step 1: Create Project
```bash
# Option A: Use setup script (recommended)
./setup-vibe-coding.sh my-project
cd my-project

# Option B: Clone manually
git clone https://github.com/your-org/vibe-coding-baseline.git my-project
cd my-project
```

### Step 2: Setup Environment
```bash
# Copy template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start Development
```bash
# Option A: With Docker
docker-compose up -d
npm run dev

# Option B: Local Node
npm run dev
```

### Step 5: Check It Works
```bash
# Open browser
open http://localhost:3000

# Run tests
npm test

# Check health
curl http://localhost:3000/api/health
```

---

## File Organization

### Modify These
```
├── app/
│   ├── page.tsx              ← Your pages
│   ├── layout.tsx            ← Customize layout
│   └── api/                  ← Your API routes
│
├── src/
│   ├── components/           ← Add your components
│   ├── types/               ← Define your types
│   └── lib/                 ← Add utilities
│
├── prisma/
│   ├── schema.prisma        ← Define models
│   └── seed.ts              ← Seed data
│
└── __tests__/               ← Write tests
```

### Don't Modify (Usually)
```
├── .github/                 ← Workflows/templates (until customized)
├── src/middleware/          ← Unless extending
├── .eslintrc.json          ← Unless adding rules
├── jest.config.js          ← Unless changing test setup
└── tsconfig.json           ← Unless changing paths
```

---

## Customization Checklist

### GitHub Setup
- [ ] Update `.github/CODEOWNERS` (add team members)
- [ ] Update `.github/ISSUE_TEMPLATE/config.yml` (your repo URL)
- [ ] Enable branch protection (see [BRANCH_PROTECTION.md](./BRANCH_PROTECTION.md))

### Environment
- [ ] Copy `.env.example` → `.env.local`
- [ ] Add your secrets and API keys
- [ ] Add `.env.production` for production values

### Database
- [ ] Define models in `prisma/schema.prisma`
- [ ] Run `npm run db:migrate`
- [ ] Add seed data in `prisma/seed.ts`
- [ ] Run `npm run db:seed`

### Code
- [ ] Update `package.json` name and description
- [ ] Create `src/types/` for your domain types
- [ ] Add components in `src/components/`
- [ ] Create API routes in `app/api/`

### Documentation
- [ ] Update this README for your project
- [ ] Update [AI_BRIEFING.md](./AI_BRIEFING.md) with your structure
- [ ] Document decisions in [ADR-TEMPLATE.md](./ADR-TEMPLATE.md)

### Deployment
- [ ] Configure `ecosystem.config.js` for PM2
- [ ] Or configure Docker for your platform
- [ ] Setup environment variables on production
- [ ] Enable health checks on load balancer

---

## Common Tasks

### Add a New API Endpoint

1. Create file: `app/api/posts/route.ts`
2. Use middleware:
   ```ts
   import { requireAuth } from '@/middleware/auth'
   import { withRateLimit } from '@/middleware/rateLimit'
   import { withErrorHandling } from '@/middleware/errors'

   const handler = async (request, user) => {
     // Your logic
     return Response.json({ posts: [] })
   }

   export const GET = requireAuth(
     withRateLimit(
       withErrorHandling(handler)
     )
   )
   ```

### Add a New Database Model

1. Edit `prisma/schema.prisma`:
   ```prisma
   model Post {
     id    Int     @id @default(autoincrement())
     title String
     authorId Int
     author User @relation(fields: [authorId], references: [id])
   }
   ```

2. Create migration:
   ```bash
   npm run db:migrate
   ```

3. Test it:
   ```bash
   npm run db:studio  # Browse in GUI
   ```

### Add Tests

1. Create `__tests__/Button.test.tsx`:
   ```tsx
   import { render, screen } from '@testing-library/react'
   import Button from '@/components/Button'

   it('renders button', () => {
     render(<Button>Click</Button>)
     expect(screen.getByRole('button')).toBeInTheDocument()
   })
   ```

2. Run tests:
   ```bash
   npm test
   npm test -- --watch
   ```

### Deploy to Production

1. Build:
   ```bash
   npm run build
   ```

2. Start with PM2:
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

3. Or with Docker:
   ```bash
   docker build -t my-app .
   docker run -d -p 3000:3000 my-app
   ```

---

## Key Patterns

### Use the Auth Hook
```tsx
'use client'
import { useAuth } from '@/hooks/useAuth'

export default function Dashboard() {
  const { user, loading, logout } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Protect an Endpoint
```ts
// app/api/admin/users/route.ts
import { requireRole } from '@/middleware/auth'

export const GET = requireRole('admin')(async (request, user) => {
  // Only admin can access
  return Response.json({ users: [] })
})
```

### Validate Input
```ts
import { ValidationError } from '@/middleware/errors'

const handler = async (request) => {
  const { email } = await request.json()
  
  if (!email?.includes('@')) {
    throw new ValidationError('Invalid email')
  }
  
  return Response.json({ success: true })
}
```

### Rate Limit an Endpoint
```ts
import { withRateLimit } from '@/middleware/rateLimit'

// 5 login attempts per 60 seconds per IP
export const POST = withRateLimit(handler, {
  points: 5,
  duration: 60,
  keyPrefix: 'login',
})
```

---

## Debugging

### App won't start?
1. Check `.env.local` is set
2. Check database is running
3. Run: `npm run build` (catches errors)
4. See [LOCAL_SETUP.md](./LOCAL_SETUP.md)

### Tests failing?
1. Run with verbose: `npm test -- --verbose`
2. Check mocks in `jest.setup.js`
3. See [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)

### Database issues?
1. Check migrations: `npx prisma migrate status`
2. Reset if needed: `npm run db:reset` (careful!)
3. See [PRISMA_MIGRATIONS.md](./PRISMA_MIGRATIONS.md)

### Help?
1. Check [DEBUGGING.md](./DEBUGGING.md)
2. Search [LOCAL_SETUP.md](./LOCAL_SETUP.md)
3. Open GitHub issue

---

## Removing Unused Parts

### Remove Docker
If using PM2 instead:
```bash
rm Dockerfile docker-compose.yml .dockerignore
```

### Remove Testing
If you don't need E2E tests:
```bash
rm playwright.config.ts
npm uninstall @playwright/test
```

### Remove PM2
If using Docker instead:
```bash
rm ecosystem.config.js
```

### Remove Redis
If not using cache:
```bash
# Remove from .env.example
# Remove redis service from docker-compose.yml
# Remove src/lib/redis.ts
npm uninstall ioredis
```

---

## Next Steps

1. **Read:** [NEXTJS_BASELINE.md](./NEXTJS_BASELINE.md) — Full overview
2. **Setup:** [LOCAL_SETUP.md](./LOCAL_SETUP.md) — Get running
3. **Learn:** [MIDDLEWARE.md](./MIDDLEWARE.md) — How middleware works
4. **Customize:** Update for your project
5. **Deploy:** [DEPLOYMENT.md](./DEPLOYMENT.md) — Go live

---

## Tips

💡 **Use TypeScript** — Catches errors at compile time  
💡 **Run tests** — Before committing (`npm test`)  
💡 **Check logs** — Debug with `console.log()` and `npm run logs`  
💡 **Use Makefile** — Faster than typing full commands  
💡 **Read guides** — Before asking for help  

---

**Ready to build?** Start with [LOCAL_SETUP.md](./LOCAL_SETUP.md) 🚀
