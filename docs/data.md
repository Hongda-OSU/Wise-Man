# Data

Why the data is shaped the way it is. Field-level detail lives in `db/schema.ts`.

- **Amounts are integer cents.** SQLite `REAL` is IEEE 754, and a ledger of floats drifts
  as it is summed.
- **Dates are `TEXT` as `YYYY-MM-DD`**: a calendar day, not an instant, so which month a
  transaction falls in never depends on a timezone. ISO text also sorts, and matches a
  month by prefix.
- **Categories are ids into `constants/categories.ts`**, not rows: a table would mean
  migrating something that never changes.
- **An account stores only its opening balance.** The rest is the ledger, summed on read;
  a stored balance could disagree with the transactions under it. A credit card starts
  negative, so debt needs no special case.
- **A transfer is two rows tagged `transfer`**, and every total skips them: $500 moved
  between your own accounts is not $500 earned and $500 spent. Nothing links the pair or
  enters them for you.
- **A recurring bill posts itself.** Every occurrence it has reached becomes an ordinary
  transaction at launch, dated the day it was due. A `last_posted_date` cursor keeps that
  idempotent, so deleting one does not bring it back, and nothing is ever overdue.

## Migrations

Run `npx drizzle-kit generate` after editing `db/schema.ts`. Migrations are bundled into
the JS and applied at launch by `app/_layout.tsx`. In development the `...` menu on Home
loads and clears sample data.
