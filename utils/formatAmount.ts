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
 * "1800.5" to "1,800.5", for display inside an editable amount field. Only the
 * integer part is grouped, and a trailing dot or a half-typed fraction is passed
 * through untouched, so the separator never fights what is being typed.
 *
 * The field's state stays ungrouped -- this formats on the way out, and the
 * change handler strips separators on the way back in.
 */
export function groupAmountInput(input: string): string {
  const [whole, fraction] = input.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction === undefined ? grouped : `${grouped}.${fraction}`;
}

/**
 * "18.5" from a text field to 1850. Rounds because the input is a decimal string
 * and 18.5 * 100 is not exactly 1850 in binary floating point.
 */
export function toCents(input: string): number {
  const value = Number.parseFloat(input);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}
