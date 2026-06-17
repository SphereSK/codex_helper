# Middleware Guide — Next.js + Better Auth

Reusable middleware for authentication, rate limiting, logging, CORS, error handling.

---

## Architecture

```
Request
  ↓
app/middleware.ts (Next.js edge middleware)
  ├── Security headers
  ├── Request ID
  ├── Auth check (redirects to login if needed)
  └── Logs request
  ↓
API Route Handler
  ├── src/middleware/auth.ts (verify token)
  ├── src/middleware/rateLimit.ts (rate limiting)
  ├── src/middleware/cors.ts (CORS headers)
  ├── src/middleware/logging.ts (structured logs)
  └── src/middleware/errors.ts (error handling)
  ↓
Response
```

---

## Files

### `app/middleware.ts` — Global Middleware

Runs on every request. Applied at edge (very fast).

**Does:**
- ✅ Adds security headers (HSTS, CSP, X-Frame-Options)
- ✅ Generates request ID
- ✅ Checks authentication for protected routes
- ✅ Logs request method + path

**When to modify:**
- Add global security rules
- Change public/protected routes
- Add request ID generation

**Usage:**
```ts
// Automatically applied by Next.js
// No imports needed
```

---

### `src/middleware/auth.ts` — Authentication

JWT token verification and role-based access.

**Functions:**
- `verifyAuth(request)` — Verify token from request
- `requireAuth(handler)` — Protect endpoint (needs auth)
- `requireRole(role)` — Protect by role (admin/user)

**Usage:**

```ts
// app/api/admin/users/route.ts
import { requireRole } from '@/middleware/auth'

const GET = requireRole('admin')(async (request, user) => {
  // Only admin can access
  return Response.json({ users: [] })
})

export { GET }
```

Or simpler:
```ts
// app/api/posts/route.ts
import { requireAuth } from '@/middleware/auth'

const POST = requireAuth(async (request, user) => {
  // Only authenticated users
  console.log(`User ${user.userId} creating post`)
  return Response.json({ success: true })
})

export { POST }
```

---

### `src/middleware/rateLimit.ts` — Rate Limiting

Prevent abuse. Configurable per endpoint.

**Functions:**
- `rateLimitByIP(request)` — Limit by client IP
- `rateLimitByUser(userId)` — Limit by user ID
- `withRateLimit(handler)` — Middleware wrapper

**Usage:**

```ts
// app/api/auth/login/route.ts
import { withRateLimit } from '@/middleware/rateLimit'

const handler = async (request: NextRequest) => {
  // Login logic
  return Response.json({ token: '...' })
}

// 5 requests per 60 seconds per IP
export const POST = withRateLimit(handler, {
  points: 5,
  duration: 60,
  keyPrefix: 'login',
})
```

### Response Headers

Successful requests get:
```
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 2026-06-17T20:00:00Z
```

When rate limited:
```
HTTP 429 Too Many Requests
Retry-After: 45
X-RateLimit-Reset: 2026-06-17T20:00:00Z
```

---

### `src/middleware/logging.ts` — Request Logging

Structured logging with timing.

**Functions:**
- `withLogging(handler)` — Log all requests + timing
- `logRequest(method, path, data)` — Manual logging
- `logError(error, context)` — Log errors with context

**Usage:**

```ts
// app/api/posts/[id]/route.ts
import { withLogging, logRequest } from '@/middleware/logging'

const handler = async (request: NextRequest) => {
  logRequest('GET', `/posts/${id}`, { id })
  
  const post = await db.posts.findUnique({ where: { id } })
  
  return Response.json(post)
}

export const GET = withLogging(handler)
```

**Log output:**
```json
{
  "timestamp": "2026-06-17T20:30:00Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "GET",
  "path": "/api/posts/123",
  "status": 200,
  "duration": 42,
  "userId": "user_123"
}
```

---

### `src/middleware/cors.ts` — CORS (Cross-Origin)

Handle requests from different domains.

**Functions:**
- `withCORS(handler, options)` — Add CORS headers

**Usage:**

```ts
// app/api/data/route.ts
import { withCORS } from '@/middleware/cors'

const handler = async (request: NextRequest) => {
  return Response.json({ data: [] })
}

export const GET = withCORS(handler, {
  origins: ['https://example.com', 'https://app.example.com'],
  methods: ['GET', 'POST'],
  credentials: true,
})
```

