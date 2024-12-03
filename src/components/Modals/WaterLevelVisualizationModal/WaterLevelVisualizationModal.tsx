import React from "react";

interface LithologyLayer {
    startDepth: number;
    endDepth: number;
    type: string; // Example: 'unconsolidated', 'sedimentary', etc.
}

interface WellVisualizationProps {
    layers: LithologyLayer[];
    waterLevel: number; // Water level in feet
    maxDepth: number; // Total depth of the well
}

const lithologyColors: Record<string, string> = {
    unconsolidated: "bg-orange-600",
    sedimentary: "bg-blue-500",
    other: "bg-gray-500",
};

const calculateLabelIntervals = (maxDepth: number, maxLabels: number = 16) => {
    // Determine the interval that results in ~16 labels
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
    const interval = calculateLabelIntervals(maxDepth);
    const labels = Array.from(
        { length: Math.ceil(maxDepth / interval) + 1 },
        (_, i) => i * interval
    );

    return (
        <div className="flex items-center justify-center h-[615px] w-[150px] relative">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 h-full w-[30px] flex flex-col-reverse text-gray-400 text-[11px] -ml-2">
                {labels.map((label, index) => (
                    <div
                        key={index}
                        className="absolute right-0 text-right"
                        style={{
                            bottom: `${(label / maxDepth) * 100}%`,
                            transform: "translateY(50%)", // Center vertically
                        }}
                    >
                        {label}
                    </div>
                ))}
            </div>

            {/* Left Lithology Layers */}
            <div className="relative flex flex-col w-[1rem] h-full">
                {layers.map((layer, index) => {
                    const heightFraction =
                        (layer.endDepth - layer.startDepth) / maxDepth;
                    return (
                        <div
                            key={index}
                            className={`relative ${
                                lithologyColors[layer.type]
                            } flex-grow`}
                            style={{
                                flexGrow: heightFraction,
                                backgroundImage:
                                    "url('/assets/rock-texture-semi-transparent-overlay.png')",
                                backgroundSize: "cover",
                                backgroundBlendMode: "overlay",
                            }}
                        ></div>
                    );
                })}
            </div>

            {/* Water Level */}
            <div className="relative flex flex-col-reverse w-[4rem] h-full overflow-hidden">
                <div
                    className="relative flex items-center justify-center text-sm text-white bg-gradient-to-t to-[#5E9BDC] from-[#1366C0] overflow-hidden"
                    style={{
                        height: `${(waterLevel / maxDepth) * 100}%`,
                    }}
                >
                    {/* Bubbles Overlay */}
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
            </div>

            {/* Right Lithology Layers */}
            <div className="relative flex flex-col w-[1rem] h-full">
                {layers.map((layer, index) => {
                    const heightFraction =
                        (layer.endDepth - layer.startDepth) / maxDepth;
                    return (
                        <div
                            key={index}
                            className={`relative ${
                                lithologyColors[layer.type]
                            } flex-grow`}
                            style={{
                                flexGrow: heightFraction,
                                backgroundImage:
                                    "url('/assets/rock-texture-semi-transparent-overlay.png')",
                                backgroundSize: "cover",
                                backgroundBlendMode: "overlay",
                            }}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
};

export default WellVisualization;
