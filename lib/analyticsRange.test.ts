import { describe, expect, it } from "vitest";
import { dayKey, monthKey, rangeStartDate, startOfDay } from "./analyticsRange";

describe("analyticsRange", () => {
  it("startOfDay resets time to midnight", () => {
    const d = new Date("2025-12-27T14:22:10.123Z");
    const out = startOfDay(d);
    expect(out.getUTCHours()).toBe(0);
    expect(out.getUTCMinutes()).toBe(0);
  });

  it("rangeStartDate for week is 6 days before today (inclusive)", () => {
    const today = new Date("2025-12-27T00:00:00.000Z");
    const start = rangeStartDate("week", today);
    expect(dayKey(start)).toBe("2025-12-21");
  });

  it("rangeStartDate for month is 29 days before today (inclusive)", () => {
    const today = new Date("2025-12-27T00:00:00.000Z");
    const start = rangeStartDate("month", today);
    expect(dayKey(start)).toBe("2025-11-28");
  });

  it("rangeStartDate for year starts at first day 11 months back", () => {
    const today = new Date("2025-12-27T00:00:00.000Z");
    const start = rangeStartDate("year", today);
    expect(dayKey(start)).toBe("2025-01-01");
  });

  it("dayKey and monthKey format correctly", () => {
    const d = new Date("2025-03-09T10:00:00.000Z");
    expect(dayKey(d)).toBe("2025-03-09");
    expect(monthKey(d)).toBe("2025-03");
  });
});

