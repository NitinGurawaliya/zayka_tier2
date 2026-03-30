export type AnalyticsRange = "week" | "month" | "year";

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function rangeStartDate(range: AnalyticsRange, today: Date) {
  const t = startOfDay(today);

  if (range === "week") {
    const start = new Date(t);
    start.setDate(t.getDate() - 6); // 7 days including today
    return start;
  }

  if (range === "month") {
    const start = new Date(t);
    start.setDate(t.getDate() - 29); // 30 days including today
    return start;
  }

  // year: 12 months including current month
  return new Date(t.getFullYear(), t.getMonth() - 11, 1);
}

export function dayKey(date: Date) {
  return startOfDay(date).toISOString().split("T")[0];
}

export function monthKey(date: Date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

