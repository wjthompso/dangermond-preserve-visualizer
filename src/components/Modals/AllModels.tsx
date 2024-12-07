// src/components/Modals/AllModels.tsx

import React, { useEffect, useState } from "react";
import { CombinedData, DataManager } from "../../services/DataManager";
import { TimeSpan } from "../../types/timeSeriesTypes";
import { filterTimeSeries } from "../../utils/timeSeriesUtils"; // Import the utility
import RainLevelBarChartModal from "./RainLevelBarChartModal/RainLevelBarChartModal";
import WaterLevelLineChartModal from "./WaterLevelLineChartModal/WaterLevelLineChartModal";
import WaterLevelVisualizationModal from "./WaterLevelVisualizationModal/WaterLevelVisualizationModal";
import WellSummaryModal from "./WellSummaryModal/WellSummaryModal";

const AllModels: React.FC = () => {
    const [timeSpan, setTimeSpan] = useState<TimeSpan>("1D"); // Initial time span set to "1D"
    const [combinedData, setCombinedData] = useState<CombinedData | null>(null);
    const wellId = "Escondido_5"; // Replace with actual well ID as needed

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await DataManager.getCombinedData(wellId);
                console.log("Combined Data:", data);
                setCombinedData(data);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        loadData();
    }, [wellId]);

    useEffect(() => {
        if (combinedData) {
            // Apply filtering based on the selected timeSpan
            const filteredWaterData = filterTimeSeries(
                combinedData.waterLevel,
                timeSpan
            );
            const filteredRainData = filterTimeSeries(
                combinedData.rainLevel,
                timeSpan
            );

            // Console log the filtered data
            console.log(
                `Filtered Water Data (${timeSpan}):`,
                filteredWaterData
            );
            console.log(`Filtered Rain Data (${timeSpan}):`, filteredRainData);
        }
    }, [combinedData, timeSpan]);

    if (!combinedData) {
        return <div>Loading data...</div>;
    }

    // For now, continue using mock data for child components
    const mockXData = ["10", "11", "12", "13", "14", "15", "16", "17"];
    const mockYData = [121, 122, 121, 125, 130, 124.8, 123, 126];

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
                    title="Escondido Well"
                    coordinates={[`34°29'0.22" N`, `120°26'23.20" W`]}
                />
                <div
                    id="water-level-visualization-modal-container"
                    className="w-[343px] h-[682px] rounded-xl bg-gradient-to-br from-black/70 to-black/50 text-white flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20"
                >
                    <WaterLevelVisualizationModal
                        layers={[
                            {
                                startDepth: 0,
                                endDepth: 100,
                                type: "unconsolidated-coarse-grained",
                            },
                            {
                                startDepth: 100,
                                endDepth: 200,
                                type: "sedimentary-coarse-and-fine-grained",
                            },
                            {
                                startDepth: 200,
                                endDepth: 300,
                                type: "unconsolidated-mostly-fine-grained",
                            },
                        ]}
                        waterLevel={25}
                        maxDepth={300}
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
                        xData={mockXData}
                        yData={mockYData}
                    />
                </div>
                <div
                    id="rain-level-bar-chart-modal-container"
                    className="w-[378px] h-[376px] p-7 rounded-xl bg-gradient-to-br from-black/70 to-black/50 text-white flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20"
                >
                    <RainLevelBarChartModal />
                </div>
            </div>
        </div>
    );
};

export default AllModels;
