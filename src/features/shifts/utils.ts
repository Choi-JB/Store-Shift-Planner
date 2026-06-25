import { mockShifts } from "@/entities/shift";
import type { StoreShift } from "@/entities/types";
import type { AreaFilter } from "./constants";
import { AREA_LABELS } from "./constants";

export function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = date.toLocaleDateString("ko-KR", { weekday: "short" });
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

export function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getShiftDates(): string[] {
  return [...new Set(mockShifts.map((shift) => shift.date))].sort();
}

export function getShiftsByDate(
  date: string,
  area: AreaFilter = "all",
): StoreShift[] {
  return mockShifts.filter(
    (shift) =>
      shift.date === date && (area === "all" || shift.area === area),
  );
}

export function getAreaSummary(date: string) {
  const shifts = getShiftsByDate(date);
  const byArea = shifts.reduce(
    (acc, shift) => {
      acc[shift.area] = (acc[shift.area] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<StoreShift["area"], number>>,
  );

  return {
    total: shifts.length,
    byArea: (Object.keys(AREA_LABELS) as StoreShift["area"][]).map((area) => ({
      area,
      label: AREA_LABELS[area],
      count: byArea[area] ?? 0,
    })),
  };
}

export function getShiftById(id: string): StoreShift | undefined {
  return mockShifts.find((shift) => shift.id === id);
}
