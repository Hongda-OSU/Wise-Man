import { CADENCES } from "@/types/bill";
import type { Bill, BillDue, Cadence } from "@/types/bill";
import { TRANSACTION_TYPES } from "@/types/transaction";
import { toDateString, todayString } from "@/utils/dateUtils";

// Where a recurring bill sits in time. All of it is pure and derived: nothing
// runs while the app is closed, so a stored due date would be stale on launch.

const MS_PER_DAY = 86_400_000;

function toLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function daysBetween(from: string, to: string): number {
  const elapsed = toLocalDate(to).getTime() - toLocalDate(from).getTime();
  // Rounded, not truncated: a daylight-saving change makes one local day 23 or
  // 25 hours long, which would otherwise lose or gain a day.
  return Math.round(elapsed / MS_PER_DAY);
}

function daysInMonth(year: number, month: number): number {
  // Day 0 of the following month is the last day of this one.
  return new Date(year, month + 1, 0).getDate();
}

/** The nth occurrence of a series, counting the start date as n = 0. */
export function occurrenceOn(startDate: string, cadence: Cadence, n: number): string {
  const [year, month, day] = startDate.split("-").map(Number);

  if (cadence === CADENCES.weekly) {
    const date = new Date(year, month - 1, day + 7 * n);
    return toDateString(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const target = new Date(year, month - 1 + (cadence === CADENCES.monthly ? n : n * 12), 1);
  const targetYear = target.getFullYear();
  const targetMonth = target.getMonth();

  // Every occurrence is measured from the start date's day, so rent anchored to
  // the 31st lands on the 28th in February and back on the 31st in March. A
  // series that stepped from the previous clamped date would drift earlier.
  return toDateString(targetYear, targetMonth, Math.min(day, daysInMonth(targetYear, targetMonth)));
}

/** A lower bound on how many periods separate two dates. */
function periodsBetween(from: string, to: string, cadence: Cadence): number {
  if (cadence === CADENCES.weekly) return Math.floor(daysBetween(from, to) / 7);

  const [fromYear, fromMonth] = from.split("-").map(Number);
  const [toYear, toMonth] = to.split("-").map(Number);
  const months = (toYear - fromYear) * 12 + (toMonth - fromMonth);

  return cadence === CADENCES.monthly ? months : Math.floor(months / 12);
}

/** The first occurrence that has not been posted to the ledger yet. */
export function nextDueDate(bill: Bill): string {
  const { startDate, cadence, lastPostedDate } = bill;
  if (!lastPostedDate) return startDate;

  // Start one period behind the estimate and walk forward. occurrenceOn is the
  // authority on where an occurrence falls; the estimate only saves the walk
  // from starting at zero, and since occurrences increase with n it terminates.
  let n = Math.max(0, periodsBetween(startDate, lastPostedDate, cadence) - 1);
  while (occurrenceOn(startDate, cadence, n) <= lastPostedDate) n += 1;

  return occurrenceOn(startDate, cadence, n);
}

// A bill edited to start years back would otherwise post hundreds of rows in one
// pass. Anything beyond this is a mistake rather than a backlog.
const MAX_CATCH_UP = 120;

/**
 * Every occurrence from the cursor up to and including today -- what the ledger
 * is missing. Empty once a bill is caught up, which is the normal case.
 */
export function occurrencesDueBy(bill: Bill, today = todayString()): string[] {
  const dates: string[] = [];

  let date = nextDueDate(bill);
  while (date <= today && dates.length < MAX_CATCH_UP) {
    dates.push(date);
    date = nextDueDate({ ...bill, lastPostedDate: date });
  }

  return dates;
}

export function toBillDue(bill: Bill, today = todayString()): BillDue {
  const dueDate = nextDueDate(bill);
  return { bill, dueDate, daysUntil: daysBetween(today, dueDate) };
}

/** Soonest first. There is no overdue section: due dates that have arrived have
 *  already posted, so every date in this list is ahead of today. */
export function toDueList(bills: Bill[], today = todayString()): BillDue[] {
  return bills
    .map((bill) => toBillDue(bill, today))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

// 52 and 12, not 365.25 / 7: these are the conventional periods per year, and a
// weekly bill is budgeted as 52 payments however the calendar falls.
const PERIODS_PER_YEAR: Record<Cadence, number> = { weekly: 52, monthly: 12, yearly: 1 };

/** What a bill costs in an average month, whatever its cadence. */
export function monthlyEquivalentCents(bill: Bill): number {
  return Math.round((bill.amountCents * PERIODS_PER_YEAR[bill.cadence]) / 12);
}

export function monthlyTotals(bills: Bill[]) {
  let income = 0;
  let expense = 0;

  for (const bill of bills) {
    const monthly = monthlyEquivalentCents(bill);
    if (bill.type === TRANSACTION_TYPES.income) income += monthly;
    else expense += monthly;
  }

  return { income, expense, net: income - expense };
}

/**
 * "Due tomorrow", "In 12 days" -- the row's second line. Only ever forward
 * looking: an occurrence that had arrived would have posted instead of waiting.
 */
export function describeDue(daysUntil: number): string {
  if (daysUntil <= 1) return "Due tomorrow";
  return `In ${daysUntil} days`;
}
