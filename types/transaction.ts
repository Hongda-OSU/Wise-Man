export const TRANSACTION_TYPES = {
  expense: "expense",
  income: "income",
} as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  date: string; // ISO 8601
  note?: string;
  createdAt: string;
}

export interface TransactionSection {
  title: string; // e.g. "March 15, 2026"
  data: Transaction[];
}
