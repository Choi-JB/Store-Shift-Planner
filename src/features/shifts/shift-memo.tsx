"use client";

import { useShiftPlannerStore } from "./store";
import { getShiftById } from "./utils";

export default function ShiftMemo() {
  const selectedShiftId = useShiftPlannerStore((s) => s.selectedShiftId);
  const memos = useShiftPlannerStore((s) => s.memos);
  const setMemo = useShiftPlannerStore((s) => s.setMemo);

  const shift = selectedShiftId ? getShiftById(selectedShiftId) : null;

  if (!shift) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800">근무 메모</h3>
        <p className="mt-3 text-sm text-slate-400">
          근무자를 선택하면 메모를 작성할 수 있습니다.
        </p>
      </div>
    );
  }

  const memo = memos[shift.id] ?? "";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">근무 메모</h3>
        <span className="text-xs text-slate-400">{shift.employeeName}</span>
      </div>
      <textarea
        value={memo}
        onChange={(e) => setMemo(shift.id, e.target.value)}
        placeholder="이 근무자에 대한 메모를 입력하세요..."
        rows={4}
        className="mt-3 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      <p className="mt-2 text-xs text-slate-400">
        메모는 이 세션 동안만 유지됩니다.
      </p>
    </div>
  );
}
