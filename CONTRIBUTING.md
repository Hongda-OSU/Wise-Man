# Contributing

## Branching

Work lands directly on `main`. No feature branches, no PRs — this is a solo project and
the ceremony costs more than it returns.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/). Format:

```
<type>(<scope>): <subject>

<body>
```

### Types

| Type       | Use for                                              |
| ---------- | ---------------------------------------------------- |
| `feat`     | A new screen, or a new capability in an existing one |
| `fix`      | Something was broken and now isn't                   |
| `docs`     | README, CLAUDE.md, this file                         |
| `refactor` | Restructuring with no behaviour change               |
| `chore`    | Deps, native config, tooling                         |
| `style`    | Formatting only — no logic touched                   |

### Scopes

Optional, but use one when the change belongs to a clear area.

Screens: `home`, `track`, `detail`, `portfolio`, `events`, `analysis`
Layers: `db`, `stores`, `components`, `constants`, `types`
Other: `deps`, `ios`, `config`

### Subject line

- Imperative mood — "add", not "added" or "adds"
- No capital first letter, no trailing period
- Under 72 characters
- Describe the change, not the file that changed

```
feat(track): save the transaction to sqlite on confirm
fix(home): group transactions by local date, not utc
chore(deps): update expo to 54.0.36
```

### Body

Optional, but include one whenever the change isn't self-evident. Explain _why_, not
_what_ — the diff already says what. Wrap at 72 characters. A one-line fix whose reason
is unguessable is exactly the case for a body:

```
fix: remove invalid ignoreDeprecations from tsconfig

TypeScript 5.9 rejects the value "6.0", so tsc bailed while reading the
config and never typechecked anything. Nothing needed the flag.
```

AI authorship trailers (`Co-Authored-By`) are fine.

## Before committing

```sh
git status && git diff    # confirm exactly what is being staged
npm run lint
npx tsc --noEmit
npm run format            # or format:check to see the damage first
```

Then run the app and look at the change. There is no test suite, so the simulator is the
real check — and the three commands above prove almost nothing about behaviour. Layout,
gestures, and every native module fail at runtime, not at compile time.

### When a rebuild is needed

A Metro reload only picks up JavaScript. Rerun `npm run ios` after changing native
dependencies, `app.json`, or anything under `ios/` — otherwise you are testing the old
binary against new JS, which fails in confusing ways.

## Scope of a commit

One logical change per commit. A new screen and a fix to the store are two commits, even
when you wrote them in the same sitting.
