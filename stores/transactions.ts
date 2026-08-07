import { create } from "zustand";

import {
  deleteTransaction,
  insertTransaction,
  listTransactions,
  updateTransaction,
} from "@/db/transactions";
import type { NewTransaction, Transaction } from "@/types/transaction";

interface TransactionState {
  items: Transaction[];
  /** False until the first read finishes, so the UI can tell empty from not-yet-loaded. */
  loaded: boolean;
  error: string | null;

  load: () => Promise<void>;
  add: (input: NewTransaction) => Promise<void>;
  edit: (id: string, patch: Partial<NewTransaction>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  items: [],
  loaded: false,
  error: null,

  load: async () => {
    try {
      set({ items: await listTransactions(), loaded: true, error: null });
    } catch (error) {
      set({ loaded: true, error: message(error) });
    }
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
