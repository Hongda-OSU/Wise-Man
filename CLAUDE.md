# Wise Man

Cross-platform, local-first personal finance app. Expo + React Native + TypeScript.

## Stack

Expo Router · expo-sqlite + Drizzle · Zustand · StyleSheet · lucide-react-native

## Structure

`app/` routes · `components/` atoms → molecules → organisms, imports flow one way ·
`constants/` design tokens · `db/` schema, migrations, the only SQL · `stores/` Zustand

## Rules

- English UI only, no i18n
- Design tokens live in `constants/` — never hardcode a color, font, or spacing value
- Icons: `lucide-react-native` SVG only, never emoji
- Styles: `StyleSheet.create`; inline only for dynamic values
- Shared types go in `types/`, not inline
- Money is integer cents; dates are `YYYY-MM-DD` text
- SQL stays in `db/`; screens read the store
- Commits: Conventional Commits, imperative, ≤72 chars, straight to `main`
- Check `git status` and `git diff` before committing
