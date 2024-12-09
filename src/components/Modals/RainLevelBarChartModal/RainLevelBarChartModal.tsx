import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import React, { useEffect, useMemo, useRef } from "react";
import { useWaterLevelStore } from "../../../stores/useWaterLevelStore";
import { TimeSeriesData, TimeSpan } from "../../../types/timeSeriesTypes";
import { formatTimestamp } from "../../../utils/timeSeriesUtils";

// Custom formatters for x-axis labels
const formatHourly = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return `${date.getHours().toString().padStart(2, "0")}:00`; // e.g., "11:00", "12:00"
};

const formatDaily = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }); // e.g., "Nov 1"
};

interface RainLevelBarChartModalProps {
    waterData: TimeSeriesData[]; // Needed to find hovered timestamp from line chart
    rainData: TimeSeriesData[];
    timeSpan: TimeSpan;
}

function findClosestTimestamp(
    targetData: TimeSeriesData[],
    referenceTime: Date
): { index: number; data: TimeSeriesData } | null {
    if (targetData.length === 0) return null;

    let closestIndex = 0;
    let closest = targetData[0];
    let minDiff = Math.abs(
        new Date(closest.dateTime).getTime() - referenceTime.getTime()
    );

    for (let i = 1; i < targetData.length; i++) {
        const current = targetData[i];
        const currentDiff = Math.abs(
            new Date(current.dateTime).getTime() - referenceTime.getTime()
        );
        if (currentDiff < minDiff) {
            closest = current;
            closestIndex = i;
            minDiff = currentDiff;
        }
    }

    return { index: closestIndex, data: closest };
}

const RainLevelBarChartModal: React.FC<RainLevelBarChartModalProps> = ({
    waterData,
    rainData,
    timeSpan,
}) => {
    const chartRef = useRef<echarts.ECharts>(null);
    const currentDateRef = useRef<HTMLDivElement>(null);
    const hoveredAxisIndexRef = useRef<number | null>(
        useWaterLevelStore.getState().hoveredAxisIndex
    );
    const setHoveredAxisIndex =
        useWaterLevelStore.getState().setHoveredAxisIndex;
    const isProgrammaticUpdate = useRef(false);

    const option = useMemo(() => {
        if (rainData.length === 0) {
            return {
                xAxis: [
                    {
                        type: "category",
                        data: [],
                        axisLine: { lineStyle: { color: "#555" } },
                        axisLabel: { color: "#aaa" },
                    },
                ],
                yAxis: {
                    type: "value",
                    min: 0,
                    max: Math.max(...rainData.map((d) => d.value)) + 0.5,
                    splitLine: { lineStyle: { color: "#555" } },
                    axisLine: { lineStyle: { color: "#555" } },
                    axisLabel: { color: "#aaa" },
                },
                series: [],
                grid: {
                    left: "0%",
                    right: "2%",
                    bottom: "2%",
                    top: "8%",
                    containLabel: true,
                },
            };
        }

        const xAxisFormatter =
            timeSpan === "1D"
                ? formatHourly // Format for 1-day view
                : timeSpan === "1W"
                ? formatDaily // Format for 1-week view
                : undefined; // Default for other views

        return {
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
                        formatter: (params: any) => {
                            const val = Number(params.seriesData[0]?.data);
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
            xAxis: [
                {
                    type: "category",
                    data: rainData.map((d) => d.dateTime),
                    axisLine: { lineStyle: { color: "#555" } },
                    axisLabel: {
                        color: "#aaa",
                        formatter: (value: string) =>
                            xAxisFormatter ? xAxisFormatter(value) : value,
                    },
                },
            ],
            yAxis: {
                type: "value",
                min: Math.min(...rainData.map((d) => d.value)) - 0.5,
                max: Math.max(...rainData.map((d) => d.value)) + 0.5,
                splitNumber: 5,
                interval: 0.5,
                axisLine: { lineStyle: { color: "#555" } },
                axisLabel: { color: "#aaa" },
                splitLine: {
                    show: true,
                    lineStyle: { color: "#555555", type: "dashed" },
                },
            },
            series: [
                {
                    data: rainData.map((d) => d.value),
                    type: "bar",
                    barWidth: "60%",
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
    }, [rainData, timeSpan]);

    const handleChartReady = (chart: echarts.ECharts) => {
        chartRef.current = chart;
    };

    // Subscribe to hoveredAxisIndex changes and update this chart accordingly
    useEffect(() => {
        const unsub = useWaterLevelStore.subscribe(
            (state) => state.hoveredAxisIndex,
            (hovered: number | null) => {
                if (!chartRef.current) return;

                isProgrammaticUpdate.current = true;

                if (
                    hovered !== null &&
                    hovered < waterData.length &&
                    rainData.length > 0
                ) {
                    const refTime = new Date(waterData[hovered].dateTime);
                    const closest = findClosestTimestamp(rainData, refTime);

                    if (closest) {
                        chartRef.current.dispatchAction({
                            type: "showTip",
                            seriesIndex: 0,
                            dataIndex: closest.index,
                        });

                        if (currentDateRef.current) {
                            const formattedDate = formatTimestamp(
                                closest.data.dateTime
                            ); // Apply formatting here
                            currentDateRef.current.innerHTML = `<strong>${formattedDate}</strong>`;
                        }
                    } else {
                        chartRef.current.dispatchAction({ type: "hideTip" });
                        if (currentDateRef.current) {
                            currentDateRef.current.innerHTML =
                                "No rain data available for this date.";
                        }
                    }
                } else {
                    chartRef.current.dispatchAction({ type: "hideTip" });
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
    }, [waterData, rainData]);

    const handleAxisPointerUpdate = (params: any) => {
        if (isProgrammaticUpdate.current) return;
        if (
            params?.axesInfo?.[0] &&
            chartRef.current &&
            rainData.length > 0 &&
            waterData.length > 0
        ) {
            const xIndex = params.axesInfo[0].value;
            if (xIndex !== null && xIndex >= 0 && xIndex < rainData.length) {
                const refTime = new Date(rainData[xIndex].dateTime);
                const closestWater = findClosestTimestamp(waterData, refTime);
                if (closestWater) {
                    useWaterLevelStore
                        .getState()
                        .setHoveredAxisIndex(closestWater.index);
                }
            }
        }
    };

    return (
        <div className="w-full max-w-xl p-0 mx-auto rounded-lg">
            <h3 className="mb-1 text-xl font-bold text-white">Rainfall (in)</h3>
            <div
                id="current-date-display"
                ref={currentDateRef}
                className="mt-[0.125rem] text-sm font-medium text-center text-white"
            >
                Hover over the chart
            </div>
            {rainData.length === 0 ? (
                <div className="mt-4 text-sm font-medium text-center text-white">
                    No rain data available for the selected time span.
                </div>
            ) : (
                <ReactECharts
                    option={option}
                    style={{ height: "267px" }}
                    onChartReady={handleChartReady}
                    onEvents={{ updateAxisPointer: handleAxisPointerUpdate }}
                />
            )}
        </div>
    );
};

export default React.memo(RainLevelBarChartModal);
