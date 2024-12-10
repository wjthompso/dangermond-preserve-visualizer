import React, { useState } from "react";
import { useWaterLevelStore } from "../../../stores/useWaterLevelStore"; // Import Zustand store

interface LithologyLayer {
    startDepth: number;
    endDepth: number;
    type: string; // Unique identifier for the lithology layer
}

interface LithologyLegendItem {
    type: string; // Unique identifier
    label: string; // Display label for the legend
    group: string; // Group the item belongs to (e.g., "Unconsolidated")
}

interface WellVisualizationProps {
    layers: LithologyLayer[];
    maxDepth: number; // Total depth of the well
}

const lithologyColors: Record<string, string> = {
    "unconsolidated-coarse-grained": "bg-[#391600]",
    "unconsolidated-mostly-coarse-grained": "bg-[#5A2300]",
    "unconsolidated-coarse-and-fine-grained": "bg-[#9E3D01]",
    "unconsolidated-mostly-fine-grained": "bg-[#D75300]",
    "unconsolidated-fine-grained": "bg-[#FF7E4F]",
    // Updated sedimentary colors
    "sedimentary-coarse-grained": "bg-[#610100]",
    "sedimentary-mostly-coarse-grained": "bg-[#AE0C0C]",
    "sedimentary-coarse-and-fine-grained": "bg-[#FF0000]",
    "sedimentary-mostly-fine-grained": "bg-[#FF413B]",
    "sedimentary-fine-grained": "bg-[#FE9390]",
    "other-till": "bg-[#FF0084]",
    "other-carbonate": "bg-[#41FDFE]",
    "other-volcanic": "bg-[#45BE44]",
    "other-evaporite": "bg-[#F8E627]",
    "other-endogenous": "bg-[#884B9E]",
};

const lithologyLegend: LithologyLegendItem[] = [
    {
        type: "unconsolidated-coarse-grained",
        label: "Coarse-grained",
        group: "Unconsolidated",
    },
    {
        type: "unconsolidated-mostly-coarse-grained",
        label: "Mostly coarse-grained",
        group: "Unconsolidated",
    },
    {
        type: "unconsolidated-coarse-and-fine-grained",
        label: "Coarse- and fine-grained",
        group: "Unconsolidated",
    },
    {
        type: "unconsolidated-mostly-fine-grained",
        label: "Mostly fine-grained",
        group: "Unconsolidated",
    },
    {
        type: "unconsolidated-fine-grained",
        label: "Fine-grained",
        group: "Unconsolidated",
    },
    {
        type: "sedimentary-coarse-grained",
        label: "Coarse-grained",
        group: "Clastic sedimentary",
    },
    {
        type: "sedimentary-mostly-coarse-grained",
        label: "Mostly coarse-grained",
        group: "Clastic sedimentary",
    },
    {
        type: "sedimentary-coarse-and-fine-grained",
        label: "Coarse- and fine-grained",
        group: "Clastic sedimentary",
    },
    {
        type: "sedimentary-mostly-fine-grained",
        label: "Mostly fine-grained",
        group: "Clastic sedimentary",
    },
    {
        type: "sedimentary-fine-grained",
        label: "Fine-grained",
        group: "Clastic sedimentary",
    },
    { type: "other-till", label: "Till", group: "Other" },
    {
        type: "other-carbonate",
        label: "Carbonate (e.g., limestone)",
        group: "Other",
    },
    {
        type: "other-volcanic",
        label: "Volcanic (e.g., basalt)",
        group: "Other",
    },
    {
        type: "other-evaporite",
        label: "Evaporite (e.g., gypsum)",
        group: "Other",
    },
    {
        type: "other-endogenous",
        label: "Endogenous (e.g., granite)",
        group: "Other",
    },
];

/**
 * Calculates the optimal label interval based on the maximum depth and the maximum number of labels.
 * @param maxDepth - The total depth of the well.
 * @param maxLabels - The maximum number of labels to display.
 * @returns The chosen interval for labels.
 */
