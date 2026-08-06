import { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

import { COLORS } from "@/constants/colors";
import { FONTS, FONT_SIZES } from "@/constants/fonts";
import CalendarDayCell from "@/components/molecules/CalendarDayCell";
import TransactionItem from "@/components/molecules/TransactionItem";
import { toDateString } from "@/utils/dateUtils";
import type { TransactionSection } from "@/types/transaction";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const CELL_H = 50;

interface DayData {
  income: number;
  expense: number;
}

interface CalendarViewProps {
  sections: TransactionSection[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
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

export default function CalendarView({ sections, onEdit, onDelete }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (sections.length > 0) {
      const d = new Date(sections[0].data[0].date + "T00:00:00");
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
        if (tx.type === "income") existing.income += tx.amount;
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

  const monthLabel = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  function prevMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.monthNav}>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <View style={styles.navButtons}>
          <TouchableOpacity
            onPress={prevMonth}
            style={styles.navBtn}
            accessibilityRole="button"
            accessibilityLabel="Previous month"
          >
            <ChevronLeft size={18} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={nextMonth}
            style={styles.navBtn}
            accessibilityRole="button"
            accessibilityLabel="Next month"
          >
            <ChevronRight size={18} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day, i) => (
          <Text key={i} style={styles.weekday}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {calendarRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.calendarRow}>
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

      {selectedSectionTitle && <Text style={styles.sectionHeader}>{selectedSectionTitle}</Text>}
      <View style={styles.transactionList}>
        {selectedTransactions.map((tx) => (
          <TransactionItem key={tx.id} transaction={tx} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  navButtons: {
    flexDirection: "row",
    gap: 12,
    marginRight: 10,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  monthLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.subBody,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  weekdayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  weekday: {
    width: 44,
    textAlign: "center",
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
  },
  calendarGrid: {
    paddingHorizontal: 20,
    gap: 6,
    marginBottom: 24,
  },
  calendarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionHeader: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
    letterSpacing: -0.65,
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  transactionList: {
    gap: 8,
    paddingHorizontal: 20,
  },
});
