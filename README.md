# Wise Man

A cross-platform personal finance app for iOS and Android. Log income and expenses in
seconds, and keep every record on your own device.

- **Fast** — one transaction takes a few taps
- **Local-first** — data lives in on-device SQLite, nothing leaves the phone
- **Cross-platform** — one codebase, iOS and Android

## Status

Early prototype. The UI for the two main screens is built, but **nothing is saved yet** —
the app runs on mock data and the database layer does not exist.

| Screen             | State                                      |
| ------------------ | ------------------------------------------ |
| Home               | UI complete, reads `mocks/transactions.ts` |
| Track (add)        | UI complete, confirm button is a no-op     |
| Transaction Detail | Not started                                |
| Portfolio          | Placeholder                                |
| Events             | Placeholder                                |
| Analysis           | Placeholder                                |

## v1 Scope

v1 is a plain expense tracker — **Home, Track, and Transaction Detail**, backed by real
SQLite. Portfolio, Events, and Analysis are out of scope until that works end to end.

1. Drizzle schema and migrations in `db/`
2. Zustand store in `stores/`, wired to the database
3. Track saves a transaction; Home reads it back
4. Transaction Detail with edit and delete
5. Real month switching on Home

## Tech Stack

| Layer     | Choice                               |
| --------- | ------------------------------------ |
| Framework | Expo SDK 54 + React Native 0.81      |
| Language  | TypeScript                           |
| Routing   | Expo Router                          |
| Database  | expo-sqlite + Drizzle ORM            |
| State     | Zustand                              |
| Styling   | StyleSheet                           |
| Icons     | lucide-react-native                  |
| Fonts     | DM Sans · Instrument Serif · Manrope |

## Getting Started

Requires Node 20+, and Xcode (iOS) or Android Studio (Android).

```bash
npm install
npm run ios       # build and launch on the iOS simulator
npm run android   # Android
npm start         # Metro only, if the app is already installed
```

The first build takes a few minutes; after that, JS changes hot-reload.

Most of the app does run in Expo Go, since every native module it uses ships in the Expo
Go runtime. The exception is the swipe-to-edit and swipe-to-delete actions on the
transaction list: `ReanimatedSwipeable` needs the native build. Treat `npm run ios` as
the supported way to run this project and Expo Go as a convenience with a known hole.

`expo start` assumes Expo Go whenever `expo-dev-client` is absent, which it is here, so
it will try to open Expo Go when you press `i`. Press `s` to switch it to the development
build, or just use `npm run ios`.

### iOS: install the platform, not just Xcode

Xcode ships the SDK but downloads the iOS platform and simulator runtime separately, and
an Xcode update leaves the old runtime behind. When they do not match, the build fails
with `xcodebuild exited with error code 70` and `iOS <version> is not installed`, even
though the simulator is running and `simctl` lists it.

```bash
xcrun simctl list runtimes            # what is installed
xcodebuild -showsdks | grep iOS       # what Xcode expects
```

If the runtime version is behind the SDK version, install the matching one — a several-GB
download:

```bash
sudo xcodebuild -runFirstLaunch
xcodebuild -downloadPlatform iOS
```

## Project Structure

```
app/            Expo Router routes; (tabs)/ holds the tab screens
components/     Atomic Design: atoms → molecules → organisms → templates
constants/      Colors, fonts, spacing, categories — the design system
db/             Drizzle schema and migrations (not created yet)
stores/         Zustand stores (not created yet)
hooks/          Shared hooks
types/          Shared types and constant unions
utils/          Formatting and date helpers
```

## Conventions

Design tokens live in `constants/` — read them there rather than copying hex values.
Commits follow Conventional Commits and land directly on `main`.
See [CLAUDE.md](CLAUDE.md) for the short version.
