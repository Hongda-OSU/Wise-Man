import type { HomeViewMode } from "@/types/ui";
import SummaryCard from "@/components/organisms/SummaryCard";
import TransactionHeader from "@/components/molecules/TransactionHeader";

interface HomeHeaderProps {
  view: HomeViewMode;
  onViewChange: (view: HomeViewMode) => void;
  month: string;
  income: number;
  expense: number;
  netBalance: number;
}

export default function HomeHeader({
  view,
  onViewChange,
  month,
  income,
  expense,
  netBalance,
}: HomeHeaderProps) {
  return (
    <>
      <SummaryCard
        month={month}
        netBalance={netBalance}
        income={income}
        expense={expense}
      />
      <TransactionHeader view={view} onViewChange={onViewChange} />
    </>
  );
}
