// src/stores/useWaterLevelStore.ts

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { TimeSeriesData } from "../types/timeSeriesTypes"; // Adjust the import path as necessary

interface WaterLevelState {
    waterLevel: number;
    setWaterLevel: (level: number) => void;
    hoveredAxisIndex: number | null;
    setHoveredAxisIndex: (index: number | null) => void;
    hoveredDateTime: string | null;
    setHoveredDateTime: (dateTime: string | null) => void;
    waterLevelData: TimeSeriesData[]; // Added to store water data
    setWaterLevelData: (data: TimeSeriesData[]) => void; // Setter for water data
}

export const useWaterLevelStore = create<WaterLevelState>()(
    subscribeWithSelector((set) => ({
        waterLevel: 0,
        setWaterLevel: (level: number) => set({ waterLevel: level }),
        hoveredAxisIndex: null,
        setHoveredAxisIndex: (index: number | null) =>
            set({ hoveredAxisIndex: index }),
        hoveredDateTime: null,
        setHoveredDateTime: (dateTime: string | null) =>
            set({ hoveredDateTime: dateTime }),
        waterLevelData: [],
        setWaterLevelData: (data: TimeSeriesData[]) =>
            set({ waterLevelData: data }),
    }))
);
