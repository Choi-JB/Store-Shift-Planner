//shift 관련 데이터 타입 정의

export type StoreShift = {
    id: string;
    date: string;
    employeeName: string;
    role: string;
    area: "cashier" | "display" | "storage" | "support";
    time: "morning" | "afternoon" | "closing";
    startAt: string;
    endAt: string;
    note?: string;
};
