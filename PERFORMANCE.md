# Performance Optimization — Next.js

Metrics, monitoring, and optimization strategies.

---

## Core Web Vitals

Measure with Google PageSpeed Insights or Lighthouse.

| Metric | Good | Target |
|--------|------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Server render + image optimization |
| **FID** (First Input Delay) | < 100ms | Reduce JS, defer non-critical |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Fixed dimensions, avoid dynamic layouts |

---

## Optimization Checklist

### Images
```tsx
// ❌ Bad — unoptimized
<img src="/large-photo.jpg" />

// ✅ Good — optimized, lazy loaded
import Image from 'next/image'
<Image
  src="/large-photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  priority={false}
/>
```

Next.js Image automatically:
- Resizes for different devices
- Converts to modern formats (WebP)
- Lazy loads below fold
- Prevents layout shift (with dimensions)

### Code Splitting
```tsx
// ❌ Bad — bundle everything
import Chart from '@/components/Chart'
import Graph from '@/components/Graph'
import Stats from '@/components/Stats'

export default function Dashboard() {
  return (
    <>
      <Chart /> <Graph /> <Stats />
    </>
  )
}

// ✅ Good — split by route/interaction
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('@/components/Chart'))
const Graph = dynamic(() => import('@/components/Graph'))
const Stats = dynamic(() => import('@/components/Stats'), {
  loading: () => <div>Loading...</div>
})

export default function Dashboard() {
  return (
    <>
      <Chart /> <Graph /> <Stats />
    </>
  )
}
```

### Font Optimization
```tsx
// src/app/layout.tsx
import { Inter } from 'next/font/google'

// Optimized loading
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      {children}
    </html>
  )
}
```

### CSS-in-JS
```tsx
// ❌ Bad — runtime overhead
const styles = css`
  color: ${isDark ? 'white' : 'black'};
`

// ✅ Good — compiled CSS
<div className={isDark ? 'dark' : 'light'}>
  {children}
</div>
```

---

## Bundle Analysis

Check what's in your bundle:

```bash
# Install analyzer
npm install --save-dev @next/bundle-analyzer

# Create next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
})

# Run analysis
ANALYZE=true npm run build
# Opens HTML report in browser
```

---

## Database Query Optimization

### N+1 Query Problem
```ts
// ❌ Bad — queries in loop
const posts = await db.posts.findMany()
for (const post of posts) {
  post.author = await db.users.findUnique({
    where: { id: post.authorId }
  })
}
// 1 query + N queries = N+1 total

// ✅ Good — join in single query
const posts = await db.posts.findMany({
  include: { author: true }
})
// 1 query total
```

### Query Performance
```ts
// Enable query logging
// .env.local
DATABASE_LOG_QUERIES=true

// Or use Prisma query extension
const post = await db.posts.findUnique({
  where: { id: 1 },
  include: {
    author: true,      // Include relation
    _count: {
      select: { comments: true }
    }
  }
})
```

### Add Indexes
```prisma
// prisma/schema.prisma
model Post {
  id    Int     @id @default(autoincrement())
  title String
  slug  String  @unique
  createdAt DateTime @default(now())
  
  // Indexes for frequently queried columns
  @@index([createdAt])
  @@index([slug])
}

// Run migration
npx prisma migrate dev --name add_indexes
```

---

## Caching Strategy

### ISR (Incremental Static Regeneration)
Revalidate static pages periodically.

```tsx
// app/posts/[id]/page.tsx
export const revalidate = 60 // Revalidate every 60s

export default async function PostPage({ params }) {
  const post = await db.posts.findUnique({
    where: { id: parseInt(params.id) }
  })
  
  return <article>{post.content}</article>
}
```

### On-Demand Revalidation
```ts
// app/api/posts/[id]/revalidate/route.ts
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  revalidateTag(`post-${id}`)
  return Response.json({ revalidated: true })
}
```

### Browser Cache
```ts
// app/api/data/route.ts
export async function GET() {
  return Response.json(
    { data: [...] },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    }
  )
}
```

---

## Server vs Client Components

### Server Components (Default)
- No JavaScript sent to browser
- Direct database access
- Secrets safe (not exposed)

```tsx
// ✅ Good — static data, no interaction
export default async function Blog() {
  const posts = await db.posts.findMany()
  return <div>{posts.map(p => <Post key={p.id} post={p} />)}</div>
}
```

### Client Components
- Interactive features
- Event handlers, state
- Use only when needed

```tsx
'use client'
import { useState } from 'react'

// ✅ Good — only interactive part
export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

// Combine in page
export default async function Page() {
  const data = await db.getData()
  return (
    <>
      <h1>{data.title}</h1>
      <Counter /> {/* Client component, minimal */}
    </>
  )
}
```

---

## Monitoring

### Build Size
```bash
npm run build
# Check `.next/static/chunks/` size
# Target: < 100KB per chunk
```

### Runtime Performance
```tsx
// src/lib/performance.ts
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(metric)
    })
  }
}
```

Use in `app/layout.tsx`:
```tsx
import { reportWebVitals } from '@/lib/performance'

export function useReportWebVitals() {
  reportWebVitals()
}
```

---

## Common Bottlenecks

### Slow Initial Page Load
- Large JavaScript bundle
- Unoptimized images
- Slow database query

**Fix:**
1. Check bundle size: `ANALYZE=true npm run build`
2. Lazy load components with `dynamic()`
3. Optimize database queries (add indexes)

### Slow API Routes
- Complex calculations
- Unoptimized queries
- Waiting for external APIs

**Fix:**
1. Profile with `console.time()`
2. Query profile with Prisma logging
3. Cache results (Redis, HTTP cache headers)

### High Memory Usage
- Memory leak in background job
- Unbounded array/cache growth
- Large file operations

**Fix:**
1. Monitor with `process.memoryUsage()`
2. Clear caches periodically
3. Stream large files instead of loading fully

---

## Deployment Optimization

### next.config.js
```js
module.exports = {
  // Enable compression
  compress: true,
  
  // Optimize package size
  swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  }
}
```

---

**Last Updated**: 2026-06-17  
**Focus**: Core Web Vitals, bundle size, database queries, caching
