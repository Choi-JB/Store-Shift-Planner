"use client";

//근무 목록 컴포넌트 : 근무 카드 목록을 표시하는 컴포넌트
import type { StoreShift } from "@/entities/types";
import {
  AREA_COLORS,
  AREA_LABELS,
  AREA_ORDER,
  TIME_LABELS,
} from "./constants";
import { useShiftPlannerStore } from "./store";
import { getShiftsByDate } from "./utils";

const TIMETABLE_START_HOUR = 8;
const TIMETABLE_END_HOUR = 23;
const HOUR_HEIGHT_PX = 52;
const COLUMN_MIN_WIDTH_PX = 120;

//시간 문자열을 분으로 변환 함수 : "09:00" -> 540
function parseTimeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

//시간 라벨 포맷팅 함수 : 8 -> 08:00
function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

//근무 시간과 위치 계산 함수 : "09:00", "14:00", 540 -> { top: 48, height: 48 }
function getShiftPosition(startAt: string, endAt: string, dayStartMinutes: number) {
  const startMinutes = parseTimeToMinutes(startAt);
  const endMinutes = parseTimeToMinutes(endAt);
  const top = ((startMinutes - dayStartMinutes) / 60) * HOUR_HEIGHT_PX;
  const height = Math.max(
    ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT_PX,
    48,
  );
  return { top, height };
}

//시간 라인 목록 생성 함수 : 8 -> [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
const timelineHours = Array.from(
  { length: TIMETABLE_END_HOUR - TIMETABLE_START_HOUR },
  (_, index) => TIMETABLE_START_HOUR + index,
);

//시간 라인 높이 계산 함수 : 8 -> 1040
const timelineHeightPx =
  (TIMETABLE_END_HOUR - TIMETABLE_START_HOUR) * HOUR_HEIGHT_PX;

