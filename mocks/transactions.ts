import type { TransactionSection } from "@/types/transaction";

export const MOCK_TRANSACTIONS_EMPTY: TransactionSection[] = [];

export const MOCK_TRANSACTIONS: TransactionSection[] = [
  {
    title: "March 15, 2026",
    data: [
      {
        id: "1",
        amountCents: 1850,
        type: "expense",
        categoryId: "food",
        accountId: "cash",
        date: "2026-03-15",
        createdAt: 1773568800000,
        updatedAt: 1773568800000,
        note: "Ramen Misoya",
      },
      {
        id: "2",
        amountCents: 250,
        type: "expense",
        categoryId: "transport",
        accountId: "cash",
        date: "2026-03-15",
        createdAt: 1773565200000,
        updatedAt: 1773565200000,
        note: "Ventra",
      },
    ],
  },
  {
    title: "March 14, 2026",
    data: [
      {
        id: "3",
        amountCents: 520000,
        type: "income",
        categoryId: "salary",
        accountId: "bank",
        date: "2026-03-14",
        createdAt: 1773478800000,
        updatedAt: 1773478800000,
        note: "Salary",
      },
      {
        id: "4",
        amountCents: 2999,
        type: "expense",
        categoryId: "entertainment",
        accountId: "bank",
        date: "2026-03-14",
        createdAt: 1773518400000,
        updatedAt: 1773518400000,
        note: "Steam",
      },
      {
        id: "5",
        amountCents: 650,
        type: "expense",
        categoryId: "food",
        accountId: "cash",
        date: "2026-03-14",
        createdAt: 1773493200000,
        updatedAt: 1773493200000,
        note: "Intelligentsia",
      },
      {
        id: "6",
        amountCents: 875,
        type: "expense",
        categoryId: "transport",
        accountId: "cash",
        date: "2026-03-14",
        createdAt: 1773511200000,
        updatedAt: 1773511200000,
        note: "Lyft",
      },
    ],
  },
];
