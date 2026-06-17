import Redis from 'ioredis'

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : null

if (!redis && process.env.NODE_ENV === 'production') {
  throw new Error('REDIS_URL not set in production')
}

redis?.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redis?.on('connect', () => {
  console.log('Redis connected')
})

export default redis
