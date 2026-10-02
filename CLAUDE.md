# Wise Man

Local-first personal finance app for iOS and Android; every amount lives in SQLite on
the device, so a bad migration or a wrong total loses someone's books.

## Stack

- Expo SDK 57 · React Native 0.86 · TypeScript · Expo Router
- expo-sqlite + Drizzle · Zustand
- StyleSheet · lucide-react-native
- Package manager: **npm**

## Commands

| Purpose                     | Command                    |
| --------------------------- | -------------------------- |
| Install                     | `npm install`              |
| Build and run on iOS        | `npm run ios`              |
| Metro only (app installed)  | `npm start`                |
| Types                       | `npx tsc --noEmit`         |
| Lint                        | `npm run lint`             |
| Format                      | `npm run format`           |
| Migration after schema edit | `npx drizzle-kit generate` |

There are no tests. Check UI changes against a simulator screenshot
(`xcrun simctl io booted screenshot <path>`).

## Structure

`app/` routes · `components/` atoms → molecules → organisms, imports flow one way ·
`constants/` design tokens · `db/` schema, migrations, the only SQL · `stores/` Zustand ·
`types/` shared types · `utils/` pure functions

## Rules

- English UI only, no i18n.
- No hardcoded colors, font sizes, or spacing: use `COLORS`, `FONT_SIZES`, `SPACING`
  from `constants/`. Spacing is a 4px scale; add a step there rather than a literal.
- Icons: `lucide-react-native` only, never emoji.
- Styles: `StyleSheet.create`; inline only for dynamic values.
- Money is integer cents; dates are `YYYY-MM-DD` text.
- Derive, don't store: a stored total can disagree with its rows.
- SQL stays in `db/`. Screens and components go through `stores/`; only
  `app/_layout.tsx` touches `db/`, to run migrations at launch.
- Run `npx tsc --noEmit` and `npm run lint` before every commit.

## Commits

- Conventional Commits, `type(scope): description`, imperative, straight to `main`.
- One change per commit. Subject and every body line ≤ 72 characters.
- Body only for the why the diff cannot show; skip it when the diff says it all.
- Check `git status` and `git diff` first. Never commit secrets. Never push.

## Gotchas

- Never hand-edit `db/migrations/`. Edit `db/schema.ts`, then run
  `npx drizzle-kit generate`; migrations are bundled and applied at launch.
- `npm run format` also reformats `db/migrations/`; do not commit that part.
- Sample data is dev-only, from the `...` menu on Home (`db/seed.ts`).
- A transfer is two rows in the `transfer` category; every total skips it.

## Read these only when relevant

- `docs/data.md`: why the data is shaped the way it is (cents, dates, balances,
  transfers, recurring bills). Read before touching `db/` or any total.

## When unsure

If a change touches more than three files, or the schema, propose the approach before
writing code.
