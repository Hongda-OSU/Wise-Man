import { CreditCard, CalendarDays, SquarePen } from "lucide-react-native";

export interface DetailCardConfig {
  icon: React.ComponentType<{ size: number; color: string }>;
  iconBg: string;
  iconColor: string;
  label: string;
}

export const DETAIL_ACCOUNT: DetailCardConfig = {
  icon: CreditCard,
  iconBg: "#E8F0FF",
  iconColor: "#4A6AE8",
  label: "ACCOUNT",
};

export const DETAIL_DATE: DetailCardConfig = {
  icon: CalendarDays,
  iconBg: "#FFF3DC",
  iconColor: "#C8922A",
  label: "DATE",
};

export const DETAIL_NOTE: DetailCardConfig = {
  icon: SquarePen,
  iconBg: "#F0E8FF",
  iconColor: "#7A4AE8",
  label: "NOTE",
};
