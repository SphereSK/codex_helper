# Security Policy

## Reporting a Vulnerability

**Please do NOT open a public issue for security vulnerabilities.**

Instead, email: `security@example.com`

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

**We will:**
- Acknowledge receipt within 24 hours
- Investigate and confirm
- Develop fix
- Release patch
- Credit you (if desired)

---

## Security Practices

### Authentication

- ✅ JWT tokens with expiration
- ✅ Secure password hashing (bcryptjs)
- ✅ HTTPOnly cookies (no XSS)
- ✅ CSRF protection
- ✅ Rate limiting on auth endpoints

### Database

- ✅ Parameterized queries (Prisma)
- ✅ No SQL injection possible
- ✅ Encrypted sensitive fields
- ✅ Regular backups

### API Security

- ✅ HTTPS only (TLS 1.2+)
- ✅ Input validation
- ✅ Output encoding
- ✅ Rate limiting
- ✅ CORS properly configured
- ✅ Security headers:
  - CSP (Content Security Policy)
  - HSTS (HTTP Strict Transport Security)
  - X-Frame-Options (Clickjacking)
  - X-Content-Type-Options (MIME sniffing)

### Code

- ✅ No hardcoded secrets
- ✅ Environment variables for config
- ✅ Dependency security scanning
- ✅ Code review process
- ✅ Static analysis

### Infrastructure

- ✅ Network isolation
- ✅ Firewall rules
- ✅ SSH key authentication
- ✅ Regular updates/patches
- ✅ Monitoring and alerting

---

## Dependencies

### Managing Dependencies

Keep dependencies updated:

```bash
# Check for vulnerabilities
npm audit

# Update packages
npm update

# Check outdated
npm outdated
```

### Security Scanning

Automated scanning via:
- npm audit
- Dependabot
- GitHub security alerts

### Pinning Versions

In `package.json`, use:
```json
{
  "dependencies": {
    "package-name": "^1.2.3"
  }
}
```

- `^1.2.3` — Minor/patch updates (recommended)
- `~1.2.3` — Patch updates only
- `1.2.3` — Exact version (lock dependencies)

---

## Secrets Management

### ✅ Do

- Use environment variables for secrets
- Store `.env.local` in `.gitignore`
- Use secret management tools in production
- Rotate secrets regularly
- Use HTTPOnly, Secure, SameSite cookies

### ❌ Don't

- Commit `.env` files
- Hardcode API keys
- Log sensitive data
- Store passwords in plaintext
- Use old/weak algorithms

### Environment Variables

Protected secrets:
```env
DATABASE_PASSWORD=xxx
API_KEY=xxx
AUTH_SECRET=xxx
JWT_SECRET=xxx
OAUTH_SECRET=xxx
```

Public variables (can be exposed):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=UA-xxx
```

---

## Incident Response

### If You Discover Vulnerability

1. **Don't exploit** — Stop immediately
2. **Report privately** — Email security team
3. **Provide details** — Steps to reproduce
4. **Wait for fix** — Don't disclose publicly

### If We Discover Vulnerability

1. **Assess severity** — Critical/High/Medium/Low
2. **Develop fix** — Create patch
3. **Test fix** — Verify no side effects
4. **Release patch** — Deploy to production
5. **Notify users** — Send security advisory
6. **Postmortem** — Learn and improve

---

## Security Checklist

### Before Deployment

- [ ] All dependencies updated (`npm audit`)
- [ ] Secrets not in code/git
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Security headers set
- [ ] Database backups enabled
- [ ] Logging configured
- [ ] Monitoring active
- [ ] Rate limiting enabled
- [ ] Input validation in place

### Regular Tasks

- [ ] Monthly: Run `npm audit`
- [ ] Monthly: Review access logs
- [ ] Quarterly: Security review
- [ ] Annually: Penetration testing

---

## Compliance

### Standards

- OWASP Top 10
- CWE/SANS Top 25
- GDPR (data privacy)
- PCI-DSS (payment data)

### Data Handling

- Minimal data collection
- User consent for tracking
- Data deletion on request
- Secure data deletion
- Encryption in transit and at rest

---

## Contact

**Security Email**: `security@example.com`  
**PGP Key**: [Link to PGP key]  
**Security Hotline**: +1-XXX-XXX-XXXX

---

**Last Updated**: 2026-06-17  
**Status**: Active
