# Health Checks & Monitoring

Readiness, liveness, and application health.

---

## Health Check Endpoint

### Implementation

```ts
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database
    await db.$queryRaw`SELECT 1`

    // Check redis
    await redis.ping()

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version,
    })
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 } // Service Unavailable
    )
  }
}
```

### Usage

```bash
# Check health
curl http://localhost:3000/api/health

# Expected response (healthy)
{
  "status": "healthy",
  "timestamp": "2026-06-17T10:30:00Z",
  "uptime": 3600,
  "version": "1.2.3"
}

# Expected response (unhealthy)
{
  "status": "unhealthy",
  "error": "Database connection refused",
  "timestamp": "2026-06-17T10:30:00Z"
}
```

---

## Readiness Probe

Indicates app is **ready to serve traffic**.

```ts
// app/api/ready/route.ts
export async function GET() {
  try {
    // Check critical dependencies
    await db.$queryRaw`SELECT 1`
    await redis.ping()

    // Check required configuration
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not set')
    }

    return Response.json({ ready: true })
  } catch (error) {
    return Response.json(
      { ready: false, reason: error.message },
      { status: 503 }
    )
  }
}
```

**Use for:** Docker Compose health check, Kubernetes readiness probe

---

## Liveness Probe

Indicates app is **running** (not crashed/stuck).

```ts
// app/api/alive/route.ts
export async function GET() {
  // Simple check — just needs to return 200
  // Don't check dependencies (those are for readiness)
  return Response.json({ alive: true })
}
```

**Use for:** Kubernetes liveness probe, simple uptime monitoring

---

## Docker Health Check

Add to `docker-compose.yml`:

```yaml
services:
  app:
    build: .
    healthcheck:
      test: ['CMD', 'wget', '--no-verbose', '--tries=1', '--spider', 'http://localhost:3000/api/health']
      interval: 30s        # Check every 30 seconds
      timeout: 10s         # Fail if check takes >10s
      retries: 3           # Mark unhealthy after 3 failures
      start_period: 40s    # Grace period after startup
```

**Meanings:**
- **interval** — How often to run check
- **timeout** — Max time for single check
- **retries** — Failures before marking unhealthy
- **start_period** — Wait before first check (startup time)

### Check Status

```bash
docker-compose ps
# HEALTHCHECK column shows: (healthy), (starting), (unhealthy)

docker-compose exec app curl http://localhost:3000/api/health
```

---

## Monitoring Metrics

### Key Metrics to Track

```ts
// Metrics to emit to monitoring service
export async function collectMetrics() {
  return {
    // Application
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),

    // Database
    dbConnections: await getConnectionCount(),
    dbQueryTime: averageQueryDuration(),

    // Cache
    cacheHits: cacheStatistics().hits,
    cacheMisses: cacheStatistics().misses,

    // Business
    activeUsers: await db.sessions.count(),
    requestsPerSecond: calculateRps(),
  }
}
```

### Send to Monitoring Service

```ts
// Send metrics to Prometheus, Datadog, etc
async function exportMetrics() {
  const metrics = await collectMetrics()

  await fetch(process.env.METRICS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(metrics),
  })
}

// Run periodically
setInterval(exportMetrics, 60000) // Every minute
```

---

## Monitoring Tools

### Built-in: Health Endpoint

```bash
# Simple monitoring via curl
watch -n 5 'curl -s http://localhost:3000/api/health | jq .'
```

### Uptime Robot

Monitor endpoint every 5 minutes:
```
https://yourdomain.com/api/health
Expected status: 200
```

### Prometheus

Metrics endpoint:
```ts
// app/api/metrics/route.ts
export async function GET() {
  const metrics = await collectMetrics()

  // Format for Prometheus
  return new Response(
    `
# HELP app_uptime Uptime in seconds
# TYPE app_uptime gauge
app_uptime ${metrics.uptime}

# HELP app_memory_usage Memory usage in bytes
# TYPE app_memory_usage gauge
app_memory_usage ${metrics.memoryUsage.heapUsed}
    `.trim(),
    { headers: { 'Content-Type': 'text/plain' } }
  )
}
```

### Docker Desktop

View health visually:
```bash
docker-compose ps
# Shows HEALTHCHECK status per service
```

---

## Database Health

### Connection Pool Status

```ts
// Check Prisma connection pool
const status = await db.$queryRaw`
  SELECT
    datname,
    count(*) as connections
  FROM pg_stat_activity
  GROUP BY datname
`
```

### Slow Query Detection

```ts
// Log slow queries
const slowThreshold = 1000 // ms

db.$on('query', (e) => {
  if (e.duration > slowThreshold) {
    console.warn(`Slow query (${e.duration}ms): ${e.query}`)
  }
})
```

---

## Redis Health

### Connection Check

```ts
// Verify Redis connection
try {
  await redis.ping()
  console.log('Redis: OK')
} catch (error) {
  console.error('Redis: Connection failed')
}
```

### Cache Size

```ts
const info = await redis.info('memory')
// Returns memory usage, fragmentation ratio, etc
```

---

## Error Tracking

### Log Errors

```ts
// Centralized error logging
async function logError(error: Error, context?: any) {
  console.error(error)

  // Send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    await fetch(process.env.ERROR_TRACKING_URL, {
      method: 'POST',
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date(),
      }),
    })
  }
}
```

### Error Boundary

```tsx
'use client'
export function ErrorBoundary({ error, reset }: any) {
  useEffect(() => {
    logError(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

---

## Alerting

### Set Alerts

When health check fails:
- Notify via Slack
- Page on-call engineer
- Create incident

```ts
// Webhook for health failures
if (healthStatus === 'unhealthy') {
  await fetch(process.env.SLACK_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify({
      text: '🚨 App health check failed',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Health Status:* UNHEALTHY\n*Error:* ${error}`,
          },
        },
      ],
    }),
  })
}
```

---

## Checklist

- [ ] Health endpoint implemented (`/api/health`)
- [ ] Database connection checked in health
- [ ] Redis connection checked in health
- [ ] Docker healthcheck configured
- [ ] Readiness probe setup (Kubernetes)
- [ ] Error logging configured
- [ ] Monitoring service connected (Prometheus/Datadog)
- [ ] Alerts configured (Slack/PagerDuty)
- [ ] Response times tracked
- [ ] Memory usage monitored

---

**Last Updated**: 2026-06-17  
**Tools**: Docker, Prometheus, Datadog, Sentry
