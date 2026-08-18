# Wise Man

A local-first personal finance app for iOS and Android. Log income and expenses in
seconds; everything stays in SQLite on the device.

## Screens

<!-- Widths are pinned because a markdown table sizes its columns by content, and
     a long heading widens its image along with it. -->

| Splash                                                           | Home                                                         | Portfolio                                                              | Events                                                           | Transaction                                                                |
| ---------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| <img src="docs/screenshots/splash.png" alt="Splash" width="150"> | <img src="docs/screenshots/home.png" alt="Home" width="150"> | <img src="docs/screenshots/portfolio.png" alt="Portfolio" width="150"> | <img src="docs/screenshots/events.png" alt="Events" width="150"> | <img src="docs/screenshots/transaction.png" alt="Transaction" width="150"> |

## Status

Create, edit, delete, and it survives a restart. Money sits in accounts that add up to a
net worth, and recurring bills post themselves.

| Screen                         | State       |
| ------------------------------ | ----------- |
| Home, Track, Portfolio, Events | Done        |
| Analysis                       | Placeholder |

Search and the profile button in the header are inert.

## Getting started

Node 20.19.4 or newer, plus Xcode or Android Studio.

```bash
npm install
npm run ios       # or npm run android
npm start         # Metro only, if the app is already installed
```

There is no web target. The first build takes a few minutes; JS changes hot-reload after
that.

**iOS build fails with `error code 70`?** Xcode downloads the iOS platform separately from
the SDK, and an update leaves the old runtime behind. Compare `xcrun simctl list runtimes`
against `xcodebuild -showsdks | grep iOS`; if the runtime is behind, run
`sudo xcodebuild -runFirstLaunch` then `xcodebuild -downloadPlatform iOS`.

## Data

- **Amounts are integer cents.** SQLite `REAL` is IEEE 754, and a ledger of floats drifts
  as it is summed — the one thing this app exists to do.
- **Dates are `TEXT` as `YYYY-MM-DD`** — the calendar day the money moved, not an instant,
  so which month a transaction falls in never depends on the reader's timezone. ISO text
  sorts chronologically and matches a month by prefix, and the column is indexed.
- **Categories are ids into `constants/categories.ts`**, not rows. They are code, and a
  table would mean seeding and migrating something that never changes.
- **An account stores only where it started.** Its balance is that opening figure plus
  every transaction against it, worked out on read. A stored balance could disagree with
  the ledger, and an account that disagrees with its own transactions is the failure this
  app exists to prevent. A credit card opened owing money starts negative and sums into
  net worth as a debt, so nothing special-cases what is owed.
- **A recurring bill is a rule, not a reminder.** Every occurrence it has reached posts an
  ordinary transaction at launch, dated the day it was due. A `last_posted_date` cursor is
  what makes that idempotent, so deleting a posted transaction does not bring it back —
  that is how "this should not have happened" is expressed. There is nothing to tick off
  and no overdue state: a date that has arrived has already posted.

Run `npx drizzle-kit generate` after editing `db/schema.ts`. Migrations are bundled into
the JS and applied at launch. In development the `...` menu on Home loads and clears
sample data.

## Stack

Expo SDK 57 · React Native 0.86 · TypeScript · Expo Router · expo-sqlite + Drizzle ·
Zustand · StyleSheet · lucide-react-native · DM Sans + Manrope

## Conventions

See [CLAUDE.md](CLAUDE.md).
