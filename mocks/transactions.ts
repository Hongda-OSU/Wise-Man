import type { TransactionSection } from "@/types/transaction";

export const MOCK_TRANSACTIONS_EMPTY: TransactionSection[] = [];

export const MOCK_TRANSACTIONS: TransactionSection[] = [
  {
    title: "March 15, 2026",
    data: [
      {
        id: "1",
        amount: 18.5,
        type: "expense",
        categoryId: "food",
        accountId: "cash",
        date: "2026-03-15",
        createdAt: "2026-03-15T10:00:00Z",
        note: "Ramen Misoya",
      },
      {
        id: "2",
        amount: 2.5,
        type: "expense",
        categoryId: "transport",
        accountId: "cash",
        date: "2026-03-15",
        createdAt: "2026-03-15T09:00:00Z",
        note: "Ventra",
      },
    ],
  },
  {
    title: "March 14, 2026",
    data: [
      {
        id: "3",
        amount: 5200.0,
        type: "income",
        categoryId: "salary",
        accountId: "bank",
        date: "2026-03-14",
        createdAt: "2026-03-14T09:00:00Z",
        note: "Salary",
      },
      {
        id: "4",
        amount: 29.99,
        type: "expense",
        categoryId: "entertainment",
        accountId: "bank",
        date: "2026-03-14",
        createdAt: "2026-03-14T20:00:00Z",
        note: "Steam",
      },
      {
        id: "5",
        amount: 6.5,
        type: "expense",
        categoryId: "food",
        accountId: "cash",
        date: "2026-03-14",
        createdAt: "2026-03-14T13:00:00Z",
        note: "Intelligentsia",
      },
      {
        id: "6",
        amount: 8.75,
        type: "expense",
        categoryId: "transport",
        accountId: "cash",
        date: "2026-03-14",
        createdAt: "2026-03-14T18:00:00Z",
        note: "Lyft",
      },
    ],
  },
];
