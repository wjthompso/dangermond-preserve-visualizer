import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { XAXisOption } from "echarts/types/dist/shared";
import React, { useRef } from "react";

const RainLevelBarChartModal: React.FC = () => {
    const chartRef = useRef<echarts.ECharts>();
    const currentDateRef = useRef<HTMLDivElement>(null);

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

                    const formattedDate = `<strong>${xValue}:00</strong> on Aug 3, 2024`;

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
                        return `${params.seriesData[0].data} in`;
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
                data: [120, 125, 130, 118, 112, 135, 122, 128],
                type: "bar",
                barWidth: "99%", // Increase bar width to remove gaps
                itemStyle: {
                    color: "rgba(90, 153, 255, 1)",
                    borderColor: "white", // Add thin white border
                    borderWidth: 1,
                    borderRadius: [4, 4, 0, 0], // Rounded tops for bars
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
            {/* Chart Title */}
            <h3
                id="rain-level-chart-title"
                className="mb-1 text-xl font-bold text-white"
            >
                Rain Level (in)
            </h3>

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
                    updateAxisPointer: handleAxisPointerUpdate,
                }}
            />
        </div>
    );
};

export default RainLevelBarChartModal;
