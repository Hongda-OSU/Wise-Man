# Wise Man

Cross-platform, local-first personal finance app. Expo + React Native + TypeScript.

## Stack

Expo Router · expo-sqlite + Drizzle ORM · Zustand · StyleSheet · lucide-react-native

## Structure

`app/` routes · `components/` atoms → molecules → organisms → templates · `constants/` design tokens · `db/` schema · `stores/` Zustand

## Rules

- English UI only, no i18n
- Design tokens live in `constants/` — never hardcode a color, font, or spacing value
- Icons: `lucide-react-native` SVG only, never emoji
- Styles: `StyleSheet.create`; inline only for dynamic values
- Shared types and unions go in `types/`, not inline
- Commits: Conventional Commits, imperative, ≤72 chars, straight to `main`
- Check `git status` and `git diff` before every commit
