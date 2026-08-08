import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { CADENCES } from "@/types/bill";
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

    // Set when a recurring bill posted this row, null when a person entered it.
    // Not a foreign key: deleting the bill does not make this transaction stop
    // having come from one, and that is the fact the column records.
    billId: text("bill_id"),

    // These two are instants: when the row was written, not when money moved.
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("transactions_date_idx").on(table.date)],
);

export type TransactionRow = typeof transactions.$inferSelect;
export type NewTransactionRow = typeof transactions.$inferInsert;

/**
 * A rule for money that moves on a schedule. Deliberately not joined to
 * transactions: an occurrence posts an ordinary, independent transaction, so
 * editing the rent later never rewrites what has already gone through, and
 * deleting a transaction never resurrects the occurrence behind it.
 */
export const recurringBills = sqliteTable("recurring_bills", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),

  type: text("type", {
    enum: [TRANSACTION_TYPES.income, TRANSACTION_TYPES.expense],
  }).notNull(),

  // Integer cents, for the same reason as transactions.
  amountCents: integer("amount_cents").notNull(),

  categoryId: text("category_id").notNull(),
  accountId: text("account_id").notNull().default("cash"),

  cadence: text("cadence", {
    enum: [CADENCES.weekly, CADENCES.monthly, CADENCES.yearly],
  }).notNull(),

  // The series is these two dates plus the cadence; the next due date is
  // computed, never stored. Storing it would need a writer to keep it fresh, and
  // nothing runs while the app is closed.
  startDate: text("start_date").notNull(),
  // How far the ledger has been filled in. Null means nothing has posted yet.
  lastPostedDate: text("last_posted_date"),

  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
// No index: every read wants the whole table, which is a handful of rows.

export type BillRow = typeof recurringBills.$inferSelect;
export type NewBillRow = typeof recurringBills.$inferInsert;
