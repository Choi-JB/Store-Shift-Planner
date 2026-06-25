"use client";

import { AREA_COLORS } from "./constants";
import { useShiftPlannerStore } from "./store";
import { getAreaSummary } from "./utils";

export default function ShiftSummary() {
  const selectedDate = useShiftPlannerStore((s) => s.selectedDate);
  const summary = getAreaSummary(selectedDate);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          총 근무 인원
        </p>
        <p className="mt-1 text-3xl font-bold text-slate-900">{summary.total}</p>
        <p className="mt-1 text-sm text-slate-500">명</p>
      </div>

      {summary.byArea.map(({ area, label, count }) => {
        const colors = AREA_COLORS[area];

        return (
          <div
            key={area}
            className={`rounded-xl border p-4 shadow-sm ${colors.bg} ${colors.border}`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
              <p className={`text-xs font-medium ${colors.text}`}>{label}</p>
            </div>
            <p className={`mt-1 text-2xl font-bold ${colors.text}`}>{count}</p>
            <p className={`mt-1 text-sm ${colors.text} opacity-70`}>명</p>
          </div>
        );
      })}
    </div>
  );
}
