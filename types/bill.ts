import type { TransactionType } from "@/types/transaction";

export const CADENCES = {
  weekly: "weekly",
  monthly: "monthly",
  yearly: "yearly",
} as const;

export type Cadence = (typeof CADENCES)[keyof typeof CADENCES];

export const CADENCE_LABELS: Record<Cadence, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

/**
 * Something that comes due again and again: rent, a subscription, a paycheque.
 * A bill is a rule, and every occurrence it has reached posts itself to the
 * ledger automatically -- so a bill is a statement about what happens, not a
 * reminder to do something.
 */
export interface Bill {
  id: string;
  name: string;
  /** Rent is an expense; a salary is a recurring income. Both belong here. */
  type: TransactionType;
  amountCents: number;
  categoryId: string;
  accountId: string;
  cadence: Cadence;
  /** The first occurrence, YYYY-MM-DD. Every later one steps forward from here. */
  startDate: string;
  /**
   * The last occurrence already written to the ledger. The cursor that makes
   * posting idempotent: deleting the transaction it produced does not bring the
   * occurrence back, which is how "it should not have happened" is expressed.
   */
  lastPostedDate?: string;
  createdAt: number;
  updatedAt: number;
}

/** What the bill form collects; the id, cursor and timestamps are set on write. */
export type NewBill = Omit<Bill, "id" | "createdAt" | "updatedAt" | "lastPostedDate">;

/** A bill placed in time. Always computed from the bill -- never stored. */
export interface BillDue {
  bill: Bill;
  /** The next occurrence, YYYY-MM-DD. Always in the future: anything up to today
   *  has already posted itself. */
  dueDate: string;
  /** Whole days from today to `dueDate`. */
  daysUntil: number;
}
