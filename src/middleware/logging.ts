import { NextRequest, NextResponse } from 'next/server'

export interface RequestLog {
  requestId: string
  method: string
  path: string
  status: number
  duration: number
  timestamp: string
  userId?: string
  error?: string
}

/**
 * Log request with timing
 */
export function withLogging(handler: (req: NextRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    const requestId = request.headers.get('x-request-id') || crypto.randomUUID()
    const startTime = Date.now()

    try {
      const response = await handler(request)
      const duration = Date.now() - startTime

      const log: RequestLog = {
        requestId,
        method: request.method,
        path: request.nextUrl.pathname,
        status: response.status,
        duration,
        timestamp: new Date().toISOString(),
      }

      // Log to console (or send to logging service)
      console.log(JSON.stringify(log))

      // Add timing header
      response.headers.set('X-Response-Time', `${duration}ms`)

      return response
    } catch (error) {
      const duration = Date.now() - startTime

      const log: RequestLog = {
        requestId,
        method: request.method,
        path: request.nextUrl.pathname,
        status: 500,
        duration,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }

      console.error(JSON.stringify(log))

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Log API calls with structured format
 */
export function logRequest(
  method: string,
  path: string,
  data?: any
) {
  const log = {
    timestamp: new Date().toISOString(),
    method,
    path,
    data,
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(log)
  } else {
    // Send to logging service (Datadog, CloudWatch, etc)
    // await sendToLoggingService(log)
  }
}

/**
 * Log errors with context
 */
export function logError(
  error: Error,
  context?: any
) {
  const log = {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
    },
    context,
  }

  console.error(log)

  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service (Sentry, etc)
    // await sendToErrorTracking(log)
  }
}
