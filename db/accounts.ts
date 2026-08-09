import { randomUUID } from "expo-crypto";
import { asc, eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { accounts, transactions } from "@/db/schema";
import type { AccountRow } from "@/db/schema";
import { ACCOUNT_KINDS, ACCOUNT_KIND_ORDER } from "@/types/account";
import type { Account, AccountBalance, NewAccount } from "@/types/account";
import { TRANSACTION_TYPES } from "@/types/transaction";

// SQL for accounts. Everything above this file works in Account.

/**
 * The id every transaction written before accounts existed still cites, so the
 * row carrying it keeps the literal string rather than a minted UUID.
 */
export const DEFAULT_ACCOUNT_ID = "cash";

/**
 * Guarantees at least one account exists. Every transaction belongs to one, so
 * "no accounts at all" is not a state the rest of the app should have to answer
 * for -- and an install that predates this table has rows pointing at an id that
 * would otherwise never resolve.
 *
 * Deliberately not part of the migration that created the table. That migration
 * has already run on existing installs, so a row added to it now would never be
 * inserted; a check at launch costs one count and repairs them too.
 */
export async function ensureDefaultAccount(): Promise<void> {
  const rows = await db.select({ count: sql<number>`count(*)` }).from(accounts);
  if ((rows[0]?.count ?? 0) > 0) return;

  const now = new Date();
  await db.insert(accounts).values({
    id: DEFAULT_ACCOUNT_ID,
    name: "Cash",
    kind: ACCOUNT_KINDS.cash,
    openingBalanceCents: 0,
    createdAt: now,
    updatedAt: now,
  });
}

function toAccount(row: AccountRow): Account {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    openingBalanceCents: row.openingBalanceCents,
    createdAt: row.createdAt.getTime(),
    updatedAt: row.updatedAt.getTime(),
  };
}

/** Cash, then bank, then credit; alphabetical within each. */
function byKindThenName(a: Account, b: Account): number {
  const kinds = ACCOUNT_KIND_ORDER.indexOf(a.kind) - ACCOUNT_KIND_ORDER.indexOf(b.kind);
  return kinds !== 0 ? kinds : a.name.localeCompare(b.name);
}

export async function listAccounts(): Promise<Account[]> {
  const rows = await db.select().from(accounts).orderBy(asc(accounts.name));
  return rows.map(toAccount).sort(byKindThenName);
}

export async function getAccount(id: string): Promise<Account | null> {
  const rows = await db.select().from(accounts).where(eq(accounts.id, id)).limit(1);
  return rows.length ? toAccount(rows[0]) : null;
}

/**
 * Every account with its balance worked out from the ledger. One grouped query
 * rather than one per account, and the sum is done in SQLite so a long history
 * never has to cross into JavaScript to be added up.
 */
export async function listAccountBalances(): Promise<AccountBalance[]> {
  const ledger = await db
    .select({
      accountId: transactions.accountId,
      net: sql<number>`sum(case when ${transactions.type} = ${TRANSACTION_TYPES.income}
        then ${transactions.amountCents} else -${transactions.amountCents} end)`,
      count: sql<number>`count(*)`,
    })
    .from(transactions)
    .groupBy(transactions.accountId);

  const byAccount = new Map(ledger.map((row) => [row.accountId, row]));

  return (await listAccounts()).map((account) => {
    const totals = byAccount.get(account.id);
    return {
      account,
      balanceCents: account.openingBalanceCents + (totals?.net ?? 0),
      transactionCount: totals?.count ?? 0,
    };
  });
}

export async function insertAccount(input: NewAccount): Promise<Account> {
  const now = new Date();
  const row: AccountRow = {
    id: randomUUID(),
    name: input.name,
    kind: input.kind,
    openingBalanceCents: input.openingBalanceCents,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(accounts).values(row);
  return toAccount(row);
}

export async function updateAccount(id: string, patch: Partial<NewAccount>): Promise<void> {
  await db
    .update(accounts)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(accounts.id, id));
}

/** How many transactions cite an account. Zero is the only safe count to delete at. */
export async function countAccountTransactions(id: string): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(eq(transactions.accountId, id));

  return rows[0]?.count ?? 0;
}

/**
 * Refuses while anything still points at the account. Reassigning silently would
 * move someone's money to an account they did not choose, and orphaning the rows
 * would leave transactions in the ledger that no balance includes.
 */
export async function deleteAccount(id: string): Promise<void> {
  const used = await countAccountTransactions(id);
  if (used > 0) {
    throw new Error(
      `${used} transaction${used === 1 ? "" : "s"} still use this account. Move or delete them first.`,
    );
  }

  await db.delete(accounts).where(eq(accounts.id, id));
}
