import { create } from "zustand";
import type { AreaFilter } from "@/features/shifts/constants";

//shift planner 상태 관리
type ShiftPlannerState = {
  selectedDate: string;
  selectedArea: AreaFilter;
  selectedShiftId: string | null;
  registeredNotes: Record<string, string>;
  setSelectedDate: (date: string) => void;
  setSelectedArea: (area: AreaFilter) => void;
  setSelectedShiftId: (id: string | null) => void;
  setRegisteredNote: (shiftId: string, note: string) => void;
};

//shift planner 상태 관리 함수
//사용자가 선택한 날짜, 구역, 근무자를 저장하고, 근무자의 메모를 저장하는 함수
export const useShiftPlannerStore = create<ShiftPlannerState>((set) => ({
  selectedDate: "2026-06-25",
  selectedArea: "all",
  selectedShiftId: null,
  registeredNotes: {},
  setSelectedDate: (date) =>
    set({ selectedDate: date, selectedShiftId: null }),
  setSelectedArea: (area) => set({ selectedArea: area }),
  setSelectedShiftId: (id) => set({ selectedShiftId: id }),
  setRegisteredNote: (shiftId, note) =>
    set((state) => ({
      registeredNotes: { ...state.registeredNotes, [shiftId]: note },
    })),
}));
