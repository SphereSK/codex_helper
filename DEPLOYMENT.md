# Deployment — Docker (Production)

Deploy Next.js app to production via Docker.

---

## Architecture

```
Your Server (VPS/EC2/DigitalOcean)
├── Docker Engine
└── Docker Compose
    ├── app (Next.js, port 3000)
    ├── db (PostgreSQL, port 5432)
    └── redis (Cache, port 6379)
```

---

## Pre-Deployment Checklist

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Linting passes: `npm run lint`
- [ ] No console errors/warnings
- [ ] Environment variables documented
- [ ] Database migrations tested locally
- [ ] Secrets secured (not in code)

---

## Production Environment Setup

### 1. Prepare Server

```bash
# SSH into server
ssh user@your-server.com

# Install Docker + Compose
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Create app directory
mkdir -p /app/my-app
cd /app/my-app
```

### 2. Clone Repository

```bash
git clone <your-repo-url> .
cd /app/my-app
```

### 3. Setup Secrets

```bash
# Copy example and edit with production values
cp .env.example .env.production.local

# NEVER commit this file
echo ".env.production.local" >> .gitignore

# Edit with production secrets
nano .env.production.local
```

**Required vars for production**:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:password@db:5432/app_prod
REDIS_URL=redis://redis:6379
NEXTAUTH_SECRET=<strong-random-secret>
NEXTAUTH_URL=https://yourdomain.com
```

---

## Build & Deploy

### Option 1: Build Locally, Deploy Image

```bash
# Locally
npm run build
docker build -t my-app:1.0.0 .
docker tag my-app:1.0.0 registry.example.com/my-app:1.0.0
docker push registry.example.com/my-app:1.0.0

# On server
docker pull registry.example.com/my-app:1.0.0
docker-compose up -d
```

### Option 2: Build on Server

```bash
# On server
cd /app/my-app
git pull origin main
docker-compose build --no-cache
docker-compose down
docker-compose up -d
```

---

## Docker Compose for Production

Edit `docker-compose.yml` for production:

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: nextjs-app-prod
    restart: always
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/app_prod
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./logs:/app/logs
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ['CMD', 'wget', '--no-verbose', '--tries=1', '--spider', 'http://localhost:3000/api/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  db:
    image: postgres:15-alpine
    container_name: nextjs-db-prod
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: app_prod
    volumes:
      - postgres_data_prod:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - '5432:5432'
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: nextjs-redis-prod
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redis_data_prod:/data
    ports:
      - '6379:6379'
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data_prod:
    driver: local
  redis_data_prod:
    driver: local
```

---

## First Deployment

### 1. Run Migrations

```bash
docker-compose exec app npx prisma migrate deploy
# Or with specific database
docker-compose exec app npx prisma migrate deploy --skip-generate
```

### 2. Seed Data (if needed)

```bash
docker-compose exec app npm run seed
```

### 3. Verify Health

```bash
# Check app
curl http://localhost:3000

# Check API
curl http://localhost:3000/api/health

# Check logs
docker-compose logs -f app
```

---

## Reverse Proxy (Nginx)

Expose app on standard ports (80/443):

### Install Nginx

```bash
sudo apt-get install nginx certbot python3-certbot-nginx
```

### Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/my-app
```

```nginx
upstream nextjs_app {
  server app:3000;
}

server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;

  # Redirect to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name yourdomain.com www.yourdomain.com;

  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

  client_max_body_size 20M;

  location / {
    proxy_pass http://nextjs_app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Cache static assets
  location /_next/static {
    proxy_pass http://nextjs_app;
    proxy_cache_valid 200 60d;
    proxy_cache_key "$scheme$request_method$host$request_uri";
  }

  location /public {
    proxy_pass http://nextjs_app;
    proxy_cache_valid 200 30d;
  }
}
```

### Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/my-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Get SSL Certificate

```bash
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
# Certbot auto-renews
```

---

## Ongoing Operations

### View Logs

```bash
docker-compose logs -f app
docker-compose logs -f db
docker-compose logs db | grep ERROR
```

### Restart Services

```bash
# Restart app
docker-compose restart app

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d
```

### Database Backup

```bash
# Manual backup
docker-compose exec db pg_dump -U postgres app_prod > backup.sql

# Automated backup (cron)
0 2 * * * docker-compose -f /app/my-app/docker-compose.yml exec -T db pg_dump -U postgres app_prod > /app/my-app/backups/backup-$(date +\%Y\%m\%d).sql
```

### Database Restore

```bash
docker-compose exec -T db psql -U postgres app_prod < backup.sql
```

### Database Migrations (after updates)

```bash
# Pull latest code
git pull origin main

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Restart app
docker-compose restart app
```

---

## Zero-Downtime Deployment

### Strategy: Blue-Green

```bash
# Current: app:v1 running on port 3000

# 1. Start new version on different port
docker run -d -p 3001:3000 my-app:v2

# 2. Test new version
curl http://localhost:3001/api/health

# 3. Switch nginx to new port
# Edit /etc/nginx/sites-available/my-app
# Change upstream port 3000 → 3001

# 4. Reload nginx
sudo nginx -s reload

# 5. Keep old version running for quick rollback
# 6. Stop old version after verification
docker stop <old-container-id>
```

---

## Monitoring & Alerts

### Health Checks

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
      timestamp: new Date(),
      uptime: process.uptime(),
    })
  } catch (error) {
    return Response.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    )
  }
}
```

### Monitor Health

```bash
# Watch health endpoint
watch -n 5 'curl -s http://localhost:3000/api/health | jq'

# Or use monitoring service (Uptime Robot, Pingdom)
# POST https://yourdomain.com/api/health every 5 minutes
```

---

## Troubleshooting

### App won't start
```bash
docker-compose logs app
# Check for errors in output
```

### Database connection failed
```bash
docker-compose ps  # Verify db is running
docker-compose logs db
# Check DATABASE_URL in .env.production.local
```

### Out of disk space
```bash
docker system prune -a  # Remove unused images
docker volume prune      # Remove unused volumes
```

### Port already in use
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

---

## Rollback

If deployment fails:

```bash
# See previous images
docker images

# Revert to previous version
docker-compose down
docker image rm my-app:latest
docker pull registry/my-app:v1.0.0
docker-compose up -d
```

Or keep 2 running versions:

```bash
# App v1 on port 3000
# App v2 on port 3001 (test here first)
# Nginx routes traffic to current version
# Easy rollback: nginx points back to 3000
```

---

## Security Checklist

- [ ] `.env.production.local` not in git
- [ ] Secrets stored in `.env.production.local`
- [ ] Database password changed from default
- [ ] HTTPS enabled (SSL certificate)
- [ ] Nginx configured (firewall rules)
- [ ] Regular backups enabled
- [ ] Database backups encrypted
- [ ] Logs monitored
- [ ] Update Docker regularly
- [ ] Security patches applied

---

**Last Updated**: 2026-06-17  
**Deploy Method**: Docker Compose  
**Server**: VPS/EC2/DigitalOcean  
**Reverse Proxy**: Nginx + SSL
