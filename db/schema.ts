import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { TRANSACTION_TYPES } from "@/types/transaction";

export const transactions = sqliteTable(
  "transactions",
  {
    // A v4 UUID supplied by the caller. Not a $defaultFn: drizzle-kit loads this
    // file in Node to generate migrations, and expo-crypto cannot be imported
    // there. Declaring the shape here and minting the id at the write keeps the
    // schema loadable by the toolchain.
    id: text("id").primaryKey(),

    type: text("type", {
      enum: [TRANSACTION_TYPES.income, TRANSACTION_TYPES.expense],
    }).notNull(),

    // Integer cents. SQLite REAL is IEEE 754, and summing a ledger of floats
    // drifts; 18.50 is stored as 1850 and divided only to display it.
    amountCents: integer("amount_cents").notNull(),

    // Plain ids, not foreign keys: categories live in constants/ as code and do
    // not change at runtime. A table would mean seeding and migrating rows for
    // something static. Accounts are not modelled at all yet.
    categoryId: text("category_id").notNull(),
    accountId: text("account_id").notNull().default("cash"),

    // The calendar day the money moved, local to whoever entered it -- not an
    // instant. A timestamp would make "which month is this in" a timezone
    // question. ISO text also sorts chronologically and compares by prefix.
    date: text("date").notNull(),

    note: text("note"),

    // These two are instants: when the row was written, not when money moved.
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("transactions_date_idx").on(table.date)],
);

export type TransactionRow = typeof transactions.$inferSelect;
export type NewTransactionRow = typeof transactions.$inferInsert;
