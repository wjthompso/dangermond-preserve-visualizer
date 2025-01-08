import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import React, { useState } from "react";
import { CombinedData, TimeSpan } from "../../types/timeSeriesTypes";
import { filterTimeSeries } from "../../utils/timeSeriesUtils";
import RainLevelBarChartModal from "../Modals/RainLevelBarChartModal/RainLevelBarChartModal";
import WaterLevelLineChartModal from "../Modals/WaterLevelLineChartModal/WaterLevelLineChartModal";
import WaterLevelVisualizationModal from "../Modals/WaterLevelVisualizationModal/WaterLevelVisualizationModal";
import WellSummaryModalMobile from "../Modals/WellSummaryModal/WellSummaryModalMobile";

interface DraggableFooterProps {
    combinedData: CombinedData;
    timeSpan: TimeSpan;
    setTimeSpan: React.Dispatch<React.SetStateAction<TimeSpan>>;
    selectedWellId: string;
}

const DraggableFooter: React.FC<DraggableFooterProps> = ({
    combinedData,
    timeSpan,
    setTimeSpan,
    selectedWellId,
}) => {
    // Height of the part of the component that peeks above the bottom of the screen.
    const peekHeight = 150;

    const [isExpanded, setIsExpanded] = useState(false);

    // Spring for vertical offset (y). By default, it sits at "innerHeight - peekHeight".
    const [{ y }, api] = useSpring(() => ({
        y: window.innerHeight - peekHeight,
    }));

    // Use drag gesture to set the y offset within [0, window.innerHeight - peekHeight]
    const bind = useDrag(
        ({ offset: [, oy], last }) => {
            const minY = 0;
            const maxY = window.innerHeight - peekHeight;
            const newY = Math.min(Math.max(oy, minY), maxY);

            // If user finishes the gesture (last === true), snap to either expanded or collapsed
            // if (last) {
            //     // Decide whether to expand or collapse based on how far they've dragged
            //     if (newY < maxY / 2) {
            //         setIsExpanded(true);
            //         api.start({ y: 0 });
            //     } else {
            //         setIsExpanded(false);
            //         api.start({ y: maxY });
            //     }
            // } else {
            //     // While dragging, just follow the user
            //     api.start({ y: newY });
            // }

            api.start({ y: newY });
        },
        { axis: "y" }
    );

    // Toggles between fully expanded (y=0) or collapsed (y=window.innerHeight - peekHeight)
    const toggleExpand = () => {
        if (isExpanded) {
            setIsExpanded(false);
            api.start({ y: window.innerHeight - peekHeight });
        } else {
            setIsExpanded(true);
            api.start({ y: 0 });
        }
    };

    return (
        <animated.div
            id="draggable-footer"
            // Make sure it's absolutely positioned at the bottom, spanning full width
            className="absolute inset-x-0 bottom-0 z-50 overflow-hidden text-white border shadow-lg bg-gradient-to-br from-black/70 to-black/50 border-white/20 rounded-t-xl backdrop-blur-md"
            // Convert spring y into a translateY. Also limit maxHeight.
            style={{
                transform: y.to((val) => `translateY(${val}px)`),
                maxHeight: "100vh", // ensures we never exceed the screen
                touchAction: "none", // Required so gesture can pick up pointer events properly
            }}
        >
            {/* Uncomment and adjust the toggle button if needed
            <button
                id="draggable-footer-toggle"
                className="absolute z-10 p-2 text-black bg-gray-300 rounded-full top-2 left-2"
                onClick={toggleExpand}
            >
                {isExpanded ? "▼" : "▲"}
            </button> 
            */}

            {/* The area we drag from; you can also attach the bind to the entire container if you prefer. */}
            <div
                id="draggable-grip"
                // Attach gesture events here
                style={{ touchAction: "none" }}
                {...bind()}
                className="flex items-center justify-center w-full h-6 bg-black cursor-grab"
            >
                {/* A little “grip bar” or handle */}
                <div
                    {...bind()}
                    style={{ touchAction: "none" }}
                    className="w-12 h-1 rounded-full bg-white/40"
                />
            </div>

            {/* The main content area. Set overflow-y-auto & a max-h so it scrolls if too tall. */}
            <div
                id="draggable-footer-content"
                className="pb-4 overflow-y-auto bg-black"
                style={{
                    maxHeight: "calc(100vh - 6rem)", // adjust as needed
                }}
            >
                {/* Example modals/content, just stacked vertically */}
                <WellSummaryModalMobile
                    title={`${selectedWellId}`.replace("_", " ")}
                    coordinates={combinedData.coordinates}
                />
                <div
                    id="divider-line"
                    className="mb-4 mt-2 min-h-[0.1px] w-full bg-[#454545]"
                />
                <div className="max-w-[400px] mx-auto px-4 w-full">
                    <WaterLevelLineChartModal
                        waterData={filterTimeSeries(
                            combinedData.waterLevel,
                            timeSpan
                        )}
                        rainData={filterTimeSeries(
                            combinedData.rainLevel,
                            timeSpan
                        )}
                        timeSpan={timeSpan}
                        setTimeSpan={setTimeSpan}
                    />
                </div>
                <div
                    id="divider-line"
                    className="mt-2 mb-4 min-h-[0.1px] w-full bg-[#454545]"
                />
                <div className="max-w-[400px] mx-auto px-4 w-full">
                    <RainLevelBarChartModal
                        waterData={filterTimeSeries(
                            combinedData.waterLevel,
                            timeSpan
                        )}
                        rainData={filterTimeSeries(
                            combinedData.rainLevel,
                            timeSpan
                        )}
                        timeSpan={timeSpan}
                    />
                </div>
                <div
                    id="divider-line"
                    className="my-4 min-h-[0.1px] w-full bg-[#454545]"
                />
                <div className="max-w-[400px] mx-auto px-2.5 w-full ">
                    <WaterLevelVisualizationModal
                        layers={combinedData.layers}
                    />
                </div>
            </div>
        </animated.div>
    );
};

export default DraggableFooter;
