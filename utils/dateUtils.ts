export function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * A month as YYYY-MM. Every query and label keys off this string rather than a
 * Date, so there is one representation of "which month" in the whole app.
 */
export function toMonthKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthKeyToDate(monthKey: string): Date {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

export function shiftMonth(monthKey: string, delta: number): string {
  const date = monthKeyToDate(monthKey);
  date.setMonth(date.getMonth() + delta);
  return toMonthKey(date);
}

/** "August 2026" */
export function formatMonthLabel(monthKey: string): string {
  return monthKeyToDate(monthKey).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/**
 * The last `count` months ending with the one containing `today`. Transactions
 * cannot be dated in the future, so there is nothing to offer ahead of it.
 */
export function recentMonths(count: number, today = new Date()) {
  return Array.from({ length: count }, (_, offset) => {
    const key = shiftMonth(toMonthKey(today), -offset);
    return { id: key, label: formatMonthLabel(key) };
  });
}

/** "March 15, 2026" — the heading over a day's rows. */
export function formatDayHeading(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** "Aug 7" — the short form the transaction rows and the date field both use. */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * The last `count` days ending today, labelled the way someone entering a
 * transaction thinks of them: Today, Yesterday, then weekday and date.
 */
export function recentDays(count: number, today = new Date()) {
  return Array.from({ length: count }, (_, offset) => {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);

    const short = formatShortDate(date);
    let label = short;
    if (offset === 0) label = `Today, ${short}`;
    else if (offset === 1) label = `Yesterday, ${short}`;
    else label = `${date.toLocaleDateString("en-US", { weekday: "short" })}, ${short}`;

    return {
      id: toDateString(date.getFullYear(), date.getMonth(), date.getDate()),
      label,
    };
  });
}
