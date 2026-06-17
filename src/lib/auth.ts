import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

/**
 * Create JWT token
 */
export function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  return jwt.sign(payload, process.env.AUTH_SECRET || '', {
    expiresIn: '7d',
  })
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET || '') as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Compare password with hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate random token
 */
export function generateRandomToken(): string {
  return require('crypto').randomBytes(32).toString('hex')
}
