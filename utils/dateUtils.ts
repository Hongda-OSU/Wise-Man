export function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
