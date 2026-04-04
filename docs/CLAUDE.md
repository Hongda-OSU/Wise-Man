# Wise Man — Personal Finance App

## Project Overview
Cross-platform personal finance app (iOS + Android) built with Expo + React Native + TypeScript.
Data stored locally on device (SQLite).

## Tech Stack
- Framework: Expo SDK + React Native
- Language: TypeScript
- Router: Expo Router
- Database: SQLite (expo-sqlite) + Drizzle ORM
- State: Zustand
- Styling: NativeWind (Tailwind CSS)
- Icons: lucide-react-native (SVG only, no emoji)
- Fonts: DM Sans (UI), Instrument Serif (app name), Manrope (numbers)

## Documentation
All specs are in the `docs/` folder:
- `docs/design-system.md` — Colors, fonts, spacing, category icons
- `docs/pages.md` — Page specs, layouts, interactions for every screen
- `docs/git-conventions.md` — Commit format, branch naming, dev flow

**Always read these docs before building any UI component.**
**Always follow git conventions for commits and branching.**

## Key Design Rules
- App language: English only, no i18n
- All icons: SVG format via `lucide-react-native`, never emoji
- Primary color: Forest Green `#1A2E28`
- Background: Warm Cream `#F0EFE9`
- Income color: `#27AE72`
- Expense color: `#E04F3E`
- Font for money amounts: Manrope Bold/ExtraBold
- Spacing base unit: 4px

## Project Structure
```
app/              # Expo Router pages
  (tabs)/         # Tab layout (Home, Portfolio, Events, Analysis)
  track.tsx       # Stack page (not a tab)
components/       # Reusable components
constants/        # Colors, fonts, categories
db/               # Drizzle schema, migrations
stores/           # Zustand stores
docs/             # Design documentation
```