// useWaterLevelStore.ts
import { create } from "zustand";

interface WaterLevelState {
    waterLevel: number;
    setWaterLevel: (level: number) => void;
}

export const useWaterLevelStore = create<WaterLevelState>(
    (set: (partial: Partial<WaterLevelState>) => void) => ({
        waterLevel: 0,
        setWaterLevel: (level: number) => set({ waterLevel: level }),
    })
);
