"use client";

//근무 요약 컴포넌트 : 근무 구역별 근무 인원 수를 표시하는 컴포넌트

import { AREA_COLORS } from "./constants";
import { useShiftPlannerStore } from "./store";
import { getAreaSummary } from "./utils";

export default function ShiftSummary() {
  const selectedDate = useShiftPlannerStore((s) => s.selectedDate);
  const summary = getAreaSummary(selectedDate);
  const activeAreas = summary.byArea.filter(({ count }) => count > 0);

  //기본적으로 해당 구역의 근무자가 없을 경우 요약 정보를 표시하지 않음
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm">
        총 근무 {summary.total}명
      </span>

      {/* 해당 구역의 근무자가 있을 경우 요약 정보를 표시 : 근무 구역, 근무 인원 수 */}
      {activeAreas.map(({ area, label, count }) => {
        const colors = AREA_COLORS[area];

        return (
          <span
            key={area}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset ${colors.bg} ${colors.text} ${colors.border}`}
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`} />
            {label} {count}명
          </span>
        );
      })}
    </div>
  );
}
