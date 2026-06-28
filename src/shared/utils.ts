import { mockShifts } from "@/entities/shift";
import type { StoreShift } from "@/entities/types";
import type { AreaFilter } from "../features/shifts/constants";
import { AREA_LABELS } from "../features/shifts/constants";

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

export type ShiftLaneLayout = {
  columnIndex: number;
  totalColumns: number;
  leftPercent: number;
  widthPercent: number;
};

function parseTimeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function shiftsOverlap(a: StoreShift, b: StoreShift): boolean {
  const startA = parseTimeToMinutes(a.startAt);
  const endA = parseTimeToMinutes(a.endAt);
  const startB = parseTimeToMinutes(b.startAt);
  const endB = parseTimeToMinutes(b.endAt);
  return startA < endB && startB < endA;
}

function getOverlapGroups(shifts: StoreShift[]): StoreShift[][] {
  const parent = shifts.map((_, index) => index);

  function find(index: number): number {
    let root = index;
    while (parent[root] !== root) {
      parent[root] = parent[parent[root]];
      root = parent[root];
    }
    return root;
  }

  function union(a: number, b: number) {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) {
      parent[rootB] = rootA;
    }
  }

  for (let i = 0; i < shifts.length; i++) {
    for (let j = i + 1; j < shifts.length; j++) {
      if (shiftsOverlap(shifts[i], shifts[j])) {
        union(i, j);
      }
    }
  }

  const groups = new Map<number, StoreShift[]>();
  for (let i = 0; i < shifts.length; i++) {
    const root = find(i);
    const group = groups.get(root);
    if (group) {
      group.push(shifts[i]);
    } else {
      groups.set(root, [shifts[i]]);
    }
  }

  return [...groups.values()];
}

function assignLanesInGroup(
  shifts: StoreShift[],
): Map<string, { columnIndex: number; totalColumns: number }> {
  const sorted = [...shifts].sort(
    (a, b) => parseTimeToMinutes(a.startAt) - parseTimeToMinutes(b.startAt),
  );

  const laneEndTimes: number[] = [];
  const assignments = new Map<string, number>();

  for (const shift of sorted) {
    const start = parseTimeToMinutes(shift.startAt);
    const end = parseTimeToMinutes(shift.endAt);

    let laneIndex = laneEndTimes.findIndex((laneEnd) => laneEnd <= start);
    if (laneIndex === -1) {
      laneIndex = laneEndTimes.length;
      laneEndTimes.push(end);
    } else {
      laneEndTimes[laneIndex] = end;
    }

    assignments.set(shift.id, laneIndex);
  }

  const totalColumns =
    assignments.size === 0
      ? 1
      : Math.max(...assignments.values()) + 1;

  const result = new Map<string, { columnIndex: number; totalColumns: number }>();
  for (const [id, columnIndex] of assignments) {
    result.set(id, { columnIndex, totalColumns });
  }
  return result;
}

//겹치는 근무 카드의 가로 배치(레인) 계산 함수
export function computeShiftLanes(
  shifts: StoreShift[],
): Map<string, ShiftLaneLayout> {
  const result = new Map<string, ShiftLaneLayout>();

  for (const group of getOverlapGroups(shifts)) {
    const assignments = assignLanesInGroup(group);

    for (const [id, { columnIndex, totalColumns }] of assignments) {
      const widthPercent = 100 / totalColumns;
      result.set(id, {
        columnIndex,
        totalColumns,
        leftPercent: columnIndex * widthPercent,
        widthPercent,
      });
    }
  }

  return result;
}
