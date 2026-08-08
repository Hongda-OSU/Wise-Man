// Ids and labels only. Nothing draws a category any more -- rows write the name,
// so an icon was the same fact a third time, and the per-category colours went
// when income green and expense red became the only colour in the interface.
export interface CategoryConfig {
  id: string;
  label: string;
}

export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { id: "food", label: "Food & Drink" },
  { id: "transport", label: "Transport" },
  { id: "housing", label: "Housing" },
  { id: "shopping", label: "Shopping" },
  { id: "entertainment", label: "Entertain" },
  { id: "health", label: "Health" },
  { id: "education", label: "Education" },
  { id: "social", label: "Social" },
  { id: "other", label: "Other" },
];

export const INCOME_CATEGORIES: CategoryConfig[] = [
  { id: "salary", label: "Salary" },
  { id: "freelance", label: "Freelance" },
  { id: "invest", label: "Invest" },
  { id: "transfer", label: "Transfer" },
  { id: "gift", label: "Gift" },
  { id: "refund", label: "Refund" },
  { id: "allowance", label: "Allowance" },
  { id: "other", label: "Other" },
];

/** Falls back to "Other", so a category id from an older row still renders. */
export function getCategoryConfig(categoryId: string, type: "expense" | "income"): CategoryConfig {
  const list = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  return list.find((c) => c.id === categoryId) ?? list[list.length - 1];
}
