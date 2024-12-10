// src/stores/useWaterLevelStore.ts

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { CombinedData } from "../types/timeSeriesTypes";

interface WaterLevelState {
    waterLevel: number;
    setWaterLevel: (level: number) => void;
    hoveredAxisIndex: number | null;
    setHoveredAxisIndex: (index: number | null) => void;
    selectedWellId: string | null; // Newly added
    setSelectedWellId: (wellId: string) => void; // Newly added
    combinedData: CombinedData | null; // Optionally store combined data
    setCombinedData: (data: CombinedData) => void; // Setter for combined data
}

export const useWaterLevelStore = create<WaterLevelState>()(
    subscribeWithSelector((set) => ({
        waterLevel: 100,
        setWaterLevel: (level: number) => set({ waterLevel: level }),
        hoveredAxisIndex: null,
        setHoveredAxisIndex: (index: number | null) =>
            set({ hoveredAxisIndex: index }),
        selectedWellId: null, // Initialize as null or a default well ID
        setSelectedWellId: (wellId: string) => set({ selectedWellId: wellId }),
        combinedData: null, // Initialize as null
        setCombinedData: (data: CombinedData) => set({ combinedData: data }),
    }))
);
