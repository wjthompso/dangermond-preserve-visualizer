import React from "react";
import RainLevelBarChartModal from "./RainLevelBarChartModal/RainLevelBarChartModal";
import WaterLevelLineChartModal from "./WaterLevelLineChartModal/WaterLevelLineChartModal";
import WaterLevelVisualizationModal from "./WaterLevelVisualizationModal/WaterLevelVisualizationModal";
import WellSummaryModal from "./WellSummaryModal/WellSummaryModal";

const AllModels: React.FC = () => {
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
                    <WaterLevelLineChartModal />
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
