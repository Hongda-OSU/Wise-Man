import { formatDayHeading } from "@/utils/dateUtils";
import type { Transaction, TransactionSection } from "@/types/transaction";

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

export function sumByType(transactions: Transaction[]) {
  let income = 0;
  let expense = 0;

  for (const transaction of transactions) {
    if (transaction.type === "income") income += transaction.amountCents;
    else expense += transaction.amountCents;
  }

  return { income, expense, netBalance: income - expense };
}
