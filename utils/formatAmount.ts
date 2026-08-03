export function formatAmount(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatAmountInput(raw: string): string {
  if (!raw) return "$0.00";
  const [intPart, decPart] = raw.split(".");
  const formatted = parseInt(intPart || "0", 10).toLocaleString("en-US");
  return `$${formatted}.${(decPart ?? "").slice(0, 2).padEnd(2, "0")}`;
}
