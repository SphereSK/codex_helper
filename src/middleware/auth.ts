import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export interface AuthToken {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

/**
 * Verify JWT token from request
 */
export async function verifyAuth(request: NextRequest): Promise<AuthToken | null> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.AUTH_SECRET || '') as AuthToken

    return decoded
  } catch (error) {
    console.error('Auth verification failed:', error)
    return null
  }
}

/**
 * Require authentication middleware
 */
export function requireAuth(handler: (req: NextRequest, user: AuthToken) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await verifyAuth(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return handler(request, user)
  }
}

/**
 * Require specific role
 */
export function requireRole(role: string) {
  return (handler: (req: NextRequest, user: AuthToken) => Promise<Response>) => {
    return async (request: NextRequest) => {
      const user = await verifyAuth(request)

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      if (user.role !== role) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      return handler(request, user)
    }
  }
}
