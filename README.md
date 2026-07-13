# Bug_Tester_Two

Lightweight **BoardLite** message board used to exercise GitHub Actions:

- **CI** — typecheck + Jest
- **CodeQL Advanced** — SAST / taint tracking
- **Snyk Security** — Code (SAST), Open Source (SCA), IaC

## Run locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run typecheck
npm test
```

## FEATURE_MAP — intentional weak spots

| Feature | Route / module | Weakness | Likely caught by |
|---------|----------------|----------|------------------|
| Search | `/api/search`, `services/html.ts` | Reflected XSS (unsanitized HTML) | CodeQL, Snyk Code |
| Post / bio | `/api/posts`, `/api/bio` | XSS via echoed HTML | CodeQL, Snyk Code |
| Login lookup | `/api/user`, `services/sqlUser.ts` | SQL injection (mysql2) | CodeQL, Snyk Code |
| Admin logs/report | `/api/logs/search`, `/api/reports/run` | Command injection (`exec`) | CodeQL, Snyk Code |
| Files | `/api/files/*`, `services/pathReader.ts` | Path traversal | CodeQL, Snyk Code |
| URL preview / webhook | `/api/proxy`, `/api/webhook` | SSRF | CodeQL, Snyk Code |
| Preferences | `/api/preferences`, `services/merge.ts` | Prototype pollution + old `lodash@4.17.20` | CodeQL/Snyk Code + **Snyk SCA** |
| Formula | `/api/evaluate`, `services/evalFilter.ts` | Code injection (`eval` / `Function`) | CodeQL, Snyk Code |
| Status | `/api/status`, `services/secrets.ts` | Hardcoded secrets | CodeQL, Snyk Code |
| Container | `Dockerfile` | Root user + secrets in `ENV` | **Snyk IaC** |

Comments marked `// INTENTIONAL: weak for security Action testing` identify planted issues.

## Note

Do not deploy this app. Weak patterns exist only to compare Action findings.
