import { create } from "zustand";

import { deleteAccount, insertAccount, listAccountBalances, updateAccount } from "@/db/accounts";
import type { AccountBalance, NewAccount } from "@/types/account";

interface AccountState {
  /** Each account with its balance already worked out from the ledger. */
  items: AccountBalance[];
  /** False until the first read finishes, so the UI can tell empty from loading. */
  loaded: boolean;
  error: string | null;

  load: () => Promise<void>;
  add: (input: NewAccount) => Promise<void>;
  edit: (id: string, patch: Partial<NewAccount>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export const useAccountStore = create<AccountState>((set, get) => ({
  items: [],
  loaded: false,
  error: null,

  load: async () => {
    try {
      const items = await listAccountBalances();
      set({ items, loaded: true, error: null });
    } catch (error) {
      set({ loaded: true, error: message(error) });
    }
  },

  // As elsewhere, every write re-reads: balances are derived, so a write to one
  // account can change nothing else, but the read is one grouped query anyway.
  add: async (input) => {
    try {
      await insertAccount(input);
      await get().load();
    } catch (error) {
      set({ error: message(error) });
    }
  },

  edit: async (id, patch) => {
    try {
      await updateAccount(id, patch);
      await get().load();
    } catch (error) {
      set({ error: message(error) });
    }
  },

  // The refusal from deleteAccount lands in `error`, which the screen renders --
  // it is a message for the person, not a crash.
  remove: async (id) => {
    try {
      await deleteAccount(id);
      await get().load();
    } catch (error) {
      set({ error: message(error) });
    }
  },
}));
