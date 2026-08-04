import { House, Wallet, Repeat, ChartPie } from "lucide-react-native";

interface TabItem {
  name: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  route: string;
}

export const TABS: TabItem[] = [
  { name: "index", label: "Home", icon: House, route: "/" },
  {
    name: "portfolio",
    label: "Portfolio",
    icon: Wallet,
    route: "/portfolio",
  },
  { name: "events", label: "Events", icon: Repeat, route: "/events" },
  {
    name: "analysis",
    label: "Analysis",
    icon: ChartPie,
    route: "/analysis",
  },
];
