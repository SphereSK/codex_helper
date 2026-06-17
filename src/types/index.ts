/**
 * User types
 */
export interface User {
  id: string
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AuthUser extends User {
  role: string
}

/**
 * API Response types
 */
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
    status: number
  }
  message?: string | null
}

/**
 * Pagination
 */
export interface PaginationParams {
  page: number
  limit: number
  offset?: number
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  pages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/**
 * Form types
 */
export interface LoginForm {
  email: string
  password: string
}

export interface SignupForm {
  email: string
  password: string
  name: string
}

export interface ForgotPasswordForm {
  email: string
}

export interface ResetPasswordForm {
  token: string
  password: string
  passwordConfirm: string
}

/**
 * Environment variables type
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      DATABASE_URL: string
      REDIS_URL?: string
      AUTH_SECRET: string
      AUTH_TRUST_HOST: string
      NEXT_PUBLIC_API_URL: string
    }
  }
}
