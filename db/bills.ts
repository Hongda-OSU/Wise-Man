import { randomUUID } from "expo-crypto";
import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { recurringBills, transactions } from "@/db/schema";
import type { BillRow } from "@/db/schema";
import type { Bill, NewBill } from "@/types/bill";
import { occurrencesDueBy } from "@/utils/billSchedule";
import { todayString } from "@/utils/dateUtils";

// SQL for recurring bills. Everything above this file works in Bill.

function toBill(row: BillRow): Bill {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    amountCents: row.amountCents,
    categoryId: row.categoryId,
    accountId: row.accountId,
    cadence: row.cadence,
    startDate: row.startDate,
    lastPostedDate: row.lastPostedDate ?? undefined,
    createdAt: row.createdAt.getTime(),
    updatedAt: row.updatedAt.getTime(),
  };
}

/**
 * Every bill. Ordering by name only settles ties -- the screen sorts by due
 * date, which is computed and so cannot be an ORDER BY.
 */
export async function listBills(): Promise<Bill[]> {
  const rows = await db.select().from(recurringBills).orderBy(asc(recurringBills.name));
  return rows.map(toBill);
}

export async function getBill(id: string): Promise<Bill | null> {
  const rows = await db.select().from(recurringBills).where(eq(recurringBills.id, id)).limit(1);
  return rows.length ? toBill(rows[0]) : null;
}

export async function insertBill(input: NewBill): Promise<Bill> {
  const now = new Date();
  const row: BillRow = {
    id: randomUUID(),
    name: input.name,
    type: input.type,
    amountCents: input.amountCents,
    categoryId: input.categoryId,
    accountId: input.accountId,
    cadence: input.cadence,
    startDate: input.startDate,
    lastPostedDate: null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(recurringBills).values(row);
  return toBill(row);
}

export async function updateBill(id: string, patch: Partial<NewBill>): Promise<void> {
  await db
    .update(recurringBills)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(recurringBills.id, id));
}

/** Deleting a bill leaves the transactions it already produced alone. */
export async function deleteBill(id: string): Promise<void> {
  await db.delete(recurringBills).where(eq(recurringBills.id, id));
}

/**
 * Write a bill's arrived occurrences into the ledger and move its cursor past
 * them, in one database transaction: rows without the cursor move would post
 * again on the next launch, and the cursor move without the rows would lose the
 * money silently.
 *
 * Each transaction is dated its own occurrence, not today, so a month opened
 * late still shows the rent on the first.
 */
function postOccurrences(bill: Bill, dates: string[]): void {
  const now = new Date();

  // The expo-sqlite driver is synchronous, so the callback cannot await and each
  // statement is executed with .run().
  db.transaction((tx) => {
    for (const date of dates) {
      tx.insert(transactions)
        .values({
          id: randomUUID(),
          type: bill.type,
          amountCents: bill.amountCents,
          categoryId: bill.categoryId,
          accountId: bill.accountId,
          date,
          note: bill.name,
          billId: bill.id,
          createdAt: now,
          updatedAt: now,
        })
        .run();
    }

    tx.update(recurringBills)
      .set({ lastPostedDate: dates[dates.length - 1], updatedAt: now })
      .where(eq(recurringBills.id, bill.id))
      .run();
  });
}

/**
 * Bring every bill up to today. Idempotent: the cursor is what decides, so
 * running this on every launch and every read costs one query when there is
 * nothing to do, and deleting a posted transaction does not bring it back.
 *
 * Returns how many transactions were written, so a caller can skip refreshing
 * the ledger when nothing moved.
 */
export async function catchUpBills(today = todayString()): Promise<number> {
  const bills = await listBills();
  let posted = 0;

  for (const bill of bills) {
    const dates = occurrencesDueBy(bill, today);
    if (!dates.length) continue;

    postOccurrences(bill, dates);
    posted += dates.length;
  }

  return posted;
}
