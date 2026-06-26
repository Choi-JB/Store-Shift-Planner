"use client";

//구역 필터 컴포넌트
import { AREA_FILTER_OPTIONS } from "./constants";
import { useShiftPlannerStore } from "./store";

export default function AreaFilter() {
  const selectedArea = useShiftPlannerStore((s) => s.selectedArea);
  const setSelectedArea = useShiftPlannerStore((s) => s.setSelectedArea);

  return (
    <div className="flex flex-wrap gap-2">
      {AREA_FILTER_OPTIONS.map((option) => {
        const isActive = selectedArea === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelectedArea(option.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