const calculateLabelIntervals = (maxDepth: number, maxLabels: number = 16) => {
    const possibleIntervals = [5, 10, 20, 25, 50, 100];
    for (let interval of possibleIntervals) {
        if (Math.floor(maxDepth / interval) <= maxLabels) {
            return interval;
        }
    }
    return 100; // Default to 100 if no smaller interval works
};

const WellVisualization: React.FC<WellVisualizationProps> = ({
    layers,
    maxDepth,
}) => {
    const [hoveredType, setHoveredType] = useState<string | null>(null);
    // Subscribe to waterLevel changes. This will cause re-renders only when waterLevel changes.
    const waterLevel = useWaterLevelStore((state) => state.waterLevel);

    const hoveredGroup = hoveredType
        ? lithologyLegend.find((item) => item.type === hoveredType)?.group
        : null;

    // Determine the interval for Y-axis labels
    const interval = calculateLabelIntervals(maxDepth);

    // Calculate the maximum label that does not exceed the maxDepth
    const maxLabel = Math.floor(maxDepth / interval) * interval;

    // Calculate the padding depth below the last label
    const paddingDepth = maxDepth - maxLabel;

    // Generate labels up to maxLabel
    const labels = Array.from(
        { length: Math.floor(maxDepth / interval) + 1 },
        (_, i) => i * interval
    );

    // Group legend items by their group name
    const groupedLegend = lithologyLegend.reduce<
        Record<string, LithologyLegendItem[]>
    >((acc, item) => {
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(item);
        return acc;
    }, {});

    // Calculate the height percentage for the water column based on water level
    const waterColumnHeightPercentage =
        ((maxDepth - waterLevel) / maxDepth) * 100;

    // Calculate the padding percentage for Y-axis labels
    const paddingPercentage = (paddingDepth / maxDepth) * 100;

    return (
        <div
            id="water-level-visualization-content"
            className="flex items-start justify-center pt-4 pl-4"
        >
            {/* Well Visualization */}
            <div
                id="water-level-visualization-graphic"
                className="flex items-center justify-center h-[615px] w-[100px] relative"
            >
                {/* Y-Axis Labels with Dynamic Padding */}
                <div
                    className="absolute left-0 top-0 h-full w-[30px] flex flex-col text-gray-400 text-[11px] -ml-6"
                    style={{
                        paddingBottom: `${paddingPercentage}%`, // Dynamic padding
                    }}
                >
                    {labels.map((label, index) => (
                        <div
                            key={index}
                            className="absolute right-0 text-right"
                            style={{
                                top: `${(label / maxDepth) * 100}%`,
                                transform: "translateY(-50%)",
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                {/* Left Lithology Layers */}
                <div className="relative flex flex-col w-[0.875rem] h-full">
                    {layers.map((layer, index) => {
                        const heightFraction =
                            (layer.endDepth - layer.startDepth) / maxDepth;
                        return (
                            <div
                                key={index}
                                className={`relative ${
                                    lithologyColors[layer.type]
                                } flex-grow ${
                                    hoveredType && hoveredType !== layer.type
                                        ? "opacity-10"
                                        : "opacity-100"
                                }`}
                                onMouseEnter={() => setHoveredType(layer.type)}
                                onMouseLeave={() => setHoveredType(null)}
                                style={{
                                    flexGrow: heightFraction,
                                    backgroundImage:
                                        "url('/assets/rock-texture-semi-transparent-overlay.png')",
                                    backgroundSize: "cover",
                                    backgroundBlendMode: "overlay",
                                    outline:
                                        hoveredType === layer.type
                                            ? "1px solid white"
                                            : "none",
                                    transition: "opacity 0.3s, outline 0.1s",
                                }}
                            ></div>
                        );
                    })}
                </div>

                {/* Water Column */}
                <div className="relative w-[3.2rem] h-full">
                    {/* Water portion (at the bottom) */}
                    <div
                        className="absolute bottom-0 left-0 w-full text-sm text-white bg-gradient-to-t to-[#5E9BDC] from-[#1366C0] overflow-hidden transition-all duration-700 ease-in-out"
                        style={{
                            height: `${waterColumnHeightPercentage}%`,
                        }}
                    >
                        <div
                            className="absolute inset-0 mx-1 mt-1"
                            style={{
                                backgroundImage:
                                    "url('/assets/Air Bubbles In Water.svg')",
                                backgroundSize: "100% auto",
                                backgroundRepeat: "repeat-y",
                                backgroundPosition: "top",
                            }}
                        ></div>
                    </div>

                    {/* Floating Water Level Indicator */}
                    <div
                        className="absolute w-full transition-all duration-700 ease-in-out -translate-x-1/2 left-1/2"
                        style={{
                            top: `calc(${
                                (waterLevel / maxDepth) * 100
                            }% - 2.3rem)`,
                        }}
                    >
                        <div
                            id="water-level-indicator"
                            className="flex flex-col items-center w-full"
                        >
                            <div className="w-full text-xs font-medium text-center text-[#B4D9FF] mb-[0.125rem]">
                                {waterLevel} ft
                            </div>
                            <div
                                id="indicator-triangle"
                                className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-[#B4D9FF] rounded-sm"
                            ></div>
                        </div>
                    </div>

                    {/* Invisible Hover Targets for Each Layer */}
                    <div className="absolute inset-0 z-10 flex flex-col">
                        {layers.map((layer, index) => {
                            const heightFraction =
                                (layer.endDepth - layer.startDepth) / maxDepth;
                            return (
                                <div
                                    key={index}
                                    style={{
                                        flexGrow: heightFraction,
                                        // No visible background needed
                                    }}
                                    onMouseEnter={() =>
                                        setHoveredType(layer.type)
                                    }
                                    onMouseLeave={() => setHoveredType(null)}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Right Lithology Layers */}
                <div className="relative flex flex-col w-[0.875rem] h-full">
                    {layers.map((layer, index) => {
                        const heightFraction =
                            (layer.endDepth - layer.startDepth) / maxDepth;
                        return (
                            <div
                                key={index}
                                className={`relative ${
                                    lithologyColors[layer.type]
                                } flex-grow ${
                                    hoveredType && hoveredType !== layer.type
                                        ? "opacity-10"
                                        : "opacity-100"
                                }`}
                                onMouseEnter={() => setHoveredType(layer.type)}
                                onMouseLeave={() => setHoveredType(null)}
                                style={{
                                    flexGrow: heightFraction,
                                    backgroundImage:
                                        "url('/assets/rock-texture-semi-transparent-overlay.png')",
                                    backgroundSize: "cover",
                                    backgroundBlendMode: "overlay",
                                    outline:
                                        hoveredType === layer.type
                                            ? "1px solid white"
                                            : "none",
                                    transition: "opacity 0.3s, outline 0.1s",
                                }}
                            ></div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col w-[180px] space-y-4 -mt-2 ml-2">
                {Object.entries(groupedLegend).map(([group, items]) => (
                    <div
                        key={group}
                        className={`transition-opacity duration-300 ${
                            hoveredType &&
                            !items.some((item) => item.type === hoveredType)
                                ? "opacity-10"
                                : "opacity-100"
                        }`}
                    >
                        <div className="mb-1 text-lg font-medium text-white">
                            {group}
                        </div>
                        <div className="space-y-1">
                            {items.map((item) => (
                                <div
                                    key={item.type}
                                    className={`flex items-center space-x-2 transition-opacity duration-300 ${
                                        hoveredType && hoveredType !== item.type
                                            ? "opacity-10"
                                            : "opacity-100"
                                    }`}
                                >
                                    <div
                                        className={`w-4 h-4 rounded border-[1px] border-[#808080] ${
                                            lithologyColors[item.type]
                                        }`}
                                    ></div>
                                    <div className="text-xs font-medium text-gray-200">
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WellVisualization;
