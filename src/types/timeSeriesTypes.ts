// src/types/timeSeriesTypes.ts

export type TimeSpan = "1D" | "1W" | "3M" | "6M" | "1Y" | "2Y" | "3Y" | "ALL";

export interface TimeSeriesData {
    dateTime: string; // ISO string, e.g., "2024-11-08T12:49:57Z"
    value: number;
}