**Response headers:**
```
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

---

### `src/middleware/errors.ts` — Error Handling

Standardized error responses.

**Classes:**
- `APIError` — Base error
- `ValidationError` — 400
- `AuthError` — 401
- `PermissionError` — 403
- `NotFoundError` — 404
- `ConflictError` — 409

**Usage:**

```ts
// app/api/users/route.ts
import { ValidationError, ConflictError, withErrorHandling } from '@/middleware/errors'

const handler = async (request: NextRequest) => {
  const body = await request.json()
  
  if (!body.email) {
    throw new ValidationError('Email required')
  }
  
  const exists = await db.users.findUnique({ where: { email: body.email } })
  if (exists) {
    throw new ConflictError('Email already in use')
  }
  
  const user = await db.users.create({ data: body })
  return Response.json(user)
}

export const POST = withErrorHandling(handler)
```

**Error responses:**
```json
{
  "success": false,
  "error": {
    "message": "Email required",
    "code": "VALIDATION_ERROR",
    "status": 400
  }
}
```

---

## Combining Middleware

Use multiple middleware together:

```ts
// app/api/posts/route.ts
import { requireAuth } from '@/middleware/auth'
import { withRateLimit } from '@/middleware/rateLimit'
import { withLogging } from '@/middleware/logging'
import { withErrorHandling } from '@/middleware/errors'

const handler = async (request: NextRequest, user) => {
  // Logic here
  return Response.json({ success: true })
}

// Wrap in order of execution (innermost runs first)
export const POST = requireAuth(
  withRateLimit(
    withLogging(
      withErrorHandling(handler)
    ),
    { points: 10, keyPrefix: 'createPost' }
  )
)
```

Order matters! Typically:
1. Error handling (outermost, catches all errors)
2. Logging (log all requests)
3. Rate limiting (limit before expensive operations)
4. Auth (verify identity)
5. Handler (innermost, actual logic)

---

## Configuration

### Rate Limiting

In `.env`:
```
RATE_LIMITER_STORE=redis    # or 'memory'
RATE_LIMITER_POINTS=100     # requests per window
RATE_LIMITER_DURATION=60    # seconds
```

Per-endpoint overrides:
```ts
withRateLimit(handler, {
  points: 5,        // 5 requests
  duration: 60,     // per 60 seconds
  keyPrefix: 'api', // separate rate limit
})
```

### Auth

In `.env`:
```
AUTH_SECRET=your-secret-key
AUTH_TRUST_HOST=http://localhost:3000
```

Token storage options:
- Authorization header: `Authorization: Bearer <token>`
- Cookie: `auth_token=<token>`

### CORS

Default allows localhost:
```ts
origins: ['http://localhost:3000', 'http://localhost:3001']
```

Production:
```ts
origins: ['https://yourdomain.com', 'https://app.yourdomain.com']
```

---

## Testing Middleware

### Rate Limiting
```bash
# Test rate limit on login endpoint
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password"}'
  echo "Request $i"
done
# Request 6 should return 429
```

### Auth
```bash
# No token — should fail
curl http://localhost:3000/api/admin/users

# With token — should work
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/admin/users
```

### CORS
```bash
# From different origin
curl -H "Origin: https://example.com" \
  http://localhost:3000/api/data
# Check CORS headers in response
```

---

## Debugging

### Enable verbose logging

In `.env`:
```
DEBUG=*
LOG_LEVEL=debug
```

### Check request headers
```ts
// In any middleware
console.log('Headers:', Object.fromEntries(request.headers))
```

### View rate limiter state
```bash
# Redis
redis-cli
> KEYS rate:*
> GET rate:192.168.1.1
```

---

## Best Practices

✅ **Do:**
- Use rate limiting on sensitive endpoints (login, signup)
- Log all errors with context
- Verify auth on protected routes
- Add security headers globally
- Catch errors in handlers

❌ **Don't:**
- Log sensitive data (passwords, tokens)
- Expose internal errors to clients
- Skip auth on admin endpoints
- Use overly strict rate limits
- Block legitimate users

---

**Last Updated**: 2026-06-17  
**Stack**: Next.js 14+, Better Auth, Redis
