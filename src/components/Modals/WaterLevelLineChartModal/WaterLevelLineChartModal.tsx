import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { XAXisOption } from "echarts/types/dist/shared";
import React, { useRef, useState } from "react";
import { useWaterLevelStore } from "../../../stores/useWaterLevelStore"; // Import Zustand store

interface WaterLevelChartProps {
    xData: string[];
    yData: number[];
    initialTimeSpan?: string;
    paddingRatio?: number;
}

const calculateYAxisLimits = (yData: number[], paddingRatio: number = 0.2) => {
    if (yData.length === 0) return { min: 0, max: 1 };
    const minVal = Math.min(...yData);
    const maxVal = Math.max(...yData);
    const range = maxVal - minVal || 1;
    const padding = range * paddingRatio * 0.5;
    return {
        min: minVal - padding,
        max: maxVal + padding,
    };
};

const WaterLevelChart: React.FC<WaterLevelChartProps> = ({
    xData,
    yData,
    initialTimeSpan = "1D",
    paddingRatio = 0.2,
}) => {
    const chartRef = useRef<echarts.ECharts>(null);
    const currentDateRef = useRef<HTMLDivElement>(null);
    const [selectedTimeSpan, setSelectedTimeSpan] =
        useState<string>(initialTimeSpan);

    // Import the setter from the global store.
    const { setWaterLevel } = useWaterLevelStore.getState();
    // Note: We use getState() to avoid subscribing to changes.

    const handleChartReady = (chart: echarts.ECharts) => {
        chartRef.current = chart;
    };

    const handleAxisPointerUpdate = (params: any) => {
        if (params.axesInfo && params.axesInfo[0] && chartRef.current) {
            const chart = chartRef.current;
            const chartOptions = chart.getOption();
            if (chartOptions.xAxis && Array.isArray(chartOptions.xAxis)) {
                const xAxis = chartOptions.xAxis[0];
                if (xAxis.type === "category" && "data" in xAxis) {
                    const xAxisData = (
                        xAxis as XAXisOption & { data: string[] }
                    ).data;
                    const xIndex = params.axesInfo[0].value;
                    const xValue = xAxisData[xIndex] || xIndex;

                    // Simulate some logic to determine the water level from xValue:
                    // For example, hoverValue = yData[xIndex]
                    // Adjust this based on your data structure.
                    const hoverValue = yData[xIndex] ?? 0;
                    setWaterLevel(hoverValue);

                    const formattedDate = `<strong>${xValue}:00</strong> on Aug 3, 2024`;
                    if (currentDateRef.current) {
                        currentDateRef.current.innerHTML = formattedDate;
                    }
                }
            }
        }
    };

    const { min, max } = calculateYAxisLimits(yData, paddingRatio);

    const calculateInterval = (min: number, max: number) => {
        const range = max - min;
        if (range <= 12) return 2;
        if (range <= 50) return 5;
        if (range <= 100) return 10;
        if (range <= 500) return 50;
        return 100;
    };

    const interval = calculateInterval(min, max);

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
                    formatter: (params: any) => {
                        return `${params.seriesData[0].data} ft`;
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
            boundaryGap: false,
            data: xData,
            axisLine: { show: true, lineStyle: { color: "#555" } },
            axisLabel: { color: "#aaa" },
        },
        yAxis: {
            type: "value",
            min: min,
            max: max,
            splitNumber: 5,
            interval: interval,
            axisLine: {
                show: true,
                lineStyle: { color: "#555" },
            },
            axisLabel: {
                color: "#aaa",
                formatter: (value) =>
                    value === max || value === min
                        ? ""
                        : Math.round(value).toString(),
            },
            splitLine: {
                show: true,
                lineStyle: { color: "#555555", type: "dashed" },
            },
        },
        series: [
            {
                data: yData,
                type: "line",
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(90, 153, 255, 1)" },
                        { offset: 1, color: "rgba(90, 153, 255, 0)" },
                    ]),
                },
                lineStyle: {
                    color: "#91BDE5",
                    width: 2,
                },
                symbol: "circle",
                symbolSize: 10,
                itemStyle: {
                    color: "#91BDE5",
                    borderColor: "#1E1E1E",
                    borderWidth: 3,
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
            id="water-level-chart-container"
            className="w-full max-w-xl p-0 mx-auto rounded-lg"
        >
            <h3
                id="water-level-chart-title"
                className="mb-1 text-xl font-bold text-white"
            >
                Water Level (ft)
            </h3>

            <div
                id="time-span-picker"
                className="flex justify-between gap-2 pb-[8px] border-b-[0.6px] border-[#454545]"
            >
                {["1D", "1W", "1M", "3M", "6M", "1Y", "2Y", "3Y"].map(
                    (span) => (
                        <button
                            id={`time-span-${span}`}
                            key={span}
                            onClick={() => setSelectedTimeSpan(span)}
                            className={`w-7 h-7 text-sm font-semibold rounded cursor-pointer ${
                                selectedTimeSpan === span
                                    ? "bg-[#585858] text-white"
                                    : " text-white hover:bg-gray-600"
                            }`}
                        >
                            {span}
                        </button>
                    )
                )}
            </div>

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
                onEvents={{
                    updateAxisPointer: handleAxisPointerUpdate,
                }}
            />
        </div>
    );
};

export default React.memo(WaterLevelChart);
