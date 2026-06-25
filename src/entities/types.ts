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
