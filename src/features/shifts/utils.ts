import { mockShifts } from "@/entities/shift";
import type { StoreShift } from "@/entities/types";
import type { AreaFilter } from "./constants";
import { AREA_LABELS } from "./constants";

//날짜 포맷팅 함수 : 2026-06-25 -> 2026년 6월 25일 (수)
export function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = date.toLocaleDateString("ko-KR", { weekday: "short" });
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

//날짜 문자열 생성 함수 : 2026, 6, 25 -> 2026-06-25
export function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

//근무 날짜 목록 생성 함수 : 2026-06-25, 2026-06-26 -> ["2026-06-25", "2026-06-26"]
export function getShiftDates(): string[] {
  return [...new Set(mockShifts.map((shift) => shift.date))].sort();
}

//근무 날짜별 근무 목록 조회 함수 : 2026-06-25, "cashier" -> 2026-06-25 계산대 근무자 목록
export function getShiftsByDate(
  date: string,
  area: AreaFilter = "all",
): StoreShift[] {
  return mockShifts.filter(
    (shift) =>
      shift.date === date && (area === "all" || shift.area === area),
  );
}

//근무 구역별 요약 정보 조회 함수
//입력값(2026-06-25) ->반환값( 총 근무 인원, 계산대 근무자 수, 진열 근무자 수, 창고 근무자 수, 고객 응대 근무자 수)
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

//근무 아이디별 근무 정보 조회 함수 : "shift-001" -> 근무 아이디가 "shift-001"인 근무 정보
export function getShiftById(id: string): StoreShift | undefined {
  return mockShifts.find((shift) => shift.id === id);
}
