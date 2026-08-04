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
  { id: "food", label: "Food & Drink", icon: Coffee, bg: "#423226", color: "#E8784A" },
  { id: "transport", label: "Transport", icon: Bus, bg: "#223746", color: "#4A90E8" },
  { id: "housing", label: "Housing", icon: Home, bg: "#3D2724", color: "#D04040" },
  { id: "shopping", label: "Shopping", icon: ShoppingBag, bg: "#3B3820", color: "#C8922A" },
  { id: "entertainment", label: "Entertain", icon: TvMinimal, bg: "#322C3C", color: "#9B59B6" },
  { id: "health", label: "Health", icon: Heart, bg: "#203C2D", color: "#3EAA6E" },
  { id: "education", label: "Education", icon: GraduationCap, bg: "#3E3A1C", color: "#D4A017" },
  { id: "social", label: "Social", icon: Users, bg: "#183F37", color: "#18B5A0" },
  { id: "other", label: "Other", icon: AlertCircle, bg: "#2E3632", color: "#888888" },
];

export const INCOME_CATEGORIES: CategoryConfig[] = [
  { id: "salary", label: "Salary", icon: DollarSign, bg: "#1B3D2E", color: "#27AE72" },
  { id: "freelance", label: "Freelance", icon: BookOpen, bg: "#292D45", color: "#6C5CE7" },
  { id: "invest", label: "Invest", icon: Activity, bg: "#423C26", color: "#E8A84A" },
  { id: "transfer", label: "Transfer", icon: ArrowLeftRight, bg: "#1F3342", color: "#3B7DD8" },
  { id: "gift", label: "Gift", icon: Gift, bg: "#3E2930", color: "#D44A7A" },
  { id: "refund", label: "Refund", icon: RotateCcw, bg: "#403621", color: "#E08A30" },
  { id: "allowance", label: "Allowance", icon: Wallet, bg: "#3B2A34", color: "#C75090" },
  { id: "other", label: "Other", icon: MoreHorizontal, bg: "#2E3632", color: "#888888" },
];

export function getCategoryConfig(categoryId: string, type: "expense" | "income"): CategoryConfig {
  const list = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  return list.find((c) => c.id === categoryId) ?? list[list.length - 1];
}
