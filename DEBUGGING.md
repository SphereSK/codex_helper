# Debugging — Next.js Common Issues

Quick reference for diagnosing and fixing problems.

---

## Development Server Issues

### Server Won't Start
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Fix:**
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Hot Reload Not Working
Code changes don't reflect in browser.

**Checklist:**
- [ ] File is saved (check editor)
- [ ] Correct file path matches route
- [ ] No syntax errors (check terminal)
- [ ] Browser cache cleared (Cmd+Shift+R or Ctrl+Shift+R)
- [ ] Dev server restarted

**Fix:**
```bash
# Stop server
Ctrl+C

# Clear cache
rm -rf .next

# Restart
npm run dev
```

---

## Build Issues

### Build Fails Silently
```
> next build
# Hangs or exits without error
```

**Checklist:**
- [ ] Disk space available
- [ ] Node version correct (18+)
- [ ] No circular imports
- [ ] All imports resolvable

**Fix:**
```bash
# Verbose output
npm run build -- --debug

# Check for circular imports
npm install --save-dev circular-dependency-plugin
```

### "Module not found" Error
```
Error: Cannot find module '@/components/Button'
```

**Fix:**
- Check `tsconfig.json` paths are correct
- Verify file exists: `src/components/Button.tsx`
- Check spelling and case (case-sensitive!)
- Restart dev server

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Runtime Errors

### Hydration Mismatch
```
Error: Text content mismatch. Server: "Mon Jun 17" Client: "Tue Jun 18"
```

**Cause:** Server renders different HTML than client.

**Common culprits:**
- Date formatting (server date ≠ client date)
- Random values
- Conditional rendering based on browser features

**Fix:**
```tsx
// ❌ Bad — random each render
<div>{Math.random()}</div>

// ✅ Good — same on server and client
<div>{getRandomValue(seed)}</div>

// ❌ Bad — different on server/client
<div>{new Date().toLocaleDateString()}</div>

// ✅ Good — pass from server
export default async function Page({ date }) {
  return <div>{formatDate(date)}</div>
}
```

### "Cannot read property of undefined"
```
TypeError: Cannot read property 'name' of undefined
```

**Checklist:**
- [ ] Variable is initialized before use
- [ ] Async data loaded before rendering
- [ ] Default value provided (?.  operator)

**Fix:**
```tsx
// ❌ Bad
function UserCard({ user }) {
  return <div>{user.name}</div>
}

// ✅ Good
function UserCard({ user }) {
  if (!user) return <div>Loading...</div>
  return <div>{user.name}</div>
}

// ✅ Also good
function UserCard({ user }) {
  return <div>{user?.name ?? 'Unknown'}</div>
}
```

### "useXyz is not a function"
```
TypeError: useRouter is not a function
```

**Fix:**
```tsx
// ✅ Correct: must be in client component
'use client'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  // ...
}

// ❌ Wrong: missing 'use client'
import { useRouter } from 'next/navigation'
export default function Page() {
  const router = useRouter() // Error!
}
```

---

## API Route Issues

### API Route Returns 404
```
GET /api/users → 404 Not Found
```

**Checklist:**
- [ ] File exists: `app/api/users/route.ts`
- [ ] Export function: `export async function GET()`
- [ ] Correct path: `/api/users` matches `app/api/users/route.ts`
- [ ] Dev server restarted

**Fix:**
```ts
// app/api/users/route.ts
export async function GET(request: Request) {
  return Response.json({ users: [] })
}
```

### API Route Hangs
Request doesn't complete, browser shows loading.

**Checklist:**
- [ ] Function is `async`
- [ ] `Response.json()` is called
- [ ] No infinite loops
- [ ] Database connection established

**Debug:**
```ts
export async function POST(request: Request) {
  console.log('POST /api/users', new Date())
  
  try {
    const body = await request.json()
    console.log('Body received:', body)
    
    const user = await db.users.create({ data: body })
    console.log('User created:', user)
    
    return Response.json(user)
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
```

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```

**For local dev (API on same origin):**
- Should not happen if API on `localhost:3000`

**For external API:**
```ts
// app/api/proxy/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  
  // Call external API from server (no CORS)
  const response = await fetch('https://api.example.com/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  
  return response
}
```

---

## Database Issues

### Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Checklist:**
- [ ] Database running: `docker-compose ps`
- [ ] `DATABASE_URL` correct in `.env.local`
- [ ] Network/firewall not blocking
- [ ] Port not changed

**Fix:**
```bash
# Start database
docker-compose up -d db

# Test connection
docker-compose exec db psql -U postgres -d app_dev

# Check connection string
echo $DATABASE_URL
```

### Migration Failed
```
Error: Migration M20240617... failed
```

**Fix:**
```bash
# Reset database (loses all data!)
npx prisma migrate reset

# Or rollback to specific migration
npx prisma migrate resolve --rolled-back <migration_name>

