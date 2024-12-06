import { create } from "zustand";

interface WaterLevelState {
    waterLevel: number;
    setWaterLevel: (level: number) => void;
    hoveredAxisIndex: number | null;
    setHoveredAxisIndex: (index: number | null) => void;
}

export const useWaterLevelStore = create<WaterLevelState>((set) => ({
    waterLevel: 0,
    setWaterLevel: (level: number) => set({ waterLevel: level }),
    hoveredAxisIndex: null,
    setHoveredAxisIndex: (index: number | null) =>
        set({ hoveredAxisIndex: index }),
}));
