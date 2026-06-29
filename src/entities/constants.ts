import type { StoreShift } from "@/entities/types";

//구역(필터) 관련 상수, 라벨, 옵션

export type AreaFilter = "all" | StoreShift["area"];

//구역 순서
export const AREA_ORDER: StoreShift["area"][] = [
  "cashier",
  "display",
  "storage",
  "support",
];

//구역 라벨
export const AREA_LABELS: Record<StoreShift["area"], string> = {
  cashier: "계산대",
  display: "진열",
  storage: "창고",
  support: "고객 응대",
};

//구역 필터 옵션
export const AREA_FILTER_OPTIONS: { value: AreaFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "cashier", label: AREA_LABELS.cashier },
  { value: "display", label: AREA_LABELS.display },
  { value: "storage", label: AREA_LABELS.storage },
  { value: "support", label: AREA_LABELS.support },
];

//근무 시간 라벨
export const TIME_LABELS: Record<StoreShift["time"], string> = {
  morning: "오전",
  afternoon: "오후",
  closing: "마감",
};

//구역 색상 : 사용자가 선택한 구역 강조(css용 클래스 이름값)
export const AREA_COLORS: Record<
  StoreShift["area"],
  { bg: string; text: string; border: string; dot: string }
> = {
  cashier: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  display: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  storage: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  support: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-500",
  },
};
