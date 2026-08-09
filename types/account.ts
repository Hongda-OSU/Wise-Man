export const ACCOUNT_KINDS = {
  cash: "cash",
  bank: "bank",
  credit: "credit",
} as const;

export type AccountKind = (typeof ACCOUNT_KINDS)[keyof typeof ACCOUNT_KINDS];

export const ACCOUNT_KIND_LABELS: Record<AccountKind, string> = {
  cash: "Cash",
  bank: "Bank",
  credit: "Credit",
};

/** Listed in this order, so the accounts you spend from come before what you owe. */
export const ACCOUNT_KIND_ORDER: AccountKind[] = [
  ACCOUNT_KINDS.cash,
  ACCOUNT_KINDS.bank,
  ACCOUNT_KINDS.credit,
];

/**
 * Somewhere money sits. An account holds no balance of its own -- see
 * db/accounts.ts -- only where it started, because the ledger decides the rest.
 */
export interface Account {
  id: string;
  name: string;
  kind: AccountKind;
  /**
   * What was in it before the first transaction. Negative is meaningful: a
   * credit card opened with a balance owed starts below zero.
   */
  openingBalanceCents: number;
  createdAt: number;
  updatedAt: number;
}

/** What the account form collects; the id and timestamps are set on write. */
export type NewAccount = Omit<Account, "id" | "createdAt" | "updatedAt">;

/** An account with the ledger applied. Always computed, never stored. */
export interface AccountBalance {
  account: Account;
  /** Opening balance plus every transaction against it. */
  balanceCents: number;
  transactionCount: number;
}
