import AppHeader from '@/components/templates/AppHeader';
import SummaryCard from '@/components/organisms/SummaryCard';
import TransactionHeader from '@/components/molecules/TransactionHeader';

interface HomeHeaderProps {
  view: 'list' | 'calendar';
  onViewChange: (view: 'list' | 'calendar') => void;
}

export default function HomeHeader({ view, onViewChange }: HomeHeaderProps) {
  return (
    <>
      <AppHeader />
      <SummaryCard
        month="March 2026"
        netBalance={3240.50}
        income={5000}
        expense={1959.50}
      />
      <TransactionHeader view={view} onViewChange={onViewChange} />
    </>
  );
}
