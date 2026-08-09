import { ne } from "drizzle-orm";

import { db } from "@/db/client";
import { accounts, recurringBills, transactions } from "@/db/schema";
import { DEFAULT_ACCOUNT_ID, insertAccount } from "@/db/accounts";
import { insertBill } from "@/db/bills";
import { insertTransaction } from "@/db/transactions";
import { toDateString } from "@/utils/dateUtils";
import { ACCOUNT_KINDS } from "@/types/account";
import type { NewAccount } from "@/types/account";
import { CADENCES } from "@/types/bill";
import type { NewBill } from "@/types/bill";
import { TRANSACTION_TYPES } from "@/types/transaction";
import type { NewTransaction } from "@/types/transaction";

/**
 * Development only. Reinstalling the app drops the SQLite file, and typing a
 * dozen transactions back in by hand to look at a populated screen is not work.
 */

/**
 * Alongside the "cash" account the migration seeds. One of each kind, including
 * a credit card opened owing money, so the Portfolio screen shows all three
 * headings and a negative balance rather than one happy row.
 */
const SAMPLE_ACCOUNTS: NewAccount[] = [
  { name: "Checking", kind: ACCOUNT_KINDS.bank, openingBalanceCents: 320000 },
  { name: "Savings", kind: ACCOUNT_KINDS.bank, openingBalanceCents: 1150000 },
  { name: "Visa", kind: ACCOUNT_KINDS.credit, openingBalanceCents: -42000 },
];

/**
 * Days are offsets from today rather than fixed dates, so the rows always land
 * in the month the app opens on. The two furthest back will fall into the
 * previous month early in a month, which is useful -- it exercises the switcher.
 *
 * `account` names one of the sample accounts above, or is absent for cash: the
 * ids are minted at insert, so a static id could not be written here.
 */
type SampleTransaction = Omit<NewTransaction, "date" | "accountId"> & {
  daysAgo: number;
  account?: string;
};

const SAMPLE: SampleTransaction[] = [
  { daysAgo: 0, type: TRANSACTION_TYPES.expense, amountCents: 1850, categoryId: "food", note: "Ramen Misoya" }, // prettier-ignore
  { daysAgo: 0, type: TRANSACTION_TYPES.expense, amountCents: 250, categoryId: "transport", note: "Ventra" }, // prettier-ignore
  { daysAgo: 1, type: TRANSACTION_TYPES.income, amountCents: 520000, categoryId: "salary", account: "Checking" }, // prettier-ignore
  { daysAgo: 1, type: TRANSACTION_TYPES.expense, amountCents: 2999, categoryId: "entertainment", note: "Steam", account: "Visa" }, // prettier-ignore
  { daysAgo: 2, type: TRANSACTION_TYPES.expense, amountCents: 650, categoryId: "food", note: "Intelligentsia" }, // prettier-ignore
  { daysAgo: 3, type: TRANSACTION_TYPES.expense, amountCents: 875, categoryId: "transport", note: "Lyft", account: "Visa" }, // prettier-ignore
  { daysAgo: 5, type: TRANSACTION_TYPES.expense, amountCents: 14200, categoryId: "shopping", account: "Visa" }, // prettier-ignore
  { daysAgo: 8, type: TRANSACTION_TYPES.expense, amountCents: 4500, categoryId: "health", note: "Pharmacy", account: "Checking" }, // prettier-ignore
];

/**
 * Offsets again, and deliberately spread either side of today: the first is
 * already due, so the ledger shows a posted occurrence rather than only a
 * schedule of things that have not happened.
 */
const SAMPLE_BILLS: (Omit<NewBill, "startDate" | "accountId"> & {
  startsInDays: number;
  account?: string;
})[] = [
  { startsInDays: -3, name: "Rent", type: TRANSACTION_TYPES.expense, amountCents: 180000, categoryId: "housing", cadence: CADENCES.monthly, account: "Checking" }, // prettier-ignore
  { startsInDays: 5, name: "Paycheque", type: TRANSACTION_TYPES.income, amountCents: 520000, categoryId: "salary", cadence: CADENCES.monthly, account: "Checking" }, // prettier-ignore
  { startsInDays: 11, name: "Spotify", type: TRANSACTION_TYPES.expense, amountCents: 1099, categoryId: "entertainment", cadence: CADENCES.monthly, account: "Visa" }, // prettier-ignore
  { startsInDays: 20, name: "Gym", type: TRANSACTION_TYPES.expense, amountCents: 4500, categoryId: "health", cadence: CADENCES.monthly, account: "Visa" }, // prettier-ignore
  { startsInDays: 40, name: "Car insurance", type: TRANSACTION_TYPES.expense, amountCents: 84000, categoryId: "other", cadence: CADENCES.yearly, account: "Checking" }, // prettier-ignore
];

function offsetFrom(today: Date, days: number): string {
  const date = new Date(today);
  date.setDate(today.getDate() + days);
  return toDateString(date.getFullYear(), date.getMonth(), date.getDate());
}

export async function seedSampleData(today = new Date()): Promise<void> {
  const ids = new Map<string, string>();
  for (const account of SAMPLE_ACCOUNTS) {
    const created = await insertAccount(account);
    ids.set(account.name, created.id);
  }

  const accountId = (name?: string) => (name && ids.get(name)) || DEFAULT_ACCOUNT_ID;

  for (const { daysAgo, account, ...rest } of SAMPLE) {
    await insertTransaction({
      ...rest,
      accountId: accountId(account),
      date: offsetFrom(today, -daysAgo),
    });
  }

  for (const { startsInDays, account, ...rest } of SAMPLE_BILLS) {
    await insertBill({
      ...rest,
      accountId: accountId(account),
      startDate: offsetFrom(today, startsInDays),
    });
  }
}

/**
 * Everything the dev menu can put back -- it offers one "clear", not three. The
 * seeded cash account survives: it is what the migration created for every
 * transaction written before accounts existed, and what a new one defaults to.
 */
export async function clearAllData(): Promise<void> {
  await db.delete(transactions);
  await db.delete(recurringBills);
  await db.delete(accounts).where(ne(accounts.id, DEFAULT_ACCOUNT_ID));
}
