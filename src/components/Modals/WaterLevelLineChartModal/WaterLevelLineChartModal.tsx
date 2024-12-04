import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import React, { useRef } from "react";

const WaterLevelChart: React.FC = () => {
    // Store the chart instance
    const chartRef = useRef<echarts.ECharts>();

    const handleChartReady = (chart: echarts.ECharts) => {
        chartRef.current = chart;
    };

    const option: echarts.EChartsOption = {
        tooltip: {
            trigger: "axis",
            showContent: false, // Disable the default tooltip box
            axisPointer: {
                type: "line",
                lineStyle: {
                    color: "#888",
                    width: 1.5,
                    type: "solid",
                },
                label: {
                    show: true, // Enable the label directly above the axis pointer
                    formatter: (params: any) => {
                        // Display the precise Y value dynamically
                        return `${params.seriesData[0].data} ft`;
                    },
                    margin: -235, // Position above the top of the chart
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
                    color: "#fff",
                    borderColor: "#1E1E1E",
                    borderWidth: 3,
                },
            },
        ],
        grid: {
            left: "0%",
            right: "2%",
            bottom: "2%",
            top: "10%", // Allow space for the label above the chart
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
                className="mb-1 text-lg font-bold text-white"
            >
                Water Level (ft)
            </h3>

            {/* Time Span Picker */}
            <div
                id="time-span-picker"
                className="flex justify-between gap-2 pb-[4px] border-b-[0.6px] border-[#454545]"
            >
                {["1D", "1W", "1M", "3M", "6M", "1Y", "2Y", "3Y"].map(
                    (span) => (
                        <button
                            id={`time-span-${span}`}
                            key={span}
                            onClick={() => console.log(`Zoom: ${span}`)}
                            className="w-7 h-7 text-sm text-white bg-[#585858] rounded cursor-pointer hover:bg-gray-600"
                        >
                            {span}
                        </button>
                    )
                )}
            </div>

            {/* Chart */}
            <ReactECharts
                option={option}
                style={{ height: "267px" }}
                onChartReady={handleChartReady}
            />
        </div>
    );
};

export default WaterLevelChart;
