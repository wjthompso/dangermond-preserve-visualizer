// RainLevelBarChartModal.tsx

import * as echarts from "echarts";
import { CategoryAxisOption, XAXisOption } from "echarts"; // Adjust import path if necessary
import ReactECharts from "echarts-for-react";
import React, { useEffect, useRef } from "react";
import { useWaterLevelStore } from "../../../stores/useWaterLevelStore";

// Define a specific type for your chart option
type RainLevelBarChartOption = echarts.EChartsOption & {
    xAxis: XAXisOption[];
    series: echarts.SeriesOption[];
};

// Type guard for category xAxis
function isCategoryXAXisOption(
    option: XAXisOption
): option is CategoryAxisOption {
    return (
        option.type === "category" &&
        Array.isArray((option as CategoryAxisOption).data)
    );
}

const RainLevelBarChartModal: React.FC = () => {
    const chartRef = useRef<echarts.ECharts>(null);
    const currentDateRef = useRef<HTMLDivElement>(null);

    // Access store setters without subscribing in the render
    const setHoveredAxisIndex =
        useWaterLevelStore.getState().setHoveredAxisIndex;

    // Refs to track current state
    const hoveredAxisIndexRef = useRef<number | null>(
        useWaterLevelStore.getState().hoveredAxisIndex
    );

    // Flag to distinguish between user and programmatic updates
    const isProgrammaticUpdate = useRef(false);

    // When hoveredAxisIndex changes, showTip on this chart and update subtitle
    useEffect(() => {
        const unsub = useWaterLevelStore.subscribe(
            (state) => state.hoveredAxisIndex,
            (hovered: number | null) => {
                if (!chartRef.current) return;

                isProgrammaticUpdate.current = true;
                if (hovered !== null) {
                    // Show tooltip at hoveredAxisIndex
                    chartRef.current.dispatchAction({
                        type: "showTip",
                        seriesIndex: 0,
                        dataIndex: hovered,
                    });

                    // Safely access xAxisData with type assertions
                    const option =
                        chartRef.current.getOption() as RainLevelBarChartOption;
                    const xAxisOption =
                        option.xAxis && Array.isArray(option.xAxis)
                            ? option.xAxis[0]
                            : null;

                    if (xAxisOption && isCategoryXAXisOption(xAxisOption)) {
                        const xAxisData = xAxisOption.data as string[];
                        const xValue = xAxisData[hovered] || hovered.toString();
                        const formattedDate = `<strong>${xValue}:00</strong> on Aug 3, 2024`;
                        if (currentDateRef.current) {
                            currentDateRef.current.innerHTML = formattedDate;
                        }
                    } else {
                        // Fallback if xAxis data is not as expected
                        if (currentDateRef.current) {
                            currentDateRef.current.innerHTML =
                                "Invalid data hovered";
                        }
                    }
                } else {
                    // Hide tooltip
                    chartRef.current.dispatchAction({ type: "hideTip" });
                    // Optionally, reset the subtitle when no hover
                    if (currentDateRef.current) {
                        currentDateRef.current.innerHTML = "No data hovered";
                    }
                }
                isProgrammaticUpdate.current = false;
            }
        );

        return () => {
            unsub();
        };
    }, []);

    const handleChartReady = (chart: echarts.ECharts) => {
        chartRef.current = chart;
    };

    const handleAxisPointerUpdate = (params: any) => {
        // If this is a programmatic update, skip updating hoveredAxisIndex
        if (isProgrammaticUpdate.current) return;

        if (params?.axesInfo?.[0] && chartRef.current) {
            const option =
                chartRef.current.getOption() as RainLevelBarChartOption;
            const xAxisOption =
                option.xAxis && Array.isArray(option.xAxis)
                    ? option.xAxis[0]
                    : null;

            if (xAxisOption && isCategoryXAXisOption(xAxisOption)) {
                const xAxisData = xAxisOption.data as string[];
                const xIndex = params.axesInfo[0].value;
                const xValue = xAxisData[xIndex] || xIndex.toString();

                // Update hoveredAxisIndex only if different
                if (hoveredAxisIndexRef.current !== xIndex) {
                    hoveredAxisIndexRef.current = xIndex;
                    setHoveredAxisIndex(xIndex);
                }

                // Update date display
                const formattedDate = `<strong>${xValue}:00</strong> on Aug 3, 2024`;
                if (currentDateRef.current) {
                    currentDateRef.current.innerHTML = formattedDate;
                }
            }
        }
    };

    const option: echarts.EChartsOption = {
        tooltip: {
            trigger: "axis",
            showContent: false,
            axisPointer: {
                type: "line",
                lineStyle: {
                    color: "#91BDE5",
                    width: 1,
                    type: "solid",
                },
                label: {
                    show: true,
                    // Ensure formatting doesn't cause loops; just return numeric value
                    formatter: (params: any) => {
                        const val = Number(params.seriesData[0].data);
                        return isNaN(val) ? "" : `${val} in`;
                    },
                    margin: -243,
                    padding: [4, 8],
                    backgroundColor: "rgba(50, 50, 50, 0.0)",
                    color: "#A7D5FF",
                    fontSize: 14,
                    fontWeight: "bold",
                    borderRadius: 4,
                },
            },
        },
        xAxis: {
            type: "category",
            boundaryGap: true,
            data: ["10", "11", "12", "13", "14", "15", "16", "17"],
            axisLine: { lineStyle: { color: "#555" } },
            axisLabel: { color: "#aaa" },
        },
        yAxis: {
            type: "value",
            min: 110,
            max: 140,
            splitLine: { lineStyle: { color: "#555" } },
            axisLine: { lineStyle: { color: "#555" } },
            axisLabel: { color: "#aaa" },
        },
        series: [
            {
                data: [120, 125, 130, 118, 112, 135, 122, 128].map((d) =>
                    Number(d)
                ),
                type: "bar",
                barWidth: "99%",
                itemStyle: {
                    color: "rgba(90, 153, 255, 1)",
                    borderColor: "white",
                    borderWidth: 1,
                    borderRadius: [4, 4, 0, 0],
                },
            },
        ],
        grid: {
            left: "0%",
            right: "2%",
            bottom: "2%",
            top: "8%",
            containLabel: true,
        },
    };

    return (
        <div
            id="rain-level-chart-container"
            className="w-full max-w-xl p-0 mx-auto rounded-lg"
        >
            <h3
                id="rain-level-chart-title"
                className="mb-1 text-xl font-bold text-white"
            >
                Rain Level (in)
            </h3>

            <div
                id="current-date-display"
                ref={currentDateRef}
                className="mt-[0.125rem] text-sm font-medium text-center text-white"
            >
                10:00 Aug 3, 2024
            </div>

            <ReactECharts
                option={option}
                style={{ height: "267px" }}
                onChartReady={handleChartReady}
                onEvents={{ updateAxisPointer: handleAxisPointerUpdate }}
            />
        </div>
    );
};

export default React.memo(RainLevelBarChartModal);
