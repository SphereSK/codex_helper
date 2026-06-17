# Prisma Migrations — Safe Database Changes

Schema changes, migrations, and database management.

---

## Workflow

### 1. Update Schema

Edit `prisma/schema.prisma`:

```prisma
model Post {
  id    Int     @id @default(autoincrement())
  title String
  status String @default("draft")  // New field
  
  @@index([status])  // New index
}
```

### 2. Create Migration

```bash
npx prisma migrate dev --name add_post_status
# Creates: prisma/migrations/20240617_add_post_status/migration.sql
```

### 3. Review Migration

```bash
cat prisma/migrations/20240617_add_post_status/migration.sql
```

Example output:
```sql
-- AlterTable
ALTER TABLE "Post" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'draft';

-- CreateIndex
CREATE INDEX "Post_status_idx" ON "Post"("status");
```

### 4. Deploy to Database

```bash
# Dev environment (automatic with `migrate dev`)
npx prisma migrate dev

# Staging/production
npx prisma migrate deploy
```

---

## Common Scenarios

### Add New Column

**Schema change:**
```prisma
model User {
  id Int @id @default(autoincrement())
  email String @unique
  role String @default("user")  // NEW
}
```

**Create migration:**
```bash
npx prisma migrate dev --name add_user_role
```

**Generated SQL:**
```sql
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
```

### Add Relationship

**Schema change:**
```prisma
model Post {
  id Int @id @default(autoincrement())
  title String
  authorId Int              // NEW
  author User @relation(... // NEW
    fields: [authorId],
    references: [id]
  )
}

model User {
  id Int @id @default(autoincrement())
  posts Post[]  // NEW
}
```

**Create migration:**
```bash
npx prisma migrate dev --name add_post_author_relation
```

### Add Index for Performance

**Schema change:**
```prisma
model Post {
  id Int @id @default(autoincrement())
  title String
  createdAt DateTime @default(now())
  
  @@index([createdAt])  // NEW — speed up date queries
}
```

**Create migration:**
```bash
npx prisma migrate dev --name add_post_created_index
```

### Make Column Unique

**Schema change:**
```prisma
model User {
  email String @unique  // Changed from plain String
}
```

**Create migration:**
```bash
npx prisma migrate dev --name make_user_email_unique
```

---

## Safety Rules

### ✅ Safe to deploy immediately
- Adding new column with default value
- Adding index
- Adding table
- Renaming column (with `@db.map`)
- Adding optional field (without default)

### ⚠️ Require data migration
- Removing column (backup first)
- Changing column type (migration needed)
- Making optional column required (backfill data first)
- Removing index (check if used)

### ❌ Breaking changes
- Removing table
- Changing primary key
- Removing required field without default

---

## Data Migrations

When you need to backfill or transform data:

### Example: Add Required Column to Existing Data

**Schema:**
```prisma
model Post {
  status String  // New required field
}
```

**Problem:** Existing rows have no value. Can't add required field.

**Solution:**

1. Add with default first:
```prisma
model Post {
  status String @default("draft")
}
```

2. Create migration:
```bash
npx prisma migrate dev --name add_post_status_with_default
```

3. Update existing data:
```bash
docker-compose exec app npx prisma db execute --stdin < ./backfill.sql
```

Where `backfill.sql`:
```sql
UPDATE "Post" SET "status" = 'published' WHERE "createdAt" < NOW() - INTERVAL '7 days';
```

4. (Optional) Make column non-optional:
```prisma
model Post {
  status String  // Still @default, but now enforced
}
```

---

## Viewing Migrations

### List all migrations:
```bash
ls -la prisma/migrations/
```

Example:
```
20240615120000_initial_schema/
20240615130000_add_user_role/
20240615140000_add_post_status/
```

### View specific migration:
```bash
cat prisma/migrations/20240615140000_add_post_status/migration.sql
```

### See migration metadata:
```bash
cat prisma/migrations/20240615140000_add_post_status/migration_lock.toml
```

---

## Handling Issues

### Migration Failed

```bash
# Check status
npx prisma migrate status

# See what failed
docker-compose logs db

# Rollback (manual)
docker-compose exec db psql -U postgres app_dev
# Inside psql:
SELECT * FROM "_prisma_migrations";
DELETE FROM "_prisma_migrations" WHERE migration_name = '...';
```

### Can't Create Migration (schema invalid)

```bash
# Validate schema
npx prisma validate

# Check for errors (typos, missing types, etc)
nano prisma/schema.prisma
```

### Database Out of Sync

```bash
# Check state
npx prisma migrate status

# Reset to clean slate (DESTRUCTIVE — loses all data)
npx prisma migrate reset
# This runs all migrations from scratch

# Then reseed if you have seed.ts
npx prisma db seed
```

---

## Development vs Production

### Development
```bash
# Create + apply migration in one step
npx prisma migrate dev --name <migration_name>
```

### Staging/Production
```bash
# Only apply existing migrations (safe, no schema changes)
npx prisma migrate deploy
```

Never run `migrate dev` in production. Always:
1. Create migration locally
2. Test locally
3. Deploy with `migrate deploy`

---

## Seeding Data

### Create seed script

`prisma/seed.ts`:
```ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
    },
  })

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
    },
  })

  // Create posts
  await prisma.post.create({
    data: {
      title: 'Hello World',
      authorId: alice.id,
    },
  })

  console.log('Seeding complete')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### Add to package.json

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### Run seeding

```bash
# Development
npm run seed

# Docker
docker-compose exec app npm run seed
```

---

## Commands Reference

```bash
# Create migration from schema changes
npx prisma migrate dev --name <name>

# Apply migrations (safe for production)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Reset database to clean state (DESTRUCTIVE)
npx prisma migrate reset

# Open database browser
npx prisma studio

# Generate Prisma client
npx prisma generate

# Validate schema
npx prisma validate

# Format schema
npx prisma format
```

---

## Best Practices

✅ **Do:**
- Create migrations for every schema change
- Test migrations locally before production
- Give migrations descriptive names (`add_user_role` not `update`)
- Review generated SQL before deploying
- Keep migration history in git
- Backup database before running migrations

❌ **Don't:**
- Manually edit migration files (regenerate if wrong)
- Run `migrate dev` in production
- Skip migrations in production
- Delete migration files
- Commit `.env` files with secrets

---

**Last Updated**: 2026-06-17  
**Tool**: Prisma ORM  
**Database**: PostgreSQL
