/** Cents in, "1,234.50" out. Amounts are stored as integers -- see db/schema.ts. */
export function formatAmount(amountCents: number): string {
  return (Math.abs(amountCents) / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * "-$12.00", not "$-12.00". The sign belongs outside the currency symbol, and
 * formatAmount deliberately drops it so every caller has to place it.
 */
export function formatSignedAmount(amountCents: number): string {
  return `${amountCents < 0 ? "-" : ""}$${formatAmount(amountCents)}`;
}

/**
 * "18.5" from a text field to 1850. Rounds because the input is a decimal string
 * and 18.5 * 100 is not exactly 1850 in binary floating point.
 */
export function toCents(input: string): number {
  const value = Number.parseFloat(input);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}
