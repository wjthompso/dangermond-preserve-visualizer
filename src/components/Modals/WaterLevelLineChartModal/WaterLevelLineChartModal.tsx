import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { XAXisOption } from "echarts/types/dist/shared";
import React, { useRef, useState } from "react";

const WaterLevelChart: React.FC = () => {
    const chartRef = useRef<echarts.ECharts>();
    const currentDateRef = useRef<HTMLDivElement>(null); // Ref for the date display
    const [selectedTimeSpan, setSelectedTimeSpan] = useState<string>("1D"); // State to track selected time span

    const handleChartReady = (chart: echarts.ECharts) => {
        chartRef.current = chart;
    };

    const handleAxisPointerUpdate = (params: any) => {
        if (params.axesInfo && params.axesInfo[0] && chartRef.current) {
            const chart = chartRef.current;
            const chartOptions = chart.getOption();

            // Check if xAxis exists and is an array
            if (chartOptions.xAxis && Array.isArray(chartOptions.xAxis)) {
                const xAxis = chartOptions.xAxis[0];

                // Check if xAxis is of type 'category' and has a 'data' property
                if (xAxis.type === "category" && "data" in xAxis) {
                    const xAxisData = (
                        xAxis as XAXisOption & { data: string[] }
                    ).data;
                    const xIndex = params.axesInfo[0].value;
                    const xValue = xAxisData[xIndex] || xIndex;

                    const formattedDate = `<strong>${xValue}:00</strong> on Aug 3, 2024`;

                    // Update the date display without re-rendering
                    if (currentDateRef.current) {
                        currentDateRef.current.innerHTML = formattedDate;
                    }
                } else {
                    console.warn(
                        'xAxis is not of type "category" or does not have a data property.'
                    );
                }
            } else {
                console.warn("xAxis is not defined or is not an array.");
            }
        }
    };

    const option: echarts.EChartsOption = {
        tooltip: {
            trigger: "axis",
            showContent: false, // Disable the default tooltip box
            axisPointer: {
                type: "line",
                lineStyle: {
                    color: "#91BDE5",
                    width: 1,
                    type: "solid",
                },
                label: {
                    show: true, // Enable the label directly above the axis pointer
                    formatter: (params: any) => {
                        return `${params.seriesData[0].data} ft`; // Display Y-axis value
                    },
                    margin: -243, // Position above the top of the chart
                    padding: [4, 8], // Adjust padding for label text
                    backgroundColor: "rgba(50, 50, 50, 0.0)", // Label background
                    color: "#A7D5FF", // Text color
                    fontSize: 14, // Text font size
                    fontWeight: "bold",
                    borderRadius: 4, // Rounded corners
                },
            },
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
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
                data: [120, 122, 121, 125, 130, 124.8, 123, 120],
                type: "line",
                smooth: false,
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
            top: "8%", // Allow space for the label above the chart
            containLabel: true,
        },
    };

    return (
        <div
            id="water-level-chart-container"
            className="w-full max-w-xl p-0 mx-auto rounded-lg"
        >
            {/* Chart Title */}
            <h3
                id="water-level-chart-title"
                className="mb-1 text-xl font-bold text-white"
            >
                Water Level (ft)
            </h3>

            {/* Time Span Picker */}
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

            {/* Current Date Display */}
            <div
                id="current-date-display"
                ref={currentDateRef}
                className="mt-[0.125rem] text-sm font-medium text-center text-white"
            >
                10:00 Aug 3, 2024
            </div>

            {/* Chart */}
            <ReactECharts
                option={option}
                style={{ height: "267px" }}
                onChartReady={handleChartReady}
                onEvents={{
                    updateAxisPointer: handleAxisPointerUpdate, // Listen for axis pointer updates
                }}
            />
        </div>
    );
};

export default WaterLevelChart;
