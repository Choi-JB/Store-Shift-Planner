"use client";

import { create } from "zustand";
import type { AreaFilter } from "./constants";

type ShiftPlannerState = {
  selectedDate: string;
  selectedArea: AreaFilter;
  selectedShiftId: string | null;
  memos: Record<string, string>;
  setSelectedDate: (date: string) => void;
  setSelectedArea: (area: AreaFilter) => void;
  setSelectedShiftId: (id: string | null) => void;
  setMemo: (shiftId: string, memo: string) => void;
};

export const useShiftPlannerStore = create<ShiftPlannerState>((set) => ({
  selectedDate: "2026-06-25",
  selectedArea: "all",
  selectedShiftId: null,
  memos: {},
  setSelectedDate: (date) =>
    set({ selectedDate: date, selectedShiftId: null }),
  setSelectedArea: (area) => set({ selectedArea: area }),
  setSelectedShiftId: (id) => set({ selectedShiftId: id }),
  setMemo: (shiftId, memo) =>
    set((state) => ({
      memos: { ...state.memos, [shiftId]: memo },
    })),
}));
