import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible'
import Redis from 'ioredis'
import { NextRequest, NextResponse } from 'next/server'

// Initialize rate limiter
const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null

const rateLimiterRedis = redis
  ? new RateLimiterRedis({
      storeClient: redis,
      points: parseInt(process.env.RATE_LIMITER_POINTS || '100'),
      duration: parseInt(process.env.RATE_LIMITER_DURATION || '60'),
      blockDurationMs: 15 * 60 * 1000, // 15 minutes
    })
  : null

const rateLimiterMemory = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMITER_POINTS || '100'),
  duration: parseInt(process.env.RATE_LIMITER_DURATION || '60'),
  blockDurationMs: 15 * 60 * 1000,
})

const rateLimiter = rateLimiterRedis || rateLimiterMemory

export interface RateLimitOptions {
  points?: number // Number of requests
  duration?: number // Time window in seconds
  keyPrefix?: string // For different endpoints
}

/**
 * Rate limit by IP address
 */
export async function rateLimitByIP(
  request: NextRequest,
  options: RateLimitOptions = {}
) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

  const key = options.keyPrefix ? `${options.keyPrefix}:${ip}` : ip

  try {
    const res = await rateLimiter.consume(key, 1)

    return {
      success: true,
      remaining: res.remainingPoints,
      resetTime: new Date(Date.now() + res.msBeforeNext),
    }
  } catch (error: any) {
    return {
      success: false,
      remaining: 0,
      resetTime: new Date(Date.now() + error.msBeforeNext),
      retryAfter: Math.ceil(error.msBeforeNext / 1000),
    }
  }
}

/**
 * Rate limit by user ID
 */
export async function rateLimitByUser(
  userId: string,
  options: RateLimitOptions = {}
) {
  const key = options.keyPrefix ? `${options.keyPrefix}:${userId}` : `user:${userId}`

  try {
    const res = await rateLimiter.consume(key, 1)

    return {
      success: true,
      remaining: res.remainingPoints,
      resetTime: new Date(Date.now() + res.msBeforeNext),
    }
  } catch (error: any) {
    return {
      success: false,
      remaining: 0,
      resetTime: new Date(Date.now() + error.msBeforeNext),
      retryAfter: Math.ceil(error.msBeforeNext / 1000),
    }
  }
}

/**
 * Middleware wrapper for rate limiting
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<Response>,
  options: RateLimitOptions = {}
) {
  return async (request: NextRequest) => {
    const result = await rateLimitByIP(request, options)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': result.retryAfter?.toString() || '60',
            'X-RateLimit-Reset': result.resetTime.toISOString(),
          },
        }
      )
    }

    const response = await handler(request)

    // Add rate limit headers
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', result.resetTime.toISOString())

    return response
  }
}
