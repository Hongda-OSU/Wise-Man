// Ids and labels only. Nothing draws a category any more -- rows write the name,
// so an icon was the same fact a third time, and the per-category colours went
// when income green and expense red became the only colour in the interface.
export interface CategoryConfig {
  id: string;
  label: string;
}

/**
 * Money moved between your own accounts, which is neither earned nor spent.
 * Recording it takes two rows -- one leaving, one arriving -- so the id has to
 * exist under both types, and both are left out of every total. A convention
 * rather than a modelled transfer: nothing links the two rows or enters them for
 * you.
 */
export const TRANSFER_CATEGORY_ID = "transfer";

export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { id: "food", label: "Food & Drink" },
  { id: "transport", label: "Transport" },
  { id: "housing", label: "Housing" },
  { id: "shopping", label: "Shopping" },
  { id: "entertainment", label: "Entertain" },
  { id: "health", label: "Health" },
  { id: "education", label: "Education" },
  { id: "social", label: "Social" },
  { id: TRANSFER_CATEGORY_ID, label: "Transfer" },
  { id: "other", label: "Other" },
];

export const INCOME_CATEGORIES: CategoryConfig[] = [
  { id: "salary", label: "Salary" },
  { id: "freelance", label: "Freelance" },
  { id: "invest", label: "Invest" },
  { id: TRANSFER_CATEGORY_ID, label: "Transfer" },
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
