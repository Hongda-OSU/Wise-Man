import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { FONTS, FONT_SIZES } from '@/constants/fonts';
import CalendarDayCell from '@/components/molecules/CalendarDayCell';
import TransactionItem from '@/components/molecules/TransactionItem';
import { toDateString } from '@/utils/dateUtils';
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
      <View className="flex-row items-center justify-between px-8 mt-4 mb-4">
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <View className="flex-row gap-3 mr-2.5">
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn} accessibilityRole="button" accessibilityLabel="Previous month">
            <ChevronLeft size={18} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn} accessibilityRole="button" accessibilityLabel="Next month">
            <ChevronRight size={18} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekday headers */}
      <View className="flex-row justify-between px-7 mb-2">
        {WEEKDAYS.map((day, i) => (
          <Text key={i} style={styles.weekday}>{day}</Text>
        ))}
      </View>

      {/* Calendar rows */}
      <View className="px-7 gap-1.5 mb-6">
        {calendarRows.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-between">
            {row.map((day, colIndex) => {
              if (day === null) {
                return <View key={colIndex} style={{ width: 44, height: CELL_H }} />;
              }

              const dateStr = toDateString(year, month, day);
              const data = dayDataMap.get(dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <CalendarDayCell
                  key={dateStr}
                  day={day}
                  income={data?.income ?? 0}
                  expense={data?.expense ?? 0}
                  isSelected={isSelected}
                  onPress={() => setSelectedDate(dateStr)}
                  accessibilityLabel={`${day} ${monthLabel}`}
                />
              );
            })}
          </View>
        ))}
      </View>

      {/* Selected day transactions */}
      {selectedSectionTitle && (
        <Text className="mt-5 mb-2 px-7" style={styles.sectionHeader}>{selectedSectionTitle}</Text>
      )}
      <View className="gap-2 px-7">
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
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.body,
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
  sectionHeader: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    letterSpacing: -0.65,
  },
});
