"use client";

import AreaFilter from "@/features/shifts/area-filter";
import DateSelector from "@/features/shifts/date-selector";
import ShiftDetail from "@/features/shifts/shift-detail";
import ShiftList from "@/features/shifts/shift-list";
import ShiftMemo from "@/features/shifts/shift-memo";
import ShiftSummary from "@/features/shifts/shift-summary";

export default function ShiftPlannerDashboard() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-slate-900">매장 근무 스케줄</h1>
          <p className="mt-1 text-sm text-slate-500">
            날짜, 근무 구역, 직원 기준으로 근무 일정을 확인하세요.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">날짜 선택</h2>
          <DateSelector />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-700">근무 요약</h2>
          <ShiftSummary />
        </section>

        <div className="grid gap-6 lg:grid-cols-5">
          <section className="space-y-4 lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">
                구역 필터
              </h2>
              <AreaFilter />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-slate-700">
                근무 목록
              </h2>
              <ShiftList />
            </div>
          </section>

          <aside className="space-y-4 lg:col-span-2">
            <div>
              <h2 className="mb-3 text-sm font-semibold text-slate-700">
                직원 상세
              </h2>
              <ShiftDetail />
            </div>
            <ShiftMemo />
          </aside>
        </div>
      </main>
    </div>
  );
}
