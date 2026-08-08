import { db } from "@/db/client";
import { recurringBills, transactions } from "@/db/schema";
import { insertBill } from "@/db/bills";
import { insertTransaction } from "@/db/transactions";
import { toDateString } from "@/utils/dateUtils";
import { CADENCES } from "@/types/bill";
import type { NewBill } from "@/types/bill";
import { TRANSACTION_TYPES } from "@/types/transaction";
import type { NewTransaction } from "@/types/transaction";

/**
 * Development only. Reinstalling the app drops the SQLite file, and typing a
 * dozen transactions back in by hand to look at a populated screen is not work.
 *
 * Days are offsets from today rather than fixed dates, so the rows always land
 * in the month the app opens on. The two furthest back will fall into the
 * previous month early in a month, which is useful -- it exercises the switcher.
 */
const SAMPLE: (Omit<NewTransaction, "date" | "accountId"> & { daysAgo: number })[] = [
  { daysAgo: 0, type: TRANSACTION_TYPES.expense, amountCents: 1850, categoryId: "food", note: "Ramen Misoya" }, // prettier-ignore
  { daysAgo: 0, type: TRANSACTION_TYPES.expense, amountCents: 250, categoryId: "transport", note: "Ventra" }, // prettier-ignore
  { daysAgo: 1, type: TRANSACTION_TYPES.income, amountCents: 520000, categoryId: "salary" },
  { daysAgo: 1, type: TRANSACTION_TYPES.expense, amountCents: 2999, categoryId: "entertainment", note: "Steam" }, // prettier-ignore
  { daysAgo: 2, type: TRANSACTION_TYPES.expense, amountCents: 650, categoryId: "food", note: "Intelligentsia" }, // prettier-ignore
  { daysAgo: 3, type: TRANSACTION_TYPES.expense, amountCents: 875, categoryId: "transport", note: "Lyft" }, // prettier-ignore
  { daysAgo: 5, type: TRANSACTION_TYPES.expense, amountCents: 14200, categoryId: "shopping" },
  { daysAgo: 8, type: TRANSACTION_TYPES.expense, amountCents: 4500, categoryId: "health", note: "Pharmacy" }, // prettier-ignore
];

/**
 * Offsets again, and deliberately spread either side of today: the first is
 * already overdue, so the screen shows both of its sections rather than only the
 * happy one.
 */
const SAMPLE_BILLS: (Omit<NewBill, "startDate" | "accountId"> & { startsInDays: number })[] = [
  { startsInDays: -3, name: "Rent", type: TRANSACTION_TYPES.expense, amountCents: 180000, categoryId: "housing", cadence: CADENCES.monthly }, // prettier-ignore
  { startsInDays: 5, name: "Paycheque", type: TRANSACTION_TYPES.income, amountCents: 520000, categoryId: "salary", cadence: CADENCES.monthly }, // prettier-ignore
  { startsInDays: 11, name: "Spotify", type: TRANSACTION_TYPES.expense, amountCents: 1099, categoryId: "entertainment", cadence: CADENCES.monthly }, // prettier-ignore
  { startsInDays: 20, name: "Gym", type: TRANSACTION_TYPES.expense, amountCents: 4500, categoryId: "health", cadence: CADENCES.monthly }, // prettier-ignore
  { startsInDays: 40, name: "Car insurance", type: TRANSACTION_TYPES.expense, amountCents: 84000, categoryId: "other", cadence: CADENCES.yearly }, // prettier-ignore
];

function offsetFrom(today: Date, days: number): string {
  const date = new Date(today);
  date.setDate(today.getDate() + days);
  return toDateString(date.getFullYear(), date.getMonth(), date.getDate());
}

export async function seedSampleData(today = new Date()): Promise<void> {
  for (const { daysAgo, ...rest } of SAMPLE) {
    await insertTransaction({ ...rest, accountId: "cash", date: offsetFrom(today, -daysAgo) });
  }

  for (const { startsInDays, ...rest } of SAMPLE_BILLS) {
    await insertBill({ ...rest, accountId: "cash", startDate: offsetFrom(today, startsInDays) });
  }
}

/** Everything, both tables -- the dev menu offers one "clear", not two. */
export async function clearAllData(): Promise<void> {
  await db.delete(transactions);
  await db.delete(recurringBills);
}
