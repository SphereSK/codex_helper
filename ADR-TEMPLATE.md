# ADR Template — Architecture Decision Records

Template for documenting major technical decisions.

---

## What is an ADR?

Record of an **important architectural decision** made during development.

**Why?**
- Documents the "why" behind choices
- Helps future developers understand context
- Provides rationale for technical debt
- Enables informed discussions about changes

**Examples:**
- Why we chose Next.js over Express
- Why we use Prisma instead of raw SQL
- Why we deploy on Docker instead of Vercel
- Why we use PostgreSQL instead of MongoDB

---

## Template

Copy this template for each major decision.

**Filename:** `docs/adr/ADR-001-use-nextjs.md`

```markdown
# ADR-001: Use Next.js for Full-Stack Framework

**Date:** 2026-06-17  
**Status:** Accepted  
**Author:** Team Lead  
**Reviewers:** @alice, @bob

---

## Context

We need to choose a full-stack JavaScript framework for a new web application.

Key requirements:
- Server-side rendering for SEO
- Fast development iteration
- TypeScript support
- Built-in API routes
- Good developer experience

---

## Decision

We will use **Next.js 14+** with the App Router.

---

## Rationale

### Why Next.js?

1. **Complete framework**
   - Full-stack: frontend + backend
   - Covers all needs in one tool
   - Reduces context switching

2. **Built for performance**
   - ISR (Incremental Static Regeneration)
   - Image optimization out of the box
   - Automatic code splitting
   - Edge functions for global deployment

3. **Developer experience**
   - File-based routing (intuitive)
   - Fast refresh (instant feedback)
   - TypeScript first-class support
   - Excellent documentation

4. **Team familiarity**
   - Multiple team members experienced
   - Large community (Stack Overflow, examples)
   - Frequent updates and improvements

---

## Alternatives Considered

### Alternative 1: Express.js + React

**Pros:**
- Lightweight, minimal overhead
- Maximum flexibility
- Learn two technologies deeply

**Cons:**
- More boilerplate code
- Need to integrate frontend/backend
- More deployment complexity
- Requires two separate servers

**Why rejected:** Too much setup for team of 3. Next.js handles it better.

### Alternative 2: Remix

**Pros:**
- Better data loading patterns
- Focus on web fundamentals
- Smaller bundle for simple apps

**Cons:**
- Smaller ecosystem
- Fewer third-party integrations
- Less mature (though improving)
- Steeper learning curve

**Why rejected:** Next.js more established. Team already knows it.

### Alternative 3: Svelte + SvelteKit

**Pros:**
- Incredibly lightweight
- Smaller bundle size
- Enjoyable to write

**Cons:**
- Much smaller community
- Fewer job opportunities
- Harder to hire for
- Limited integrations

**Why rejected:** Risk of not finding developers to maintain code.

---

## Consequences

### Positive
✅ Faster development (no setup needed)
✅ Better SEO (built-in SSR)
✅ Easier deployment (Vercel or Docker)
✅ Team productivity (everyone knows it)
✅ Scaling path (handles both startups and enterprises)

### Negative
❌ Lock-in to Vercel ecosystem (if using their platform)
❌ Some overhead for very simple projects
❌ Requires Node.js runtime
❌ Complexity if maximum control needed

### Risks
⚠️ **Framework deprecation** — Next.js has been around for 8+ years. Low risk.
⚠️ **Breaking changes** — Next.js has good backwards compatibility. Mitigated by staying 1-2 versions behind.
⚠️ **Performance at scale** — Need monitoring for very large datasets. Mitigated by caching strategy.

---

## Implementation

### Stack
```
Next.js 14+ (frontend + API routes)
TypeScript (type safety)
Tailwind CSS (styling)
Prisma (database ORM)
PostgreSQL (database)
Docker (deployment)
```

### Configuration
```
✓ App Router (not Pages Router)
✓ TypeScript enabled
✓ ESLint + Prettier configured
✓ Pre-commit hooks for code quality
✓ Database migrations via Prisma
```

### Learning Resources
- [Next.js Docs](https://nextjs.org/docs)
- Team training session (scheduled)
- Example app (in this repo)

---

## Validation

How will we know this decision is working?

- [ ] Application builds and deploys successfully
- [ ] Team comfortable with development process
- [ ] Performance metrics meet targets (CLS < 0.1, LCP < 2.5s)
- [ ] Deploy time < 5 minutes
- [ ] No critical bugs from framework choice

---

## Related Decisions

- **ADR-002:** Database choice (PostgreSQL + Prisma)
- **ADR-003:** Deployment strategy (Docker on VPS)
- **ADR-004:** API authentication (NextAuth.js)

---

## Revisit Date

Review this decision in **12 months** (June 2027) to assess:
- Is the team satisfied?
- Are there better alternatives?
- Has Next.js evolved in unexpected ways?
- Should we change course?

---

## References

- [Next.js vs Express comparison](https://example.com)
- [Framework benchmarks](https://example.com)
- Internal discussion: #123 (Slack thread)

---

## Sign-Off

- **Agreed by:** Team Lead (@lead)
- **Date:** 2026-06-17
- **Team:** 3 developers

---
```

---

## ADR Index

Create `docs/adr/INDEX.md`:

```markdown
# Architecture Decision Records

| ID | Title | Status | Date |
|----|-------|--------|------|
| 001 | Use Next.js for full-stack framework | Accepted | 2026-06-17 |
| 002 | Use PostgreSQL + Prisma for database | Accepted | 2026-06-17 |
| 003 | Deploy via Docker on VPS | Accepted | 2026-06-17 |
| 004 | Use NextAuth.js for authentication | Accepted | 2026-06-18 |
| 005 | Use Tailwind CSS for styling | Accepted | 2026-06-18 |

## Status Legend
- **Proposed** — Under discussion, not yet decided
- **Accepted** — Decided and implemented
- **Deprecated** — Superseded by newer decision
- **On Hold** — Paused pending more information
```

---

## Guidelines

### When to Write an ADR
- Choosing major technology (framework, database, hosting)
- Major architectural change
- Trade-off between two approaches
- Decision that affects multiple teams/projects
- Something future developers should understand "why"

### When NOT to write an ADR
- Small bug fix
- Refactoring without architectural impact
- Minor optimization
- Adding a feature within existing architecture

### Good ADRs
✅ Clear decision (yes/no, not wishy-washy)
✅ Real alternatives considered
✅ Honest about trade-offs
✅ Dated and signed off
✅ Revisited periodically

### Bad ADRs
❌ "It was cheap so we chose it"
❌ No alternatives considered
❌ Only mentions benefits, not costs
❌ No clear decision
❌ Outdated and not revisited

---

## File Organization

```
docs/
└── adr/
    ├── INDEX.md
    ├── ADR-001-use-nextjs.md
    ├── ADR-002-database-strategy.md
    ├── ADR-003-deployment-approach.md
    └── ADR-004-authentication.md
```

Keep in git, review in PR before merging.

---

## Review Checklist

When reviewing an ADR:

- [ ] Decision is clear (yes/no answer)
- [ ] Context explains the problem
- [ ] Rationale is honest about trade-offs
- [ ] At least 2-3 alternatives considered
- [ ] Consequences listed (positive + negative)
- [ ] Implementation plan clear
- [ ] Team agrees on decision
- [ ] Revisit date set

---

**Template Version**: 2026-06-17  
**Based on**: [ADR by Michael Nygard](https://adr.github.io/)
