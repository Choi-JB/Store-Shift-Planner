import { create } from "zustand";
import type { AreaFilter } from "@/entities/constants";
import { getShiftsByDate } from "@/shared/utils";
import type { StoreShift } from "@/entities/types";

//전역 상태 관리 파일

//shift planner 상태 관리
type ShiftPlannerState = {
  shifts: StoreShift[]; //전체 근무 목록
  selectedDate: string; //현재 선택 날짜
  selectedArea: AreaFilter; //현재 선택 구역
  selectedShiftId: string | null; //현재 선택 근무자 ID
  registeredNotes: Record<string, string>; //근무자 ID별 메모

  setShifts: (shifts: StoreShift[]) => void; //근무 목록 불러오기
  setSelectedDate: (date: string) => void;  //날짜 선택 함수
  setSelectedArea: (area: AreaFilter) => void; //구역(필터) 선택 함수
  setSelectedShiftId: (id: string | null) => void; //근무카드(클릭) 선택 함수
  setRegisteredNote: (shiftId: string, note: string) => void; //메모 저장 함수
};

//shift planner 상태 관리 함수
//사용자가 선택한 날짜, 구역, 근무자를 저장하고, 근무자의 메모를 저장하는 함수
export const useShiftPlannerStore = create<ShiftPlannerState>((set) => ({
  shifts: [] as StoreShift[],
  selectedDate: "2026-06-25",
  selectedArea: "all",
  selectedShiftId: null,
  registeredNotes: {},
  setShifts: (shifts) => set({ shifts: getShiftsByDate("2026-06-25", "all") }),
  setSelectedDate: (date) =>
    set({ selectedDate: date, selectedShiftId: null }),
  setSelectedArea: (area) => set({ selectedArea: area }),
  setSelectedShiftId: (id) => set({ selectedShiftId: id }),
  setRegisteredNote: (shiftId, note) =>
    set((state) => ({
      registeredNotes: { ...state.registeredNotes, [shiftId]: note },
    })),
}));
