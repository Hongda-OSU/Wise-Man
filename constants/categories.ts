import {
  Coffee,
  Bus,
  Home,
  ShoppingBag,
  TvMinimal,
  Heart,
  GraduationCap,
  Users,
  AlertCircle,
  DollarSign,
  BookOpen,
  Activity,
  ArrowLeftRight,
  Gift,
  RotateCcw,
  Wallet,
  MoreHorizontal,
} from "lucide-react-native";

export interface CategoryConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  bg: string;
  color: string;
}

export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { id: "food", label: "Food & Drink", icon: Coffee, bg: "#452E25", color: "#E8784A" },
  { id: "transport", label: "Transport", icon: Bus, bg: "#223348", color: "#4A90E8" },
  { id: "housing", label: "Housing", icon: Home, bg: "#402223", color: "#D04040" },
  { id: "shopping", label: "Shopping", icon: ShoppingBag, bg: "#3E341E", color: "#C8922A" },
  { id: "entertainment", label: "Entertain", icon: TvMinimal, bg: "#34273D", color: "#9B59B6" },
  { id: "health", label: "Health", icon: Heart, bg: "#20392D", color: "#3EAA6E" },
  { id: "education", label: "Education", icon: GraduationCap, bg: "#41371A", color: "#D4A017" },
  { id: "social", label: "Social", icon: Users, bg: "#173B38", color: "#18B5A0" },
  { id: "other", label: "Other", icon: AlertCircle, bg: "#303133", color: "#888888" },
];

export const INCOME_CATEGORIES: CategoryConfig[] = [
  { id: "salary", label: "Salary", icon: DollarSign, bg: "#1B3A2E", color: "#27AE72" },
  { id: "freelance", label: "Freelance", icon: BookOpen, bg: "#2A2848", color: "#6C5CE7" },
  { id: "invest", label: "Invest", icon: Activity, bg: "#453825", color: "#E8A84A" },
  { id: "transfer", label: "Transfer", icon: ArrowLeftRight, bg: "#1F2F45", color: "#3B7DD8" },
  { id: "gift", label: "Gift", icon: Gift, bg: "#412430", color: "#D44A7A" },
  { id: "refund", label: "Refund", icon: RotateCcw, bg: "#433220", color: "#E08A30" },
  { id: "allowance", label: "Allowance", icon: Wallet, bg: "#3E2535", color: "#C75090" },
  { id: "other", label: "Other", icon: MoreHorizontal, bg: "#303133", color: "#888888" },
];

export function getCategoryConfig(categoryId: string, type: "expense" | "income"): CategoryConfig {
  const list = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  return list.find((c) => c.id === categoryId) ?? list[list.length - 1];
}
