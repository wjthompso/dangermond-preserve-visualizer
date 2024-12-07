// src/stores/useWaterLevelStore.ts

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface WaterLevelState {
    waterLevel: number;
    setWaterLevel: (level: number) => void;
    hoveredAxisIndex: number | null;
    setHoveredAxisIndex: (index: number | null) => void;
}

export const useWaterLevelStore = create<WaterLevelState>()(
    subscribeWithSelector((set) => ({
        waterLevel: 0,
        setWaterLevel: (level: number) => set({ waterLevel: level }),
        hoveredAxisIndex: null,
        setHoveredAxisIndex: (index: number | null) =>
            set({ hoveredAxisIndex: index }),
    }))
);
