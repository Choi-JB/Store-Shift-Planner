"use client";

import { AREA_COLORS, AREA_LABELS, TIME_LABELS } from "./constants";
import { useShiftPlannerStore } from "./store";
import { getShiftsByDate } from "./utils";

export default function ShiftList() {
  const selectedDate = useShiftPlannerStore((s) => s.selectedDate);
  const selectedArea = useShiftPlannerStore((s) => s.selectedArea);
  const selectedShiftId = useShiftPlannerStore((s) => s.selectedShiftId);
  const setSelectedShiftId = useShiftPlannerStore((s) => s.setSelectedShiftId);

  const shifts = getShiftsByDate(selectedDate, selectedArea);

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

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {shifts.map((shift) => {
        const colors = AREA_COLORS[shift.area];
        const isSelected = selectedShiftId === shift.id;

        return (
          <button
            key={shift.id}
            type="button"
            onClick={() => setSelectedShiftId(shift.id)}
            className={`rounded-xl border p-4 text-left transition ${
              isSelected
                ? "border-slate-900 bg-slate-900 text-white shadow-md ring-2 ring-slate-900 ring-offset-2"
                : `bg-white hover:border-slate-300 hover:shadow-sm ${colors.border}`
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p
                  className={`text-base font-semibold ${
                    isSelected ? "text-white" : "text-slate-900"
                  }`}
                >
                  {shift.employeeName}
                </p>
                <p
                  className={`mt-0.5 text-sm ${
                    isSelected ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {shift.role}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : `${colors.bg} ${colors.text}`
                }`}
              >
                {AREA_LABELS[shift.area]}
              </span>
            </div>

            <div
              className={`mt-3 flex items-center gap-2 text-sm ${
                isSelected ? "text-slate-200" : "text-slate-600"
              }`}
            >
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                  isSelected ? "bg-white/15" : "bg-slate-100"
                }`}
              >
                {TIME_LABELS[shift.time]}
              </span>
              <span>
                {shift.startAt} – {shift.endAt}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
