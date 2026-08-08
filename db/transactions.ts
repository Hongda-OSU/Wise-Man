import { randomUUID } from "expo-crypto";
import { desc, eq, like } from "drizzle-orm";

import { db } from "@/db/client";
import { transactions } from "@/db/schema";
import type { TransactionRow } from "@/db/schema";
import type { NewTransaction, Transaction } from "@/types/transaction";

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
