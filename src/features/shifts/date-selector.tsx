"use client";

//날짜 선택 컴포넌트
import { useEffect, useRef, useState } from "react";
import { useShiftPlannerStore } from "./store";
import { formatDateLabel, getShiftDates, toDateString } from "./utils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function DateSelector() {
  const selectedDate = useShiftPlannerStore((s) => s.selectedDate);
  const setSelectedDate = useShiftPlannerStore((s) => s.setSelectedDate);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [year, month] = selectedDate.split("-").map(Number);
  const [viewYear, setViewYear] = useState(year);
  const [viewMonth, setViewMonth] = useState(month);

  const shiftDates = new Set(getShiftDates());

   //사용자가 달력창을 열어 날짜를 선택할 때
  useEffect(() => {
    if (!open) return;
    const [y, m] = selectedDate.split("-").map(Number);
    setViewYear(y);
    setViewMonth(m);
  }, [open, selectedDate]);
 
  //사용자가 달력창을 열어 날짜를 선택할 때 달력창을 닫는 이벤트 핸들러 : 사용자가 달력창 밖을 클릭하면 달력창을 닫음
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();

  function handlePrevMonth() {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleSelectDay(day: number) {
    setSelectedDate(toDateString(viewYear, viewMonth, day));
    setOpen(false);
  }

  const calendarDays: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <CalendarIcon />
        <span>{formatDateLabel(selectedDate)}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="날짜 선택"
          className="absolute left-0 top-full z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="이전 달"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-slate-800">
              {viewYear}년 {viewMonth}월
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="다음 달"
            >
              ›
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((day, index) => (
              <div
                key={day}
                className={`py-1 text-center text-xs font-medium ${
                  index === 0
                    ? "text-red-500"
                    : index === 6
                      ? "text-blue-500"
                      : "text-slate-400"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} />;
              }

              const dateStr = toDateString(viewYear, viewMonth, day);
              const isSelected = dateStr === selectedDate;
              const hasShifts = shiftDates.has(dateStr);
              const dayOfWeek = (firstDay + day - 1) % 7;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-lg text-sm transition ${
                    isSelected
                      ? "bg-slate-900 font-semibold text-white"
                      : hasShifts
                        ? "bg-slate-100 font-medium text-slate-800 hover:bg-slate-200"
                        : "text-slate-600 hover:bg-slate-50"
                  } ${dayOfWeek === 0 && !isSelected ? "text-red-500" : ""} ${
                    dayOfWeek === 6 && !isSelected ? "text-blue-500" : ""
                  }`}
                >
                  {day}
                  {hasShifts && !isSelected && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-slate-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-5 w-5 text-slate-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M4.5 9.75h15M4.5 6.75A2.25 2.25 0 016.75 4.5h10.5a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-12z"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 text-slate-400 transition ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
