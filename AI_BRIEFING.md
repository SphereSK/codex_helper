# AI Briefing Guide — Next.js Projects

Context for Claude, Codex, Gemini when working on Next.js codebases.

---

## Project Structure

```
my-app/
├── app/                      # App Router (Next.js 13+)
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── (auth)/               # Route group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── api/                  # API routes
│   │   ├── users/route.ts
│   │   └── posts/[id]/route.ts
│   └── middleware.ts         # Edge middleware
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── hooks/                # Custom React hooks
│   │   └── useAuth.ts
│   ├── lib/                  # Utilities, helpers
│   │   ├── db.ts             # Database client
│   │   ├── auth.ts           # Auth utils
│   │   └── fetch.ts          # HTTP client
│   ├── types/                # TypeScript types
│   │   ├── index.ts
│   │   └── api.ts
│   └── styles/               # Global CSS/Tailwind
│       └── globals.css
├── public/                   # Static files
├── prisma/                   # Database (if using Prisma)
│   └── schema.prisma
├── __tests__/                # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.local                # Local environment (git-ignored)
├── .env.example              # Environment template
├── next.config.js            # Next.js config
├── tsconfig.json             # TypeScript config
├── jest.config.js            # Test config
├── package.json
└── README.md
```

---

## Key Concepts for AI

### App Router (Next.js 13+)
- **File-based routing** — Folder structure = URL structure
- **app/page.tsx** = `/` route
- **app/posts/[id]/page.tsx** = `/posts/:id` route
- **app/api/users/route.ts** = `/api/users` endpoint
- **layout.tsx** = Shared layout for routes
- **Route groups** — `(auth)` folder groups routes without changing URL

### Server vs Client Components
```tsx
// Server Component (default) — runs on server
export default function Page() {
  const data = await fetch(...) // OK: direct DB access
  return <div>{data}</div>
}

// Client Component — runs in browser
'use client'
export default function Button() {
  const [count, setCount] = useState(0) // OK: hooks
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### API Routes
```ts
// app/api/users/route.ts
export async function GET(request: Request) {
  return Response.json({ users: [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ id: 1 }, { status: 201 })
}
```

### Middleware
```ts
// app/middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!request.cookies.get('auth')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}
```

### Data Fetching
```tsx
// Server Component — fetch in component
async function Posts() {
  const posts = await fetch('...', { next: { revalidate: 60 } })
  return <>{posts.map(post => ...)}</>
}

// Client Component — use hook or API
'use client'
function PostsList() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setPosts)
  }, [])
}
```

---

## Important Rules

### Type Safety
- Always use TypeScript (`*.tsx`, `*.ts`)
- Define types in `src/types/` or inline
- Use `type X = {}` or `interface X {}`

### File Naming
- Components: PascalCase (`Button.tsx`)
- Utils/hooks: camelCase (`useAuth.ts`, `formatDate.ts`)
- API routes: snake_case in URLs (`/api/create_post`)

### Styling
- Primary: Tailwind CSS (included by default)
- Alternate: CSS modules (`Button.module.css`)
- Avoid: Inline styles, global CSS in components

### Database
- Use Prisma or Drizzle (schema in `prisma/`)
- Always validate input on API routes
- Use environment variables for connection strings (`.env.local`)

### Authentication
- Store tokens in secure httpOnly cookies
- Never expose secrets in client code
- Validate tokens on every API route

---

## Development Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint + TypeScript check
npm run format       # Format code with Prettier
npm test             # Run Jest tests
npm run test:watch   # Watch tests
npm run test:coverage # Coverage report
```

---

## Common Patterns

### Protected API Route
```ts
// app/api/protected/route.ts
import { authenticate } from '@/lib/auth'
import { errorResponse } from '@/lib/errors'

export async function GET(request: Request) {
  const user = await authenticate(request)
  if (!user) return errorResponse('Unauthorized', 401)
  
  return Response.json({ data: '...' })
}
```

### Server Action (Next.js 14+)
```tsx
// app/actions.ts
'use server'
export async function createPost(title: string) {
  const post = await db.posts.create({ title })
  revalidatePath('/posts')
  return post
}

// app/new-post/page.tsx
'use client'
export default function NewPost() {
  async function handleSubmit(e) {
    const post = await createPost(e.target.title.value)
    // Post created server-side, client updated
  }
}
```

### Error Handling
```tsx
// app/error.tsx (catches errors in app/*)
'use client'
export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### Loading State
```tsx
// app/posts/loading.tsx
export default function Loading() {
  return <div>Loading posts...</div>
}
```

---

## Testing

### Unit Test (Jest + React Testing Library)
```tsx
// __tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import Button from '@/components/Button'

it('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toHaveTextContent('Click me')
})
```

### API Route Test
```ts
// __tests__/api/users.test.ts
import { GET } from '@/app/api/users/route'

it('returns users', async () => {
  const response = await GET(new Request('http://localhost/api/users'))
  expect(response.status).toBe(200)
})
```

### E2E Test (Playwright)
```ts
// __tests__/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=email]', 'test@example.com')
  await page.fill('[name=password]', 'password')
  await page.click('button[type=submit]')
  await expect(page).toHaveURL('/dashboard')
})
```

---

## Performance Tips

### Image Optimization
```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true} // For above-fold images
/>
```

### Code Splitting
```tsx
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('@/components/Chart'), { ssr: false })
```

### Database Query Optimization
```ts
// Bad: N+1 queries
const posts = await db.posts.findMany()
for (const post of posts) {
  const author = await db.users.findUnique({ where: { id: post.userId } })
}

// Good: Join/include
const posts = await db.posts.findMany({
  include: { author: true }
})
```

---

## Common Issues & Fixes

### Hydration Mismatch
**Problem**: Text/HTML differs between server render and client
```tsx
// Bad — server renders different date than client
<div>{new Date().toLocaleDateString()}</div>

// Good — defer to client or use server date
import { formatDate } from '@/lib/date'
<div>{formatDate(serverDate)}</div>
```

### Infinite Loops in useEffect
```tsx
// Bad
useEffect(() => {
  fetchData()
}, [fetchData]) // fetchData recreated every render

// Good
useEffect(() => {
  fetchData()
}, []) // Empty deps = run once on mount
```

### API Route Type Issues
```ts
// Bad
export async function POST(request) {
  const body = await request.json() // Missing type
}

// Good
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ ... })
}
```

---

## When Briefing AI

**Include:**
- ✅ Folder structure overview
- ✅ What's in `src/lib/` (helpers, utilities)
- ✅ Database schema (if Prisma)
- ✅ Auth mechanism (JWT, session, etc)
- ✅ Current conventions (naming, file structure)
- ✅ Specific issue/task (be precise)

**Don't need to include:**
- ❌ Full file listings (AI can read files)
- ❌ Obvious best practices (AI knows Next.js)
- ❌ Code you want AI to figure out (that's the task)

---

## Useful Docs Links

- [Next.js Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [TypeScript](https://nextjs.org/docs/basic-features/typescript)
- [Prisma](https://www.prisma.io/docs/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/docs/intro)

---

**Last Updated**: 2026-06-17  
**For**: Next.js 13+ with App Router  
**Stack**: TypeScript, Tailwind, Prisma, Docker
