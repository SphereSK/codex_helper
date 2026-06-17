import { NextRequest, NextResponse } from 'next/server'

export class APIError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message)
  }
}

/**
 * Standard error response format
 */
export function errorResponse(
  error: Error | APIError | string,
  status: number = 500
) {
  let message = 'Internal server error'
  let code = 'INTERNAL_ERROR'

  if (typeof error === 'string') {
    message = error
  } else if (error instanceof APIError) {
    message = error.message
    status = error.status
    code = error.code || 'API_ERROR'
  } else if (error instanceof Error) {
    message = error.message
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && status === 500) {
    message = 'Internal server error'
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        status,
      },
    },
    { status }
  )
}

/**
 * Catch errors in API routes
 */
export async function withErrorHandling(
  handler: (req: NextRequest) => Promise<Response>
) {
  return async (request: NextRequest) => {
    try {
      return await handler(request)
    } catch (error) {
      console.error('Route error:', error)

      if (error instanceof APIError) {
        return errorResponse(error, error.status)
      }

      return errorResponse(error, 500)
    }
  }
}

/**
 * Validation error
 */
export class ValidationError extends APIError {
  constructor(message: string, public details?: Record<string, string>) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

/**
 * Authentication error
 */
export class AuthError extends APIError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

/**
 * Permission error
 */
export class PermissionError extends APIError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

/**
 * Not found error
 */
export class NotFoundError extends APIError {
  constructor(message: string = 'Not found') {
    super(message, 404, 'NOT_FOUND')
  }
}

/**
 * Conflict error (resource exists)
 */
export class ConflictError extends APIError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT')
  }
}
