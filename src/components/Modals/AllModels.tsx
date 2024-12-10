// src/components/Modals/AllModels.tsx

import React, { useEffect, useState } from "react";
import { DataManager } from "../../services/DataManager";
import { useWaterLevelStore } from "../../stores/useWaterLevelStore";
import { CombinedData, TimeSpan } from "../../types/timeSeriesTypes";
import { filterTimeSeries } from "../../utils/timeSeriesUtils";
import RainLevelBarChartModal from "./RainLevelBarChartModal/RainLevelBarChartModal";
import WaterLevelLineChartModal from "./WaterLevelLineChartModal/WaterLevelLineChartModal";
import WaterLevelVisualizationModal from "./WaterLevelVisualizationModal/WaterLevelVisualizationModal";
import WellSummaryModal from "./WellSummaryModal/WellSummaryModal";

const AllModels: React.FC = () => {
    const [timeSpan, setTimeSpan] = useState<TimeSpan>("1D");
    const [combinedData, setCombinedData] = useState<CombinedData | null>(null);
    const selectedWellId = useWaterLevelStore((state) => state.selectedWellId);
    const setCombinedDataStore = useWaterLevelStore(
        (state) => state.setCombinedData
    );

    useEffect(() => {
        if (!selectedWellId) return; // Do nothing if no well is selected

        const loadData = async () => {
            try {
                const data = await DataManager.getCombinedData(selectedWellId);
                console.log(`Combined Data for ${selectedWellId}:`, data);
                setCombinedData(data);
                setCombinedDataStore(data); // Optionally store in Zustand
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        loadData();
    }, [selectedWellId, setCombinedDataStore]);

    if (!selectedWellId) {
        return <div>Please select a well from the map.</div>;
    }

    if (!combinedData) {
        return <div>Loading data for well {selectedWellId}...</div>;
    }

    const filteredWaterData = filterTimeSeries(
        combinedData.waterLevel,
        timeSpan
    );
    const filteredRainData = filterTimeSeries(combinedData.rainLevel, timeSpan);

    // Log filtered data for debugging
    console.log(`Filtered Water Data (${timeSpan}):`, filteredWaterData);
    console.log(`Filtered Rain Data (${timeSpan}):`, filteredRainData);

    return (
        <div
            id="all-models"
            className="absolute top-0 right-0 flex h-screen p-4"
        >
            {/* Column 1 */}
            <div
                id="all-models-column-1"
                className="flex flex-col space-y-4"
            >
                <WellSummaryModal
                    title={`Well ${selectedWellId}`}
                    coordinates={[`34°29'0.22" N`, `120°26'23.20" W`]} // Update coordinates based on well data
                    // You might want to pass additional props like well location, description, etc.
                />
                <div
                    id="water-level-visualization-modal-container"
                    className="w-[343px] h-[682px] rounded-xl bg-gradient-to-br from-black/70 to-black/50 text-white flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20"
                >
                    <WaterLevelVisualizationModal
                        layers={[
                            {
                                startDepth: 0,
                                endDepth: 3,
                                type: "unconsolidated-coarse-and-fine-grained", // "Unconsolidated: Mixture of coarse and fine grained"
                            },
                            {
                                startDepth: 3,
                                endDepth: 9,
                                type: "sedimentary-fine-grained", // "Consolidated: Fine grained (adobe, shale)"
                            },
                            {
                                startDepth: 9,
                                endDepth: 14,
                                type: "sedimentary-fine-grained", // "Consolidated: Fine grained (clay, shale)"
                            },
                            {
                                startDepth: 14,
                                endDepth: 22,
                                type: "sedimentary-fine-grained", // "Consolidated: Fine grained (shale)"
                            },
                            {
                                startDepth: 22,
                                endDepth: 29,
                                type: "unconsolidated-fine-grained", // "Unconsolidated: Fine grained (clay)"
                            },
                            {
                                startDepth: 29,
                                endDepth: 340, // Assuming it continues below 29 ft
                                type: "sedimentary-fine-grained", // "Consolidated: Fine grained (shale)"
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Column 2 */}
            <div
                id="all-models-column-2"
                className="flex flex-col ml-4 space-y-4"
            >
                <div
                    id="water-level-line-chart-modal-container"
                    className="w-[378px] h-[410px] p-7 rounded-xl bg-gradient-to-br from-black/70 to-black/50 text-white flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20"
                >
                    <WaterLevelLineChartModal
                        waterData={filteredWaterData}
                        rainData={filteredRainData}
                        timeSpan={timeSpan}
                        setTimeSpan={setTimeSpan}
                    />
                </div>
                <div
                    id="rain-level-bar-chart-modal-container"
                    className="w-[378px] h-[376px] p-7 rounded-xl bg-gradient-to-br from-black/70 to-black/50 text-white flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20"
                >
                    <RainLevelBarChartModal
                        waterData={filteredWaterData}
                        rainData={filteredRainData}
                        timeSpan={timeSpan}
                    />
                </div>
            </div>
        </div>
    );
};

export default AllModels;
