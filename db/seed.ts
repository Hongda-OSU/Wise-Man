import { db } from "@/db/client";
import { transactions } from "@/db/schema";
import { insertTransaction } from "@/db/transactions";
import { toDateString } from "@/utils/dateUtils";
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

export async function seedSampleData(today = new Date()): Promise<void> {
  for (const { daysAgo, ...rest } of SAMPLE) {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);

    await insertTransaction({
      ...rest,
      accountId: "cash",
      date: toDateString(date.getFullYear(), date.getMonth(), date.getDate()),
    });
  }
}

export async function clearAllTransactions(): Promise<void> {
  await db.delete(transactions);
}
