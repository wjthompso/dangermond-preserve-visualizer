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

const WellVisualization: React.FC<WellVisualizationProps> = ({
    layers,
    waterLevel,
    maxDepth,
}) => {
    return (
        <div className="flex items-center justify-center h-[615px] w-[120px] relative">
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
                                "url('/assets/Air Bubbles In Water.svg')", // Path to SVG
                            backgroundSize: "100% auto", // Fill width, maintain aspect ratio
                            backgroundRepeat: "repeat-y", // Repeat vertically
                            backgroundPosition: "top", // Align bubbles at the top
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
