// src/components/Modals/RainLevelBarChartModal/RainLevelBarChartModal.tsx

import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import type {
    SeriesOption,
    XAXisComponentOption,
} from "echarts/types/dist/shared";
import React, { useEffect, useMemo, useRef } from "react";
import { useWaterLevelStore } from "../../../stores/useWaterLevelStore";
import { TimeSeriesData, TimeSpan } from "../../../types/timeSeriesTypes";
import { findClosestTimestamp } from "../../../utils/timeSeriesUtils";

interface RainLevelBarChartModalProps {
    rainData: TimeSeriesData[];
    timeSpan: TimeSpan;
}

type RainLevelBarChartOption = echarts.EChartsOption & {
    xAxis: XAXisComponentOption[];
    series: SeriesOption[];
};

const RainLevelBarChartModal: React.FC<RainLevelBarChartModalProps> = ({
    rainData,
    timeSpan,
}) => {
    const chartRef = useRef<echarts.ECharts>(null);
    const currentDateRef = useRef<HTMLDivElement>(null);

    const setHoveredAxisIndex =
        useWaterLevelStore.getState().setHoveredAxisIndex;
    const hoveredDateTime = useWaterLevelStore(
        (state) => state.hoveredDateTime
    );

    const option: RainLevelBarChartOption = useMemo(() => {
        if (rainData.length === 0) {
            // Handle empty data gracefully by returning a minimal option
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
                    max: 1,
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
                    axisLabel: { color: "#aaa" },
                },
            ],
            yAxis: {
                type: "value",
                min: Math.min(...rainData.map((d) => d.value)) - 0.5,
                max: Math.max(...rainData.map((d) => d.value)) + 0.5,
                splitNumber: 5,
                interval: 0.5, // adjust as needed
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
    }, [rainData]);

    /**
     * Handles chart readiness by storing the chart instance.
     * @param chart - The ECharts instance.
     */
    const handleChartReady = (chart: echarts.ECharts) => {
        chartRef.current = chart;
    };

    /**
     * Effect to synchronize tooltips based on hoveredDateTime from Water Level Chart.
     */
    useEffect(() => {
        if (!hoveredDateTime || rainData.length === 0 || !chartRef.current) {
            chartRef.current?.dispatchAction({ type: "hideTip" });
            if (currentDateRef.current) {
                currentDateRef.current.innerHTML = "No data hovered";
            }
            return;
        }

        // Parse hoveredDateTime to Date object
        const referenceTime = new Date(hoveredDateTime);
        const closestRain = findClosestTimestamp(rainData, referenceTime);

        if (closestRain) {
            const rainIndex = rainData.findIndex(
                (d) => d.dateTime === closestRain.dateTime
            );
            if (rainIndex !== -1) {
                chartRef.current.dispatchAction({
                    type: "showTip",
                    seriesIndex: 0,
                    dataIndex: rainIndex,
                });
                const formattedDate = `<strong>${
                    closestRain.dateTime
                }</strong> on ${new Date(closestRain.dateTime).toDateString()}`;
                if (currentDateRef.current) {
                    currentDateRef.current.innerHTML = formattedDate;
                }
            }
        } else {
            // Hide tip if no corresponding data
            if (chartRef.current) {
                chartRef.current.dispatchAction({ type: "hideTip" });
            }
            if (currentDateRef.current) {
                currentDateRef.current.innerHTML =
                    "No rain data available for this date.";
            }
        }
    }, [hoveredDateTime, rainData]);

    return (
        <div className="w-full max-w-xl p-0 mx-auto rounded-lg">
            <h3 className="mb-1 text-xl font-bold text-white">
                Rain Level (in)
            </h3>
            <div
                id="current-date-display"
                ref={currentDateRef}
                className="mt-[0.125rem] text-sm font-medium text-center text-white"
            >
                {hoveredDateTime
                    ? `Date: ${hoveredDateTime}`
                    : "Hover over the chart"}
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
                />
            )}
        </div>
    );
};

export default React.memo(RainLevelBarChartModal);
