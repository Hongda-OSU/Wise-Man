import { House, BriefcaseBusiness, CalendarClock, ChartNoAxesColumn } from "lucide-react-native";

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
    icon: BriefcaseBusiness,
    route: "/portfolio",
  },
  { name: "events", label: "Events", icon: CalendarClock, route: "/events" },
  {
    name: "analysis",
    label: "Analysis",
    icon: ChartNoAxesColumn,
    route: "/analysis",
  },
];
