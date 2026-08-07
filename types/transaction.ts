export const TRANSACTION_TYPES = {
  expense: "expense",
  income: "income",
} as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];

export interface Transaction {
  id: string;
  /** Integer cents. Never a fractional amount -- see db/schema.ts. */
  amountCents: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  /** The calendar day it happened, as YYYY-MM-DD. */
  date: string;
  note?: string;
  /** Epoch milliseconds. */
  createdAt: number;
  updatedAt: number;
}

/** What the track screen collects; the id and timestamps are set on write. */
export type NewTransaction = Omit<Transaction, "id" | "createdAt" | "updatedAt">;

export interface TransactionSection {
  title: string; // e.g. "March 15, 2026"
  data: Transaction[];
}
