# Git Conventions

## Rules

- All commits: Conventional Commits format, imperative mood, first line ≤ 72 chars
- Never commit feature code directly to `main`
- Branch from `main`, PR back to `main`

## Branch Format

```
<type>/<short-description>
```

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `perf`, `style`, `test`, `ci`

## Commit Format

```
<type>: <imperative description>
```

Add detail with a second `-m` when needed:

```bash
git commit -m "<type>: <description>" -m "<body>"
```

## Workflow

```bash
git checkout -b feat/your-feature
# develop + commit
git push origin feat/your-feature
# PR → merge to main
```

## Type Reference

- `feat` — new feature
- `fix` — bug fix
- `chore` — dependencies, config, maintenance
- `style` — formatting only, no logic change
- `refactor` — restructure, no behavior change
- `docs` — documentation
- `perf` — performance optimization
- `test` — tests
- `ci` — CI/CD config