//근무 카드 컴포넌트 : 근무 카드를 표시하는 컴포넌트
function ShiftCard({
  shift,
  isSelected,
  expanded,
  onSelect,
}: {
  shift: StoreShift;
  isSelected: boolean;
  expanded?: boolean;
  onSelect: () => void;
}) {
  const colors = AREA_COLORS[shift.area];
  const dayStartMinutes = TIMETABLE_START_HOUR * 60;
  const { top, height } = getShiftPosition(
    shift.startAt,
    shift.endAt,
    dayStartMinutes,
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{ top, height }}
      className={`absolute overflow-hidden rounded-lg border text-left transition ${
        expanded ? "inset-x-3 px-4 py-2" : "inset-x-1 px-2 py-1.5"
      } ${
        isSelected
          ? "z-10 border-slate-900 bg-slate-900 text-white shadow-md ring-2 ring-slate-900 ring-offset-1"
          : `bg-white hover:border-slate-300 hover:shadow-sm ${colors.border}`
      }`}
    >
      <div className={expanded ? "flex items-start justify-between gap-3" : ""}>
        <div className="min-w-0">
          <p
            className={`truncate font-semibold ${
              expanded ? "text-base" : "text-sm"
            } ${isSelected ? "text-white" : "text-slate-900"}`}
          >
            {shift.employeeName}
          </p>
          <p
            className={`truncate text-xs ${
              isSelected ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {shift.role}
          </p>
          {(expanded || height >= 64) && (
            <p
              className={`mt-1 truncate text-xs ${
                isSelected ? "text-slate-200" : "text-slate-600"
              }`}
            >
              {shift.startAt} – {shift.endAt}
            </p>
          )}
        </div>
        {(expanded || height >= 80) && (
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
              isSelected ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {TIME_LABELS[shift.time]}
          </span>
        )}
      </div>
    </button>
  );
}

//시간 라인 그리드 라인 컴포넌트 : y축 시간 라인 목록을 표시하는 컴포넌트
function TimelineGridLines() {
  return (
    <>
      {timelineHours.map((hour) => (
        <div
          key={hour}
          className="pointer-events-none absolute inset-x-0 border-t border-slate-100"
          style={{ top: (hour - TIMETABLE_START_HOUR) * HOUR_HEIGHT_PX }}
        />
      ))}
      <div
        className="pointer-events-none absolute inset-x-0 border-t border-slate-100"
        style={{ top: timelineHeightPx }}
      />
    </>
  );
}

//근무 목록 컴포넌트 : 근무 카드 목록을 표시하는 컴포넌트
export default function ShiftList() {
  const selectedDate = useShiftPlannerStore((s) => s.selectedDate);
  const selectedArea = useShiftPlannerStore((s) => s.selectedArea);
  const selectedShiftId = useShiftPlannerStore((s) => s.selectedShiftId);
  const setSelectedShiftId = useShiftPlannerStore((s) => s.setSelectedShiftId);

  //선택된 필터(근무 구역)에 해당하는 근무 카드만 표시
  const shifts = getShiftsByDate(selectedDate, selectedArea);
  const isAreaFiltered = selectedArea !== "all";
  const visibleAreas = isAreaFiltered ? [selectedArea] : AREA_ORDER;
  //근무 구역별 근무 카드 목록 생성
  const shiftsByArea = AREA_ORDER.reduce(
    (acc, area) => {
      acc[area] = shifts
        .filter((shift) => shift.area === area)
        .sort(
          (a, b) =>
            parseTimeToMinutes(a.startAt) - parseTimeToMinutes(b.startAt),
        );
      return acc;
    },
    {} as Record<StoreShift["area"], StoreShift[]>,
  );

  //근무 카드가 없을 때 빈 상태 표시
  if (shifts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
        <p className="text-sm font-medium text-slate-600">
          선택한 조건에 해당하는 근무가 없습니다.
        </p>
        <p className="mt-1 text-xs text-slate-400">
          날짜나 구역 필터를 변경해 보세요.
        </p>
      </div>
    );
  }

  //근무 카드가 있을 때 근무 목록 표시
  return (
    <div className={isAreaFiltered ? "" : "overflow-x-auto"}>
      <div
        className="min-w-full"
        style={{
          minWidth: isAreaFiltered
            ? undefined
            : 56 + AREA_ORDER.length * COLUMN_MIN_WIDTH_PX,
        }}
      >
        <div className="flex border-b border-slate-200 pb-2">
          <div className="w-14 shrink-0" />
          {visibleAreas.map((area) => {
            const colors = AREA_COLORS[area];
            return (
              <div
                key={area}
                className={`flex flex-1 items-center gap-1.5 px-1 ${
                  isAreaFiltered ? "justify-start pl-2" : "min-w-[120px] justify-center"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                <span
                  className={`font-semibold text-slate-700 ${
                    isAreaFiltered ? "text-sm" : "text-xs"
                  }`}
                >
                  {AREA_LABELS[area]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex">
          <div
            className="relative w-14 shrink-0 pr-2"
            style={{ height: timelineHeightPx }}
          >
            {timelineHours.map((hour) => (
              <div
                key={hour}
                className="absolute right-2 -translate-y-1/2 text-xs font-medium tabular-nums text-slate-400"
                style={{ top: (hour - TIMETABLE_START_HOUR) * HOUR_HEIGHT_PX }}
              >
                {formatHourLabel(hour)}
              </div>
            ))}
          </div>

          <div
            className={`grid flex-1 border-l border-slate-200 ${
              isAreaFiltered ? "grid-cols-1" : "grid-cols-4"
            }`}
            style={{ height: timelineHeightPx }}
          >
            {visibleAreas.map((area) => (
              <div
                key={area}
                className={`relative border-r border-slate-100 last:border-r-0 ${
                  isAreaFiltered ? "" : "min-w-[120px]"
                }`}
              >
                <TimelineGridLines />
                {shiftsByArea[area].map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    expanded={isAreaFiltered}
                    isSelected={selectedShiftId === shift.id}
                    onSelect={() => setSelectedShiftId(shift.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
