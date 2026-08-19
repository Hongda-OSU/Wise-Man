import { randomUUID } from "expo-crypto";
import { desc, eq, inArray, like, ne, or, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { transactions } from "@/db/schema";
import type { TransactionRow } from "@/db/schema";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSFER_CATEGORY_ID,
} from "@/constants/categories";
import { shiftMonth } from "@/utils/dateUtils";
import type { NewTransaction, Transaction, TransactionType } from "@/types/transaction";

// The only file that knows SQL. Everything above it works in Transaction.

function toTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    amountCents: row.amountCents,
    type: row.type,
    categoryId: row.categoryId,
    accountId: row.accountId,
    date: row.date,
    note: row.note ?? undefined,
    billId: row.billId ?? undefined,
    createdAt: row.createdAt.getTime(),
    updatedAt: row.updatedAt.getTime(),
  };
}

/** Newest day first, and within a day the most recently entered first. */
export async function listTransactions(): Promise<Transaction[]> {
  const rows = await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.date), desc(transactions.createdAt));

  return rows.map(toTransaction);
}

/** `month` is YYYY-MM. Prefix matching is why the date column is ISO text. */
export async function listTransactionsInMonth(month: string): Promise<Transaction[]> {
  const rows = await db
    .select()
    .from(transactions)
    .where(like(transactions.date, `${month}-%`))
    .orderBy(desc(transactions.date), desc(transactions.createdAt));

  return rows.map(toTransaction);
}

export interface MonthlyTotal {
  /** YYYY-MM. */
  month: string;
  amountCents: number;
}

/**
 * Income or expense per month for the last `count` months, oldest first.
 *
 * One grouped query rather than one per month, and the grouping key is the first
 * seven characters of the date -- which works only because dates are stored as
 * ISO text. Months with nothing in them are filled in here rather than in SQL,
 * since SQLite has no rows to group for a month that saw nothing. Transfers are
 * excluded on both sides: moving money between your own accounts is neither.
 */
export async function listMonthlyTotals(
  month: string,
  count: number,
  type: TransactionType,
): Promise<MonthlyTotal[]> {
  const rows = await db
    .select({
      month: sql<string>`substr(${transactions.date}, 1, 7)`,
      amountCents: sql<number>`sum(${transactions.amountCents})`,
    })
    .from(transactions)
    .where(
      sql`${transactions.type} = ${type}
        and ${ne(transactions.categoryId, TRANSFER_CATEGORY_ID)}`,
    )
    .groupBy(sql`substr(${transactions.date}, 1, 7)`);

  const totals = new Map(rows.map((row) => [row.month, row.amountCents]));

  return Array.from({ length: count }, (_, offset) => {
    const key = shiftMonth(month, offset - (count - 1));
    return { month: key, amountCents: totals.get(key) ?? 0 };
  });
}

/**
 * Notes and category names, across every month -- unlike the store, which holds
 * one month at a time.
 *
 * Category names are matched by resolving the term against the lists in
 * `constants/` first: the rows store a category id, so "food" would never match
 * "Food & Drink" in SQL. LIKE is left as-is because SQLite already ignores case
 * for ASCII, and lower() on the column would defeat any future index.
 */
export async function searchTransactions(term: string): Promise<Transaction[]> {
  const query = term.trim();
  if (!query) return [];

  const categoryIds = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]
    .filter((category) => category.label.toLowerCase().includes(query.toLowerCase()))
    .map((category) => category.id);

  const matchesNote = like(transactions.note, `%${query}%`);

  const rows = await db
    .select()
    .from(transactions)
    .where(
      categoryIds.length
        ? or(matchesNote, inArray(transactions.categoryId, categoryIds))
        : matchesNote,
    )
    .orderBy(desc(transactions.date), desc(transactions.createdAt));

  return rows.map(toTransaction);
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  const rows = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
  return rows.length ? toTransaction(rows[0]) : null;
}

export async function insertTransaction(input: NewTransaction): Promise<Transaction> {
  const now = new Date();
  const row: TransactionRow = {
    id: randomUUID(),
    amountCents: input.amountCents,
    type: input.type,
    categoryId: input.categoryId,
    accountId: input.accountId,
    date: input.date,
    note: input.note ?? null,
    billId: input.billId ?? null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(transactions).values(row);
  return toTransaction(row);
}

export async function updateTransaction(id: string, patch: Partial<NewTransaction>): Promise<void> {
  // billId is left out on purpose: an undefined value is omitted from the SET, so
  // editing a posted transaction does not erase which bill it came from.
  await db
    .update(transactions)
    .set({ ...patch, note: patch.note ?? null, updatedAt: new Date() })
    .where(eq(transactions.id, id));
}

export async function deleteTransaction(id: string): Promise<void> {
  await db.delete(transactions).where(eq(transactions.id, id));
}
