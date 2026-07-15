# Bug_Tester_Two

**BoardLite** is a lightweight message-board app used to exercise three review/check tools in parallel:

| Tool | How it runs |
|------|-------------|
| **CI** | GitHub Actions — ESLint, TypeScript typecheck, and Jest (parallel jobs) |
| **CodeQL** | GitHub Actions — security analysis on push/PR |
| **BugBot** | Cursor GitHub app — reviews pull requests (not an Actions workflow) |

## Run locally

```bash
npm install
npm start
```

Open http://localhost:3000

```bash
npm run lint
npm run typecheck
npm test
```

## App features

- Paginated message feed
- Search and bio previews (HTML escaped)
- Offline user directory + JWT login stub
- Allowlisted admin reports and constrained log search
- Safe file reads under `uploads/` / `public/`
- Host-allowlisted outbound fetch / webhooks
- Preference merge and arithmetic formula evaluator (no `eval`)
- Helmet + rate limiting

## Testing the three tools together

1. Ensure BugBot is enabled for this repo in the [Cursor BugBot dashboard](https://www.cursor.com/dashboard/bugbot).
2. Open a pull request into `main`.
3. On that PR, **CI** and **CodeQL** run as Actions while **BugBot** reviews the diff.

Environment variables (optional): `JWT_SECRET`, `ALLOWED_FETCH_HOSTS`, `USE_OFFLINE_DB`, `SERVICE_NAME`, `PORT`.
