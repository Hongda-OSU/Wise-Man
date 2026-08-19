import { getCategoryConfig, TRANSFER_CATEGORY_ID } from "@/constants/categories";
import { formatDayHeading } from "@/utils/dateUtils";
import { TRANSACTION_TYPES } from "@/types/transaction";
import type { Transaction, TransactionSection, TransactionType } from "@/types/transaction";

/**
 * Groups an already-sorted list into one section per day. The repository orders
 * by date descending, so walking it in order is enough -- no second sort here.
 */
export function groupByDay(transactions: Transaction[]): TransactionSection[] {
  const sections: TransactionSection[] = [];
  let currentDate: string | null = null;

  for (const transaction of transactions) {
    if (transaction.date !== currentDate) {
      currentDate = transaction.date;
      sections.push({ title: formatDayHeading(transaction.date), data: [] });
    }
    sections[sections.length - 1].data.push(transaction);
  }

  return sections;
}

/** Money that only moved between your own accounts, so no total counts it. */
function isTransfer(transaction: Transaction): boolean {
  return transaction.categoryId === TRANSFER_CATEGORY_ID;
}

export function sumByType(transactions: Transaction[]) {
  let income = 0;
  let expense = 0;

  for (const transaction of transactions) {
    // Both legs of a transfer are skipped. Counting them would inflate the month
    // by the same figure on each side: moving $500 from one account to another is
    // not $500 earned and $500 spent.
    if (isTransfer(transaction)) continue;

    if (transaction.type === TRANSACTION_TYPES.income) income += transaction.amountCents;
    else expense += transaction.amountCents;
  }

  return { income, expense, netBalance: income - expense };
}

export interface CategoryTotal {
  categoryId: string;
  label: string;
  amountCents: number;
  /** 0 to 1 of the month's spending. */
  share: number;
}

/**
 * Where one side of the month broke down, largest first. Transfers are left out:
 * money moved between your own accounts is neither earned nor spent.
 */
export function sumByCategory(transactions: Transaction[], type: TransactionType): CategoryTotal[] {
  const totals = new Map<string, number>();
  let spent = 0;

  for (const transaction of transactions) {
    if (transaction.type !== type || isTransfer(transaction)) continue;

    totals.set(
      transaction.categoryId,
      (totals.get(transaction.categoryId) ?? 0) + transaction.amountCents,
    );
    spent += transaction.amountCents;
  }

  return [...totals]
    .map(([categoryId, amountCents]) => ({
      categoryId,
      label: getCategoryConfig(categoryId, type).label,
      amountCents,
      // Guarded because a month with nothing on this side has no denominator.
      share: spent > 0 ? amountCents / spent : 0,
    }))
    .sort((a, b) => b.amountCents - a.amountCents);
}
