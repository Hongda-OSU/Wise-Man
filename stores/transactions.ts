import { create } from "zustand";

import {
  deleteTransaction,
  getTransaction,
  insertTransaction,
  listMonthlyTotals,
  listTransactionsInMonth,
  searchTransactions,
  updateTransaction,
} from "@/db/transactions";
import { clearAllData, seedSampleData } from "@/db/seed";
import { toMonthKey } from "@/utils/dateUtils";
import type {
  MonthlyTotal,
  NewTransaction,
  Transaction,
  TransactionType,
} from "@/types/transaction";

interface TransactionState {
  /** YYYY-MM. The one place that decides which month the app is showing. */
  month: string;
  items: Transaction[];
  /** False until the first read finishes, so the UI can tell empty from not-yet-loaded. */
  loaded: boolean;
  error: string | null;

  load: () => Promise<void>;
  setMonth: (month: string) => Promise<void>;
  add: (input: NewTransaction) => Promise<void>;
  edit: (id: string, patch: Partial<NewTransaction>) => Promise<void>;
  remove: (id: string) => Promise<void>;

  // Reads that reach past the month in `items`. They hand their result back
  // rather than holding it, since no other screen needs it.
  find: (id: string) => Promise<Transaction | null>;
  search: (term: string) => Promise<Transaction[]>;
  monthlyTotals: (month: string, count: number, type: TransactionType) => Promise<MonthlyTotal[]>;

  /** Development only -- see db/seed.ts. */
  seed: () => Promise<void>;
  clear: () => Promise<void>;
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  month: toMonthKey(),
  items: [],
  loaded: false,
  error: null,

  load: async () => {
    try {
      const items = await listTransactionsInMonth(get().month);
      set({ items, loaded: true, error: null });
    } catch (error) {
      set({ loaded: true, error: message(error) });
    }
  },

  setMonth: async (month) => {
    set({ month });
    await get().load();
  },

  // Each write re-reads rather than patching the array by hand: SQLite is the
  // source of truth, and ordering is its job, not the store's.
  add: async (input) => {
    try {
      await insertTransaction(input);
      await get().load();
    } catch (error) {
      set({ error: message(error) });
    }
  },

  edit: async (id, patch) => {
    try {
      await updateTransaction(id, patch);
      await get().load();
    } catch (error) {
      set({ error: message(error) });
    }
  },

  remove: async (id) => {
    try {
      await deleteTransaction(id);
      await get().load();
    } catch (error) {
      set({ error: message(error) });
    }
  },

  find: (id) => getTransaction(id),
  search: (term) => searchTransactions(term),
  monthlyTotals: (month, count, type) => listMonthlyTotals(month, count, type),

  seed: async () => {
    try {
      await seedSampleData();
      await get().setMonth(toMonthKey());
    } catch (error) {
      set({ error: message(error) });
    }
  },

  clear: async () => {
    try {
      await clearAllData();
      await get().load();
    } catch (error) {
      set({ error: message(error) });
    }
  },
}));
