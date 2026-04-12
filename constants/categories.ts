import {
  Coffee, Bus, Home, ShoppingBag, TvMinimal,
  Heart, GraduationCap, Users, AlertCircle,
  DollarSign, BookOpen, Activity, ArrowLeftRight,
  Gift, RotateCcw, Wallet, MoreHorizontal,
} from 'lucide-react-native';

export interface CategoryConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  bg: string;
  color: string;
}

export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { id: 'food',          label: 'Food & Drink',   icon: Coffee,          bg: '#FFF0E8', color: '#E8784A' },
  { id: 'transport',     label: 'Transport',       icon: Bus,             bg: '#DDEEFF', color: '#4A90E8' },
  { id: 'housing',       label: 'Housing',         icon: Home,            bg: '#FFE8E8', color: '#D04040' },
  { id: 'shopping',      label: 'Shopping',        icon: ShoppingBag,     bg: '#FFF3DC', color: '#C8922A' },
  { id: 'entertainment', label: 'Entertain',   icon: TvMinimal,       bg: '#F0E0FF', color: '#9B59B6' },
  { id: 'health',        label: 'Health',          icon: Heart,           bg: '#D8FFE8', color: '#3EAA6E' },
  { id: 'education',     label: 'Education',       icon: GraduationCap,   bg: '#FFF8E0', color: '#D4A017' },
  { id: 'social',        label: 'Social',          icon: Users,           bg: '#DFFAF8', color: '#18B5A0' },
  { id: 'other',         label: 'Other',           icon: AlertCircle,     bg: '#EDEDED', color: '#888888' },
];

export const INCOME_CATEGORIES: CategoryConfig[] = [
  { id: 'salary',     label: 'Salary',     icon: DollarSign,      bg: '#EAFFF3', color: '#27AE72' },
  { id: 'freelance',  label: 'Freelance',  icon: BookOpen,        bg: '#EDE8FF', color: '#6C5CE7' },
  { id: 'invest',     label: 'Invest',     icon: Activity,        bg: '#FFF8E8', color: '#E8A84A' },
  { id: 'transfer',   label: 'Transfer',   icon: ArrowLeftRight,  bg: '#E0EEFF', color: '#3B7DD8' },
  { id: 'gift',       label: 'Gift',       icon: Gift,            bg: '#FFE8F0', color: '#D44A7A' },
  { id: 'refund',     label: 'Refund',     icon: RotateCcw,       bg: '#FFF0E0', color: '#E08A30' },
  { id: 'allowance',  label: 'Allowance',  icon: Wallet,          bg: '#FFF0F5', color: '#C75090' },
  { id: 'other',      label: 'Other',      icon: MoreHorizontal,  bg: '#F0F0F0', color: '#888888' },
];

export function getCategoryConfig(categoryId: string, type: 'expense' | 'income'): CategoryConfig {
  const list = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  return list.find((c) => c.id === categoryId) ?? list[list.length - 1];
}
