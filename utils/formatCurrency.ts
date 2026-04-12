export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatAmountDisplay(raw: string): string {
  if (!raw) return '$0.00';
  const [intPart, decPart] = raw.split('.');
  const formatted = parseInt(intPart || '0', 10).toLocaleString('en-US');
  if (decPart !== undefined) return `$${formatted}.${decPart.slice(0, 2)}`;
  return `$${formatted}.00`;
}
