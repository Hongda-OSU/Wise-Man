import { create } from "zustand";

import {
  deleteTransaction,
  insertTransaction,
  listTransactionsInMonth,
  updateTransaction,
} from "@/db/transactions";
import { toMonthKey } from "@/utils/dateUtils";
import type { NewTransaction, Transaction } from "@/types/transaction";

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
}));
