import React, { useState } from "react";

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
    waterLevel: number; // Water level in feet
    maxDepth: number; // Total depth of the well
}

const lithologyColors: Record<string, string> = {
    "unconsolidated-coarse-grained": "bg-[#391600]",
    "unconsolidated-mostly-coarse-grained": "bg-[#5A2300]",
    "unconsolidated-coarse-and-fine-grained": "bg-[#9E3D01]",
    "unconsolidated-mostly-fine-grained": "bg-[#D75300]",
    "unconsolidated-fine-grained": "bg-[#FF7E4F]",
    "sedimentary-coarse-grained": "bg-[#141414]",
    "sedimentary-mostly-coarse-grained": "bg-[#2F2F2F]",
    "sedimentary-coarse-and-fine-grained": "bg-[#616161]",
    "sedimentary-mostly-fine-grained": "bg-[#9A9A9A]",
    "sedimentary-fine-grained": "bg-[#D5D5D5]",
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

const calculateLabelIntervals = (maxDepth: number, maxLabels: number = 16) => {
    const possibleIntervals = [5, 10, 50, 100];
    for (let interval of possibleIntervals) {
        if (Math.ceil(maxDepth / interval) <= maxLabels) {
            return interval;
        }
    }
    return 100; // Default to 100 if no smaller interval works
};

const WellVisualization: React.FC<WellVisualizationProps> = ({
    layers,
    waterLevel,
    maxDepth,
}) => {
    const [hoveredType, setHoveredType] = useState<string | null>(null);

    const hoveredGroup = hoveredType
        ? lithologyLegend.find((item) => item.type === hoveredType)?.group
        : null;

    const interval = calculateLabelIntervals(maxDepth);
    const labels = Array.from(
        { length: Math.ceil(maxDepth / interval) + 1 },
        (_, i) => i * interval
    );

    const groupedLegend = lithologyLegend.reduce<
        Record<string, LithologyLegendItem[]>
    >((acc, item) => {
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(item);
        return acc;
    }, {});

    return (
        <div className="flex items-start justify-center pl-4">
            {/* Well Visualization */}
            <div
                id="water-level-visualization-graphic"
                className="flex items-center justify-center h-[615px] w-[100px] relative"
            >
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 h-full w-[30px] flex flex-col-reverse text-gray-400 text-[11px] -ml-6">
                    {labels.map((label, index) => (
                        <div
                            key={index}
                            className="absolute right-0 text-right"
                            style={{
                                bottom: `${(label / maxDepth) * 100}%`,
                                transform: "translateY(50%)",
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
                                } flex-grow transition-all duration-300 ${
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
                                    border:
                                        hoveredType === layer.type
                                            ? "1px solid white"
                                            : "none",
                                }}
                            ></div>
                        );
                    })}
                </div>

                {/* Water Level */}
                <div className="relative flex flex-col-reverse w-[3.2rem] h-full overflow-hidden">
                    <div
                        className="relative flex items-center justify-center text-sm text-white bg-gradient-to-t to-[#5E9BDC] from-[#1366C0] overflow-hidden transition-all duration-700 ease-in-out"
                        style={{
                            height: `${(waterLevel / maxDepth) * 100}%`,
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
                            bottom: `calc(${
                                (waterLevel / maxDepth) * 100
                            }% + 5px)`,
                        }}
                    >
                        <div
                            id="water-level-indicator"
                            className="flex flex-col items-center w-full"
                        >
                            <div className="w-full text-sm font-medium text-center text-[#B4D9FF]">
                                {waterLevel} ft
                            </div>
                            <div
                                id="indicator-triangle"
                                className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-[#B4D9FF] rounded-sm"
                            ></div>
                        </div>
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
                                } flex-grow transition-all duration-300 ${
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
                                    border:
                                        hoveredType === layer.type
                                            ? "1px solid white"
                                            : "none",
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
                            hoveredGroup && hoveredGroup !== group
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
