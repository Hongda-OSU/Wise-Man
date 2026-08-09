import { ACCOUNT_KIND_LABELS, ACCOUNT_KIND_ORDER } from "@/types/account";
import type { AccountBalance } from "@/types/account";

export interface AccountSection {
  title: string; // "CASH", "BANK", "CREDIT"
  data: AccountBalance[];
}

/**
 * Cash, bank, then credit -- what you hold before what you owe. Relies on the
 * repository's ordering rather than re-sorting; empty kinds do not get a heading.
 */
export function groupByKind(items: AccountBalance[]): AccountSection[] {
  return ACCOUNT_KIND_ORDER.map((kind) => ({
    title: ACCOUNT_KIND_LABELS[kind].toUpperCase(),
    data: items.filter((item) => item.account.kind === kind),
  })).filter((section) => section.data.length > 0);
}

/**
 * Everything held minus everything owed. Credit balances are already negative,
 * so this is a plain sum -- no special case for what is a debt.
 */
export function netWorthCents(items: AccountBalance[]): number {
  return items.reduce((total, item) => total + item.balanceCents, 0);
}
