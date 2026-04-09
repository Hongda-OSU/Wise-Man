import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';
import TransactionItem from '@/components/molecules/TransactionItem';
import type { TransactionSection } from '@/types/transaction';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const CELL_H = 50;

interface DayData {
  income: number;
  expense: number;
}

interface CalendarViewProps {
  sections: TransactionSection[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  listHeader?: React.ReactNode;
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function chunkIntoRows(days: (number | null)[]): (number | null)[][] {
  const rows: (number | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    const row = days.slice(i, i + 7);
    while (row.length < 7) row.push(null);
    rows.push(row);
  }
  return rows;
}

export default function CalendarView({ sections, onEdit, onDelete, listHeader }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (sections.length > 0) {
      const d = new Date(sections[0].data[0].date + 'T00:00:00');
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    return sections[0]?.data[0]?.date ?? null;
  });

  const dayDataMap = useMemo(() => {
    const map = new Map<string, DayData>();
    for (const section of sections) {
      for (const tx of section.data) {
        const existing = map.get(tx.date) ?? { income: 0, expense: 0 };
        if (tx.type === 'income') existing.income += tx.amount;
        else existing.expense += tx.amount;
        map.set(tx.date, existing);
      }
    }
    return map;
  }, [sections]);

  const calendarRows = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return chunkIntoRows(days);
  }, [currentMonth]);

  const selectedTransactions = useMemo(() => {
    if (!selectedDate) return [];
    return sections.flatMap((s) => s.data).filter((t) => t.date === selectedDate);
  }, [selectedDate, sections]);

  const selectedSectionTitle = useMemo(() => {
    if (!selectedDate) return null;
    return sections.find((s) => s.data.some((t) => t.date === selectedDate))?.title ?? null;
  }, [selectedDate, sections]);

  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  function prevMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      {listHeader}

      {/* Month navigation */}
      <View className="flex-row items-center justify-between px-7 mt-4 mb-4">
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <View className="flex-row gap-3 mr-2">
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn} accessibilityRole="button" accessibilityLabel="Previous month">
            <ChevronLeft size={18} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn} accessibilityRole="button" accessibilityLabel="Next month">
            <ChevronRight size={18} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekday headers */}
      <View className="flex-row justify-between px-6 mb-2">
        {WEEKDAYS.map((day, i) => (
          <Text key={i} style={styles.weekday}>{day}</Text>
        ))}
      </View>

      {/* Calendar rows */}
      <View className="px-6 gap-1 mb-10">
        {calendarRows.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-between">
            {row.map((day, colIndex) => {
              if (day === null) {
                return <View key={colIndex} style={styles.cell} />;
              }

              const dateStr = toDateString(year, month, day);
              const data = dayDataMap.get(dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <TouchableOpacity
                  key={dateStr}
                  style={[styles.cell, isSelected ? styles.cellSelected : styles.cellDefault]}
                  onPress={() => setSelectedDate(dateStr)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`${day} ${monthLabel}`}
                >
                  <Text style={[styles.dayNumber, isSelected && styles.textSelected]}>{day}</Text>
                  <Text style={[data?.income ? styles.amountIncome : styles.amountZero]} numberOfLines={1}>
                    {data?.income ? `+${Math.round(data.income)}` : '$0'}
                  </Text>
                  <Text style={[data?.expense ? styles.amountExpense : styles.amountZero]} numberOfLines={1}>
                    {data?.expense ? `-${Math.round(data.expense)}` : '$0'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Selected day transactions */}
      {selectedSectionTitle && (
        <Text className="mt-5 mb-2 px-6" style={styles.sectionHeader}>{selectedSectionTitle}</Text>
      )}
      <View className="gap-2 px-6">
        {selectedTransactions.map((tx) => (
          <TransactionItem key={tx.id} transaction={tx} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.heading2,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  weekday: {
    width: 44,
    textAlign: 'center',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
  },
  cell: {
    width: 44,
    height: CELL_H,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  cellDefault: {
    backgroundColor: COLORS.white,
  },
  cellSelected: {
    backgroundColor: COLORS.forestGreen,
  },
  dayNumber: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textPrimary,
  },
  amountIncome: {
    fontFamily: FONTS.regular,
    fontSize: 8,
    color: COLORS.income,
    marginTop: 1,
  },
  amountExpense: {
    fontFamily: FONTS.regular,
    fontSize: 8,
    color: COLORS.expense,
    marginTop: 1,
  },
  amountZero: {
    fontFamily: FONTS.regular,
    fontSize: 8,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  textSelected: {
    color: COLORS.white,
  },
  sectionHeader: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    letterSpacing: -0.65,
  },
});
