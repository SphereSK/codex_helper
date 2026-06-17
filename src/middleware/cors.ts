import { NextRequest, NextResponse } from 'next/server'

export interface CORSOptions {
  origins?: string[] | '*'
  methods?: string[]
  headers?: string[]
  credentials?: boolean
  maxAge?: number
}

const DEFAULT_OPTIONS: CORSOptions = {
  origins: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}

/**
 * CORS middleware
 */
export function withCORS(
  handler: (req: NextRequest) => Promise<Response>,
  options: CORSOptions = {}
) {
  const config = { ...DEFAULT_OPTIONS, ...options }

  return async (request: NextRequest) => {
    const origin = request.headers.get('origin')

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return handleCORSPreflight(origin, config)
    }

    const response = await handler(request)

    // Add CORS headers
    addCORSHeaders(response, origin, config)

    return response
  }
}

function handleCORSPreflight(
  origin: string | null,
  options: CORSOptions
): NextResponse {
  const allowOrigin =
    options.origins === '*'
      ? '*'
      : origin && options.origins?.includes(origin)
        ? origin
        : null

  if (!allowOrigin && options.origins !== '*') {
    return new NextResponse(null, { status: 403 })
  }

  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': allowOrigin || '*',
      'Access-Control-Allow-Methods': options.methods?.join(', ') || '*',
      'Access-Control-Allow-Headers': options.headers?.join(', ') || '*',
      'Access-Control-Max-Age': options.maxAge?.toString() || '86400',
      'Access-Control-Allow-Credentials': options.credentials ? 'true' : 'false',
    },
  })
}

function addCORSHeaders(
  response: NextResponse,
  origin: string | null,
  options: CORSOptions
): void {
  const allowOrigin =
    options.origins === '*'
      ? '*'
      : origin && options.origins?.includes(origin)
        ? origin
        : null

  if (allowOrigin) {
    response.headers.set('Access-Control-Allow-Origin', allowOrigin)
    response.headers.set('Access-Control-Allow-Credentials', options.credentials ? 'true' : 'false')
  }
}
