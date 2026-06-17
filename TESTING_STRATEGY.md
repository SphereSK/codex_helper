# Testing Strategy — Next.js

Types of tests, coverage targets, and when to test.

---

## Test Types

### Unit Tests (Jest + React Testing Library)
Test individual components, functions, hooks in isolation.

**When**: Every component, hook, utility function
**Coverage target**: 80%+ (aim for 90%)
**Speed**: Fast (milliseconds)
**Tools**: Jest, React Testing Library

```tsx
// __tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/components/Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('calls onClick handler', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Integration Tests
Test multiple components together, API integration, database queries.

**When**: API routes, complex workflows, database operations
**Coverage target**: Critical paths only (50%+)
**Speed**: Slower (seconds)
**Tools**: Jest with real/test database

```ts
// __tests__/integration/auth.test.ts
import { POST } from '@/app/api/login/route'
import { db } from '@/lib/db'

describe('POST /api/login', () => {
  beforeEach(async () => {
    await db.users.create({
      data: { email: 'test@example.com', password: 'hash...' }
    })
  })

  it('returns token on valid credentials', async () => {
    const request = new Request('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.token).toBeDefined()
  })

  it('returns 401 on invalid credentials', async () => {
    const request = new Request('http://localhost/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrong'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })
})
```

### E2E Tests (Playwright)
Test full user workflows in real browser.

**When**: Critical user flows (login, signup, purchase)
**Coverage target**: Happy path only (10-20%)
**Speed**: Slow (seconds per test)
**Tools**: Playwright

```ts
// __tests__/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can login with valid credentials', async ({ page }) => {
  await page.goto('/login')
  
  // Fill form
  await page.fill('[name=email]', 'test@example.com')
  await page.fill('[name=password]', 'password123')
  
  // Submit
  await page.click('button[type=submit]')
  
  // Verify redirect
  await expect(page).toHaveURL('/dashboard')
  
  // Verify page content
  await expect(page.locator('h1')).toContainText('Dashboard')
})

test('user sees error on invalid credentials', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=email]', 'test@example.com')
  await page.fill('[name=password]', 'wrong')
  await page.click('button[type=submit]')
  
  // Error message appears
  await expect(page.locator('[role=alert]')).toContainText('Invalid credentials')
  
  // Still on login page
  await expect(page).toHaveURL('/login')
})
```

---

## Setup

### Jest Config
```js
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### Jest Setup
```js
// jest.setup.js
import '@testing-library/jest-dom'

// Mock next/navigation for tests
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      pathname: '/',
    }
  },
  usePathname() {
    return '/'
  },
}))
```

### Playwright Config
```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
```

---

## Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-run on file change)
npm run test:watch

# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="renders"

# Coverage report
npm run test:coverage
```

With Docker:
```bash
docker-compose exec app npm test
docker-compose exec app npm run test:watch
```

---

## Coverage Targets

| Type | Target | Priority |
|------|--------|----------|
| Utilities/Hooks | 90%+ | High |
| Components | 80%+ | High |
| API routes | 80%+ | High |
| Pages/Layouts | 50%+ | Medium |
| E2E flows | 10-20% | Medium |

**Don't obsess over 100%** — Focus on critical paths.

---

## Testing Best Practices

### Do
✅ Test behavior, not implementation
✅ Use semantic queries (`getByRole`, `getByLabelText`)
✅ Test user interactions (`userEvent.click()`)
✅ Mock external APIs/services
✅ Test error cases
✅ Keep tests simple and focused

### Don't
❌ Test React internals (hooks, state)
❌ Use `getByTestId` as first choice
❌ Test third-party libraries
❌ Create huge test files (>100 lines)
❌ Skip error case testing
❌ Snapshot tests (brittle)

---

## Mocking

### Mock External API
```ts
jest.mock('@/lib/api', () => ({
  fetchUsers: jest.fn(),
}))

import { fetchUsers } from '@/lib/api'

it('displays users', async () => {
  (fetchUsers as jest.Mock).mockResolvedValue([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ])

  render(<UserList />)
  await expect(screen.getByText('Alice')).toBeInTheDocument()
})
```

### Mock Database
```ts
import { db } from '@/lib/db'

jest.mock('@/lib/db', () => ({
  db: {
    users: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

it('creates user', async () => {
  (db.users.create as jest.Mock).mockResolvedValue({
    id: 1,
    email: 'test@example.com'
  })

  const user = await createUser('test@example.com')
  expect(user.email).toBe('test@example.com')
})
```

---

## CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build
      
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Common Issues

### Tests Hang
**Cause**: Async operation not awaited
**Fix**: Use `async/await` or `.then()` consistently

```tsx
// ❌ Bad — test finishes before fetch completes
it('loads data', () => {
  fetchData() // Not awaited
  expect(screen.getByText('data')).toBeInTheDocument()
})

// ✅ Good
it('loads data', async () => {
  render(<DataComponent />)
  await waitFor(() => {
    expect(screen.getByText('data')).toBeInTheDocument()
  })
})
```

### Flaky E2E Tests
**Cause**: Race conditions, timing issues
**Fix**: Use explicit waits, avoid `setTimeout`

```ts
// ❌ Bad
page.click('button')
await page.goto('/next-page') // May race

// ✅ Good
page.click('button')
await expect(page).toHaveURL('/next-page')
```

---

## Test File Organization

```
__tests__/
├── unit/
│   ├── Button.test.tsx
│   ├── useAuth.test.ts
│   └── formatDate.test.ts
├── integration/
│   ├── api/
│   │   ├── login.test.ts
│   │   └── users.test.ts
│   └── workflows/
│       └── auth-flow.test.ts
└── e2e/
    ├── login.spec.ts
    ├── signup.spec.ts
    └── dashboard.spec.ts
```

---

**Last Updated**: 2026-06-17  
**Coverage Target**: 80%+ unit, 50%+ integration, critical paths E2E
