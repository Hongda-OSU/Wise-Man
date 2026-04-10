export interface Transaction {
  id: string;
  amount: number;
  type: 'expense' | 'income';
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
