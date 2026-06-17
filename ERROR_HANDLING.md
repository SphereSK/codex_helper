# Error Handling Patterns — Next.js

Consistent error formats, logging, and recovery.

---

## API Response Format

### Success Response
```ts
// app/api/users/route.ts
import { Response } from '@/lib/errors'

export async function GET(request: Request) {
  const users = await db.users.findMany()
  
  return Response.json({
    success: true,
    data: users,
    message: null,
  })
}
```

### Error Response
```ts
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.email) {
      return Response.error('Email is required', 400)
    }
    
    const user = await db.users.create({ data: body })
    return Response.json({
      success: true,
      data: user,
    }, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    return Response.error('Internal server error', 500)
  }
}
```

### Standard Format
```ts
// src/lib/errors.ts
export class APIError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message)
  }
}

export const Response = {
  json(data: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify({
      success: true,
      data,
      message: null,
    }), {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
  },

  error(message: string, status: number = 500, code?: string) {
    return new Response(JSON.stringify({
      success: false,
      data: null,
      message,
      code,
    }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  },
}
```

---

## HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|------------|
| 200 | OK | Success (GET, PUT, PATCH) |
| 201 | Created | Success (POST with resource created) |
| 204 | No Content | Success (DELETE, no body) |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (email taken) |
| 500 | Server Error | Unexpected error |
| 503 | Service Unavailable | Database down, external API down |

---

## Error Codes (Application Level)

Define standard codes for client handling:

```ts
// src/lib/errors.ts
export const ERROR_CODES = {
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_EMAIL: 'INVALID_EMAIL',
  PASSWORD_TOO_WEAK: 'PASSWORD_TOO_WEAK',
  
  // Auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Resource
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Server
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
}
```

---

## Server-Side Error Handling

### API Route Error Handling
```ts
// app/api/posts/route.ts
import { APIError, Response } from '@/lib/errors'
import { validatePostData } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validation
    const validation = validatePostData(body)
    if (!validation.valid) {
      return Response.error(validation.message, 400, 'VALIDATION_ERROR')
    }
    
    // Check permissions
    const user = await authenticate(request)
    if (!user) {
      return Response.error('Unauthorized', 401)
    }
    
    // Create post
    const post = await db.posts.create({
      data: {
        ...body,
        authorId: user.id,
      }
    })
    
    return Response.json({ data: post }, { status: 201 })
  } catch (error) {
    // Log error
    logError('POST /api/posts', error, { body })
    
    // Don't expose internal details
    if (error instanceof APIError) {
      return Response.error(error.message, error.status, error.code)
    }
    
    return Response.error('Internal server error', 500)
  }
}
```

### Server Action Error Handling
```ts
// app/actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { APIError } from '@/lib/errors'

export async function createPost(formData: FormData) {
  try {
    const title = formData.get('title')
    
    if (!title || title.toString().length === 0) {
      throw new APIError('Title is required', 400)
    }
    
    const user = await authenticate()
    if (!user) {
      throw new APIError('Unauthorized', 401)
    }
    
    const post = await db.posts.create({
      data: {
        title: title.toString(),
        authorId: user.id,
      }
    })
    
    revalidatePath('/posts')
    return { success: true, data: post }
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, error: error.message }
    }
    
    logError('createPost', error)
    return { success: false, error: 'Failed to create post' }
  }
}
```

---

## Client-Side Error Handling

### Fetch Wrapper with Error Handling
```ts
// src/lib/fetch.ts
export class FetchError extends Error {
  constructor(
    public status: number,
    public code?: string,
    message?: string
  ) {
    super(message)
  }
}

export async function apiCall<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new FetchError(
      response.status,
      data.code,
      data.message || `HTTP ${response.status}`
    )
  }

  return data.data
}
```

### React Hook with Error Handling
```tsx
// src/hooks/useFetch.ts
'use client'
import { useState, useEffect } from 'react'
import { FetchError } from '@/lib/fetch'

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const result = await fetch(url).then(r => r.json())
        setData(result.data)
      } catch (error) {
        if (error instanceof FetchError) {
          setError(error.message)
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [url])

  return { data, error, loading }
}
```

### Component with Error Boundary
```tsx
'use client'
import { useActionState } from 'react'
import { createPost } from '@/app/actions'

export function NewPostForm() {
  const [state, formAction, pending] = useActionState(createPost, null)

  return (
    <form action={formAction}>
      <input type="text" name="title" placeholder="Post title" required />
      <button type="submit" disabled={pending}>
        {pending ? 'Creating...' : 'Create Post'}
      </button>

      {state?.error && (
        <div role="alert" className="error">
          {state.error}
        </div>
      )}
    </form>
  )
}
```

### Error Boundary (React 18)
```tsx
// src/components/ErrorBoundary.tsx
'use client'
import { useEffect } from 'react'

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div role="alert" className="error-container">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

Use in layout:
```tsx
// app/error.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'
export default ErrorBoundary
```

---

## Logging

### Logger Utility
```ts
// src/lib/logger.ts
export const logger = {
  info: (message: string, data?: unknown) => {
    console.log(`[INFO] ${message}`, data)
  },

  warn: (message: string, data?: unknown) => {
    console.warn(`[WARN] ${message}`, data)
  },

  error: (message: string, error?: unknown, context?: unknown) => {
    console.error(`[ERROR] ${message}`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : null,
      context,
    })
  },
}

export function logError(operation: string, error: unknown, context?: unknown) {
  logger.error(`[${operation}]`, error, context)
  
  // Send to error tracking service (Sentry, etc)
  if (process.env.NODE_ENV === 'production') {
    sendToErrorTracking(operation, error, context)
  }
}
```

### Usage
```ts
try {
  const user = await db.users.findUnique({ where: { id } })
} catch (error) {
  logError('findUser', error, { userId: id })
  throw new APIError('Failed to fetch user', 500)
}
```

---

## Validation

### Input Validation
```ts
// src/lib/validation.ts
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validatePassword(password: string) {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be 8+ characters' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain uppercase' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain a number' }
  }
  return { valid: true, message: null }
}
```

### Use in API
```ts
export async function POST(request: Request) {
  const body = await request.json()
  
  if (!validateEmail(body.email)) {
    return Response.error('Invalid email', 400, 'INVALID_EMAIL')
  }
  
  const password = validatePassword(body.password)
  if (!password.valid) {
    return Response.error(password.message, 400, 'PASSWORD_TOO_WEAK')
  }
  
  // Continue...
}
```

---

## Never Expose

❌ Stack traces (in production)
❌ Database details
❌ Internal file paths
❌ Secrets/API keys
❌ Query syntax
❌ Third-party service details

✅ Generic messages: "Something went wrong"
✅ Error codes: `VALIDATION_ERROR`
✅ User-friendly descriptions: "Email already in use"

---

**Last Updated**: 2026-06-17  
**Pattern**: Consistent API format, typed errors, proper logging
