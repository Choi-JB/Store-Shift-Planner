"use client";
//근무 상세 컴포넌트 : 사용자가 근무 카드를 클릭 했을 때 뜨는 추가 정보 창
import { useState } from "react";
import {
  AREA_COLORS,
  AREA_LABELS,
  TIME_LABELS,
} from "./constants";
import { useShiftPlannerStore } from "./store";
import { formatDateLabel, getShiftById } from "./utils";

export default function ShiftDetail() {
  const selectedShiftId = useShiftPlannerStore((s) => s.selectedShiftId);
  const registeredNotes = useShiftPlannerStore((s) => s.registeredNotes);
  const setRegisteredNote = useShiftPlannerStore((s) => s.setRegisteredNote);
  const shift = selectedShiftId ? getShiftById(selectedShiftId) : null;

  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [draftMemo, setDraftMemo] = useState("");

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
  const displayNote = registeredNotes[shift.id] ?? shift.note ?? "";

  const openMemoModal = () => {
    setDraftMemo(displayNote);
    setIsMemoModalOpen(true);
  };

  const handleSaveMemo = () => {
    setRegisteredNote(shift.id, draftMemo.trim());
    setIsMemoModalOpen(false);
  };

  const handleCancelMemo = () => {
    setIsMemoModalOpen(false);
  };

  return (
    <>
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
          <DetailRow label="등록 메모">
            <div className="flex items-start justify-end gap-2">
              <span className="text-sm font-medium text-slate-800">
                {displayNote || (
                  <span className="font-normal text-slate-400">메모 없음</span>
                )}
              </span>
              <button
                type="button"
                onClick={openMemoModal}
                aria-label="등록 메모 편집"
                className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <EditIcon />
              </button>
            </div>
          </DetailRow>
        </dl>
      </div>

      {isMemoModalOpen && (
        <MemoEditModal
          draftMemo={draftMemo}
          onDraftChange={setDraftMemo}
          onSave={handleSaveMemo}
          onCancel={handleCancelMemo}
        />
      )}
    </>
  );
}

//메모 편집 버튼을 눌렀을 때 뜨는 modal 창 : 메모 작성
function MemoEditModal({
  draftMemo,
  onDraftChange,
  onSave,
  onCancel,
}: {
  draftMemo: string;
  onDraftChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="memo-modal-title"
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h4
          id="memo-modal-title"
          className="text-base font-semibold text-slate-900"
        >
          등록 메모 작성
        </h4>
        <textarea
          value={draftMemo}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="근무 등록 메모를 입력하세요..."
          rows={5}
          autoFocus
          className="mt-4 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            작성
          </button>
        </div>
      </div>
    </div>
  );
}

//근무 상세 정보 표시 컴포넌트 : 근무 날짜, 구역, 시간, 등록 메모
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

//메모 편집 아이콘 컴포넌트
function EditIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  );
}

//사용자 아이콘 컴포넌트
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
