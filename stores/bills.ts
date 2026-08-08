import { create } from "zustand";

import { catchUpBills, deleteBill, insertBill, listBills, updateBill } from "@/db/bills";
import { useTransactionStore } from "@/stores/transactions";
import type { Bill, NewBill } from "@/types/bill";

interface BillState {
  items: Bill[];
  /** False until the first read finishes, so the UI can tell empty from loading. */
  loaded: boolean;
  error: string | null;

  /** Posts anything that has come due, then reads. Safe to call as often as you like. */
  load: () => Promise<void>;
  add: (input: NewBill) => Promise<void>;
  edit: (id: string, patch: Partial<NewBill>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export const useBillStore = create<BillState>((set, get) => ({
  items: [],
  loaded: false,
  error: null,

  load: async () => {
    try {
      // Posting happens here rather than on a timer: there is no background
      // process, so "has anything come due" can only be asked when the app runs.
      const posted = await catchUpBills();
      const items = await listBills();
      set({ items, loaded: true, error: null });

      // Only when something actually posted, so the common case stays one read.
      if (posted > 0) await useTransactionStore.getState().load();
    } catch (error) {
      set({ loaded: true, error: message(error) });
    }
  },

  // As with transactions, every write re-reads: SQLite is the source of truth.
  add: async (input) => {
    try {
      await insertBill(input);
      await get().load();
    } catch (error) {
      set({ error: message(error) });
    }
  },

  edit: async (id, patch) => {
    try {
      await updateBill(id, patch);
      await get().load();
    } catch (error) {
      set({ error: message(error) });
    }
  },

  remove: async (id) => {
    try {
      await deleteBill(id);
      await get().load();
    } catch (error) {
      set({ error: message(error) });
    }
  },
}));