# Then retry
npx prisma migrate dev
```

### Slow Queries
Page loads slowly, database CPU high.

**Debug:**
```ts
// Enable query logging
// .env.local
DEBUG=prisma:*

// Or use Prisma Studio
npx prisma studio
# Opens http://localhost:5555
```

**Fix:**
```prisma
// prisma/schema.prisma
model Post {
  id    Int     @id @default(autoincrement())
  title String
  
  // Add index for frequently queried columns
  @@index([title])
}

npx prisma migrate dev --name add_indexes
```

---

## Authentication Issues

### "Unauthorized" on Protected Routes
```
401 Unauthorized
```

**Checklist:**
- [ ] Token sent in request
- [ ] Token not expired
- [ ] Token validation logic correct
- [ ] Secrets match (dev ≠ prod)

**Debug:**
```ts
export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  console.log('Token:', token)
  
  if (!token) {
    return Response.json({ error: 'No token' }, { status: 401 })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Decoded:', decoded)
    return Response.json({ user: decoded })
  } catch (error) {
    console.error('Token validation failed:', error)
    return Response.json({ error: 'Invalid token' }, { status: 401 })
  }
}
```

### Session Lost After Refresh
Logged in, refresh page, logged out.

**Checklist:**
- [ ] Cookie is httpOnly (secure)
- [ ] Cookie has max-age or expires
- [ ] Domain/path match
- [ ] Same-site policy correct

**Fix:**
```ts
// Set secure session cookie
response.cookies.set('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
})
```

---

## Performance Issues

### Slow Page Load
```
First Contentful Paint: 3.2s
```

**Debug with DevTools:**
1. Open DevTools → Performance tab
2. Record page load
3. Check: Network, rendering, scripting

**Common causes:**
- Large bundle size
- Slow API calls
- Unoptimized images
- Missing code splitting

**Fix:**
```tsx
// Lazy load heavy component
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('@/components/Chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Only load in browser
})

export default function Page() {
  return <Chart /> // Doesn't block initial load
}
```

### High CPU Usage
Server CPU at 100%, slow response times.

**Checklist:**
- [ ] Infinite loops in code
- [ ] Inefficient queries (N+1)
- [ ] Memory leak in long-running process
- [ ] Too many concurrent requests

**Debug:**
```bash
# Monitor process
top -p <pid>

# Check logs for errors
docker-compose logs -f app

# Profile in Node
node --prof app.js
node --prof-process isolate-*.log > profile.txt
```

---

## Testing Issues

### Test Timeout
```
FAIL  Timeout - Async callback was not invoked within timeout
```

**Checklist:**
- [ ] Async/await used
- [ ] Mock responses configured
- [ ] No actual API calls
- [ ] Proper cleanup

**Fix:**
```ts
// Mock API
jest.mock('@/lib/api')
const { fetchData } = require('@/lib/api')

it('loads data', async () => {
  fetchData.mockResolvedValue({ id: 1 })
  
  render(<Component />)
  await waitFor(() => {
    expect(screen.getByText('loaded')).toBeInTheDocument()
  })
})
```

### "act()" Warning
```
Warning: useLayoutEffect does nothing on the server
```

Typically harmless in tests, but indicates timing issue.

**Fix:**
```tsx
// Wrap state updates in act()
import { act } from '@testing-library/react'

await act(async () => {
  fireEvent.click(button)
})
```

---

## Docker Issues

### Container Won't Start
```
docker-compose up
# Exits immediately
```

**Fix:**
```bash
# Check logs
docker-compose logs app

# Rebuild
docker-compose build --no-cache

# Try again
docker-compose up
```

### Volume Not Syncing (Mac/Windows)
Code changes on host, not reflected in container.

**Fix:**
Edit `docker-compose.yml`:
```yaml
services:
  app:
    volumes:
      - .:/app
      - /app/node_modules # Exclude node_modules
```

Then:
```bash
docker-compose restart
```

---

## Browser DevTools

### Check Network Requests
1. DevTools → Network tab
2. Reload page
3. Look for red (failed) or slow requests
4. Click request → check Response tab

### Check Browser Console
1. DevTools → Console tab
2. Look for red errors
3. Click error → check stack trace
4. Correlate with source code

### React DevTools
1. Install React DevTools extension
2. DevTools → Components tab
3. Inspect component tree
4. Check props and state

---

## Getting Help

**First steps:**
1. Check error message carefully
2. Search repo for similar issues
3. Check GitHub issues / StackOverflow
4. Enable debug logging

**Debug output:**
```bash
npm run dev 2>&1 | tee debug.log
# Share relevant lines from debug.log
```

**Ask for help with:**
- Full error message (not screenshot)
- Steps to reproduce
- What you've tried
- Relevant code snippet (not whole file)

---

**Last Updated**: 2026-06-17  
**For**: Next.js 13+, TypeScript, Docker
