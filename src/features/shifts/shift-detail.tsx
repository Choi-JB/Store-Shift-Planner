"use client";

import {
  AREA_COLORS,
  AREA_LABELS,
  TIME_LABELS,
} from "./constants";
import { useShiftPlannerStore } from "./store";
import { formatDateLabel, getShiftById } from "./utils";

export default function ShiftDetail() {
  const selectedShiftId = useShiftPlannerStore((s) => s.selectedShiftId);
  const shift = selectedShiftId ? getShiftById(selectedShiftId) : null;

  if (!shift) {
    return (
      <div className="flex h-full min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <UserIcon />
        <p className="mt-3 text-sm font-medium text-slate-600">
          근무 카드를 선택하세요
        </p>
        <p className="mt-1 text-xs text-slate-400">
          직원 상세 정보가 여기에 표시됩니다.
        </p>
      </div>
    );
  }

  const colors = AREA_COLORS[shift.area];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold ${colors.bg} ${colors.text}`}
        >
          {shift.employeeName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-900">
            {shift.employeeName}
          </h3>
          <p className="text-sm text-slate-500">{shift.role}</p>
        </div>
      </div>

      <dl className="mt-5 space-y-3">
        <DetailRow label="근무 날짜" value={formatDateLabel(shift.date)} />
        <DetailRow label="근무 구역">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
            {AREA_LABELS[shift.area]}
          </span>
        </DetailRow>
        <DetailRow label="근무 시간" value={TIME_LABELS[shift.time]} />
        <DetailRow
          label="시간대"
          value={`${shift.startAt} – ${shift.endAt}`}
        />
        {shift.note && (
          <DetailRow label="등록 메모" value={shift.note} />
        )}
      </dl>
    </div>
  );
}

function DetailRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <dt className="shrink-0 text-sm text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-800">
        {children ?? value}
      </dd>
    </div>
  );
}

function UserIcon() {
  return (
    <svg
      className="h-10 w-10 text-slate-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
      />
    </svg>
  );
}
