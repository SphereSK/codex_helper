# Makefile — Common Development Tasks

.PHONY: help install dev build test lint format clean migrate seed deploy logs

# Default target
help:
	@echo "Available commands:"
	@echo "  make install         — Install dependencies"
	@echo "  make dev             — Start dev server with Docker"
	@echo "  make dev-local       — Start dev server locally (Node)"
	@echo "  make build           — Build for production"
	@echo "  make start           — Start production server"
	@echo "  make test            — Run tests"
	@echo "  make test-watch      — Run tests in watch mode"
	@echo "  make test-coverage   — Run tests with coverage"
	@echo "  make lint            — Check code quality"
	@echo "  make format          — Auto-format code"
	@echo "  make format-check    — Check formatting without changing"
	@echo "  make clean           — Remove build artifacts"
	@echo "  make db-migrate      — Run database migrations"
	@echo "  make db-seed         — Seed database"
	@echo "  make db-studio       — Open Prisma Studio"
	@echo "  make db-reset        — Reset database (DESTRUCTIVE)"
	@echo "  make logs            — View container logs"
	@echo "  make logs-app        — View app logs"
	@echo "  make logs-db         — View database logs"
	@echo "  make restart         — Restart Docker services"
	@echo "  make deploy          — Deploy to production"
	@echo "  make health          — Check app health"

# ============================================================================
# Development
# ============================================================================

install:
	npm install

dev:
	docker-compose up -d
	@echo "App running at http://localhost:3000"

dev-local:
	npm run dev

stop:
	docker-compose down

# ============================================================================
# Building & Testing
# ============================================================================

build:
	npm run build

start: build
	npm start

test:
	npm test

test-watch:
	npm run test:watch

test-coverage:
	npm run test:coverage
	@echo "Coverage report: ./coverage/index.html"

# ============================================================================
# Code Quality
# ============================================================================

lint:
	npm run lint

format:
	npm run format

format-check:
	npx prettier --check .

type-check:
	npx tsc --noEmit

# ============================================================================
# Database
# ============================================================================

db-migrate:
	docker-compose exec app npx prisma migrate dev

db-migrate-deploy:
	docker-compose exec app npx prisma migrate deploy

db-seed:
	docker-compose exec app npm run seed

db-studio:
	docker-compose exec app npx prisma studio
	@echo "Studio: http://localhost:5555"

db-reset:
	@echo "⚠️  This will DELETE all data!"
	@read -p "Continue? [y/N]: " confirm && [ $$confirm = y ] && \
	docker-compose exec app npx prisma migrate reset

# ============================================================================
# Logs & Monitoring
# ============================================================================

logs:
	docker-compose logs -f

logs-app:
	docker-compose logs -f app

logs-db:
	docker-compose logs -f db

health:
	curl -s http://localhost:3000/api/health | jq .

# ============================================================================
# Docker
# ============================================================================

restart:
	docker-compose restart

rebuild:
	docker-compose build --no-cache
	docker-compose up -d

ps:
	docker-compose ps

# ============================================================================
# Cleanup
# ============================================================================

clean:
	rm -rf .next build dist
	rm -rf node_modules
	docker-compose down -v

# ============================================================================
# Production Deployment
# ============================================================================

deploy: lint test build
	@echo "✓ All checks passed"
	@echo "Ready to deploy. Next steps:"
	@echo "1. Update version in package.json"
	@echo "2. git add . && git commit -m 'Release v...'"
	@echo "3. git push origin main"
	@echo "4. Docker builds and releases automatically"
