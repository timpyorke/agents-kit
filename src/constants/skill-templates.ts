import {
  Code,
  FileText,
  GitBranch,
  TestTube,
  Globe,
  Database,
  Shield,
  Package,
  type LucideIcon,
} from "lucide-react";

export interface SkillTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  agents: string[];
  content: string;
}

export const SKILL_TEMPLATES: SkillTemplate[] = [
  {
    id: "code-review",
    name: "Code Review",
    description: "Systematic code review checklist covering security, performance, readability, and best practices. Use before reviewing any PR.",
    category: "Development",
    icon: Code,
    agents: ["Claude Code", "Codex", "Cursor"],
    content: `# Code Review Skill

## When to Use
Use this skill when reviewing pull requests, code diffs, or performing code audits.

## Review Checklist

### 1. Security
- Check for injection vulnerabilities (SQL, XSS, command injection)
- Verify input validation and sanitization
- Look for hardcoded secrets or credentials
- Check authentication/authorization logic
- Review data exposure (APIs, logs, error messages)

### 2. Performance
- Identify N+1 query patterns
- Check for unnecessary re-renders or recomputations
- Look for memory leaks (event listeners, closures, subscriptions)
- Verify efficient data structures are used
- Check pagination for list queries

### 3. Readability & Maintainability
- Names are clear and descriptive
- Functions do one thing well
- No magic numbers or strings
- Appropriate abstraction level
- Comments explain "why", not "what"

### 4. Error Handling
- Errors are properly caught and handled
- User-facing error messages are helpful
- No silent failures
- Edge cases are covered

### 5. Testing
- Critical paths have tests
- Test descriptions are clear
- Edge cases are tested
- No fragile test patterns (testing implementation details)

## Output Format
Provide findings as:
- 🔴 **Must fix**: Security or correctness issues
- 🟡 **Should fix**: Performance or maintainability concerns  
- 🟢 **Nice to have**: Style or minor improvements
`,
  },
  {
    id: "api-docs",
    name: "API Documentation",
    description: "Generate comprehensive API documentation with request/response schemas, examples, and error codes.",
    category: "Documentation",
    icon: FileText,
    agents: ["Claude Code", "Gemini CLI", "Codex"],
    content: `# API Documentation Skill

## When to Use
Use when documenting REST APIs, GraphQL endpoints, or any interface definition.

## Template

### Endpoint: \`[METHOD] /path\`

**Description**: What this endpoint does and when to use it.

**Authentication**: Required/Optional — which token type

**Request**
\`\`\`json
{
  "field": "type — description"
}
\`\`\`

**Response** (200 OK)
\`\`\`json
{
  "field": "type — description"
}
\`\`\`

**Error Responses**
| Status | Code | Description |
|--------|------|-------------|
| 400 | INVALID_INPUT | When... |
| 401 | UNAUTHORIZED | When... |
| 404 | NOT_FOUND | When... |

## Conventions
- Use kebab-case for path parameters
- Use camelCase for JSON fields
- Include pagination for list endpoints
- Document rate limits
`,
  },
  {
    id: "git-workflow",
    name: "Git Workflow",
    description: "Standardized git conventions: branch naming, commit messages, PR templates, and release process.",
    category: "DevOps",
    icon: GitBranch,
    agents: ["Claude Code", "Codex", "Cursor", "Gemini CLI"],
    content: `# Git Workflow Skill

## When to Use
Use when creating branches, writing commits, managing PRs, or tagging releases.

## Branch Naming
- \`feat/description\` — New feature
- \`fix/description\` — Bug fix
- \`refactor/description\` — Code restructuring
- \`docs/description\` — Documentation changes
- \`chore/description\` — Maintenance tasks

## Commit Messages (Conventional Commits)
\`\`\`
type(scope): description

body (optional)

footer (optional)
\`\`\`

**Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

**Examples**:
- \`feat(auth): add OAuth2 login flow\`
- \`fix(api): handle null response from user service\`
- \`refactor(db): extract query builder into separate module\`

## PR Template
### Summary
What changes and why.

### Changes
- Bullet list of key changes

### Testing
How to test these changes.

### Checklist
- [ ] Tests pass
- [ ] No console errors
- [ ] Documentation updated
`,
  },
  {
    id: "testing",
    name: "Testing Strategy",
    description: "Guidelines for writing unit, integration, and e2e tests with coverage strategies and mocking patterns.",
    category: "Development",
    icon: TestTube,
    agents: ["Claude Code", "Codex", "Cursor"],
    content: `# Testing Strategy Skill

## When to Use
Use when writing tests, setting up testing infrastructure, or reviewing test quality.

## Testing Pyramid
1. **Unit Tests** (70%) — Fast, isolated, test single functions/modules
2. **Integration Tests** (20%) — Test module interactions, use real dependencies
3. **E2E Tests** (10%) — Test critical user flows end-to-end

## Unit Test Structure (AAA)
\`\`\`
// Arrange
const input = prepareTestData();

// Act
const result = functionUnderTest(input);

// Assert
expect(result).toEqual(expected);
\`\`\`

## What to Test
- Happy path
- Edge cases (empty, null, boundary values)
- Error conditions
- Integration points (with mocks)

## What NOT to Test
- Framework internals
- Trivial getters/setters
- Implementation details

## Mocking Rules
- Mock external dependencies (APIs, databases, file system)
- Don't mock the system under test
- Keep mocks simple and focused
`,
  },
  {
    id: "responsive-web",
    name: "Responsive Web Design",
    description: "Mobile-first responsive design patterns, breakpoints, accessibility, and performance best practices.",
    category: "Design",
    icon: Globe,
    agents: ["Cursor", "Antigravity", "Claude Code"],
    content: `# Responsive Web Design Skill

## When to Use
Use when building or reviewing UI layouts, components, or pages that need to work across devices.

## Breakpoints
- **Mobile**: < 640px (default)
- **Tablet**: 640px — 1024px
- **Desktop**: 1024px — 1440px
- **Wide**: > 1440px

## Principles
1. **Mobile First**: Start with mobile layout, enhance upward
2. **Fluid Layouts**: Use %, fr, min/max over fixed px
3. **Flexible Media**: Images use max-width: 100%
4. **Touch Targets**: Minimum 44x44px for interactive elements

## Accessibility Checklist
- Sufficient color contrast (4.5:1 for text)
- Focus indicators visible
- Keyboard navigable
- Screen reader friendly (semantic HTML, ARIA labels)
- Reduced motion support (\`prefers-reduced-motion\`)

## Performance
- Lazy load below-fold content
- Use system fonts or subset web fonts
- Optimize images (WebP, AVIF)
- Avoid layout shifts (set dimensions on images/embeds)
`,
  },
  {
    id: "database-schema",
    name: "Database Schema Design",
    description: "Relational database schema design patterns, normalization, indexing strategies, and migration best practices.",
    category: "Development",
    icon: Database,
    agents: ["Claude Code", "Codex", "Gemini CLI"],
    content: `# Database Schema Design Skill

## When to Use
Use when designing tables, writing migrations, optimizing queries, or reviewing schema changes.

## Design Principles
1. **Normalization**: 3NF for most cases, denormalize deliberately for read performance
2. **Primary Keys**: Use UUID or auto-increment integers
3. **Timestamps**: Always include created_at, updated_at
4. **Soft Delete**: Use deleted_at instead of hard deletes for important data
5. **Foreign Keys**: Enforce referential integrity at DB level

## Indexing Strategy
- Index all foreign keys
- Index columns used in WHERE, JOIN, ORDER BY
- Use composite indexes for multi-column queries
- Don't over-index (slows writes)

## Naming Conventions
- Tables: snake_case plural (users, orders, order_items)
- Columns: snake_case (created_at, user_id, total_amount)
- Indexes: idx_table_columns (idx_users_email)
- Foreign keys: fk_table_column (fk_orders_user_id)

## Migration Rules
- Always provide up AND down migrations
- Make migrations backward compatible
- Test migrations on a copy of production data
`,
  },
  {
    id: "security-audit",
    name: "Security Audit",
    description: "Application security review covering OWASP Top 10, dependency vulnerabilities, and secure coding practices.",
    category: "Security",
    icon: Shield,
    agents: ["Claude Code", "Codex"],
    content: `# Security Audit Skill

## When to Use
Use when auditing code for security issues, before deployment, or after receiving security reports.

## OWASP Top 10 Checks

### A01 — Broken Access Control
- [ ] Authorization checks on all endpoints
- [ ] Users can't access other users' resources
- [ ] Admin routes properly protected

### A02 — Cryptographic Failures
- [ ] Passwords hashed with bcrypt/argon2
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced
- [ ] No sensitive data in logs

### A03 — Injection
- [ ] Parameterized queries for all DB access
- [ ] Input validation on all user inputs
- [ ] No eval() or dynamic code execution

### A04 — Insecure Design
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout after failed attempts
- [ ] Secure session management

### A07 — Identification & Auth Failures
- [ ] Strong password policy
- [ ] MFA available for sensitive operations
- [ ] Session tokens properly validated

## Quick Wins
- Update dependencies regularly
- Set security headers (CSP, X-Frame-Options, etc.)
- Enable CORS only for trusted origins
`,
  },
  {
    id: "project-setup",
    name: "Project Setup",
    description: "Quick project scaffolding with recommended tooling, folder structure, linting, and CI/CD configuration.",
    category: "Development",
    icon: Package,
    agents: ["Claude Code", "Codex", "Cursor", "Gemini CLI"],
    content: `# Project Setup Skill

## When to Use
Use when starting a new project or onboarding to an existing codebase.

## Recommended Structure
\`\`\`
project/
├── src/
│   ├── components/    # UI components
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilities and helpers
│   ├── services/      # API calls and external services
│   ├── types/         # TypeScript types/interfaces
│   └── pages/         # Route-level components
├── tests/
│   ├── unit/
│   └── integration/
├── docs/
│   └── api/
├── .eslintrc
├── .prettierrc
├── tsconfig.json
├── README.md
└── package.json
\`\`\`

## Essential Config
- **ESLint** — Code quality rules
- **Prettier** — Consistent formatting
- **Husky + lint-staged** — Pre-commit hooks
- **TypeScript** — Strict mode enabled

## README Must Include
1. Project description
2. Getting started (prerequisites, install, run)
3. Project structure overview
4. Available scripts
5. Environment variables needed
`,
  },
];
