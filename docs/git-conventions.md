# Git Commit Conventions

> All commits must follow Conventional Commits format.
> **Every new feature must branch off `main` — never commit feature code directly to `main`.**

## Branch Naming

```
feat/track-transaction
feat/events-list
fix/portfolio-balance
chore/setup-drizzle-orm
```

## Development Flow

1. Branch from `main`: `git checkout -b feat/your-feature`
2. Develop + commit (follow Conventional Commits)
3. Push: `git push origin feat/your-feature`
4. Open PR → merge back to `main`

## Commit Format

```
<type>: <description>
```

Examples:
```
feat: add dark mode toggle
fix: resolve tab bar icon alignment issue
chore: update expo sdk to 54
```

## Commit Types

| Type       | Usage                        | Example                                    |
|------------|------------------------------|--------------------------------------------|
| `feat`     | New feature                  | `feat: add track transaction modal`        |
| `fix`      | Bug fix                      | `fix: resolve balance calculation error`   |
| `chore`    | Maintenance, dependency updates | `chore: update drizzle-orm to latest`   |
| `style`    | Code formatting (no logic change) | `style: fix indentation in HomeScreen` |
| `refactor` | Refactor (no behavior change) | `refactor: simplify transaction query logic` |
| `docs`     | Documentation updates        | `docs: update README setup guide`          |
| `perf`     | Performance optimization     | `perf: optimize SQLite query for analysis` |
| `test`     | Tests                        | `test: add unit tests for recurring logic` |
| `ci`       | CI/CD config                 | `ci: add GitHub Actions workflow`          |

## Best Practices

- Use **imperative mood**: `fix bug` ✅, `fixed bug` ❌
- Keep first line under **50–72 characters**
- Use a second `-m` for details:

```bash
git commit -m "feat: add analysis pie chart" -m "Shows expense breakdown by category. Uses react-native-chart-kit with monthly filter."
```

## Common Examples for Wise Man

```bash
feat: add track transaction modal
feat: implement events list screen
fix: resolve portfolio balance not updating
chore: install lucide-react-native
refactor: extract db repository layer
style: adjust tab bar spacing for iOS
perf: cache monthly transaction query in zustand
```
