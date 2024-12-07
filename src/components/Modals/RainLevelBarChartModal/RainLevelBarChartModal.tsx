// RainLevelBarChartModal.tsx

import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { XAXisOption } from "echarts/types/dist/shared";
import React, { useEffect, useRef } from "react";
import { useWaterLevelStore } from "../../../stores/useWaterLevelStore";

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

    // When hoveredAxisIndex changes, showTip on this chart
    useEffect(() => {
        const unsub = useWaterLevelStore.subscribe((state) => {
            const hovered: number | null = state.hoveredAxisIndex;
            if (!chartRef.current) return;

            isProgrammaticUpdate.current = true;
            if (hovered !== null) {
                chartRef.current.dispatchAction({
                    type: "showTip",
                    seriesIndex: 0,
                    dataIndex: hovered,
                });
            } else {
                chartRef.current.dispatchAction({ type: "hideTip" });
            }
            isProgrammaticUpdate.current = false;
        });

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
            const chartOptions = chartRef.current.getOption();
            if (Array.isArray(chartOptions.xAxis)) {
                const xAxis = chartOptions.xAxis[0];
                if (xAxis.type === "category" && "data" in xAxis) {
                    const xAxisData = (
                        xAxis as XAXisOption & { data: string[] }
                    ).data;
                    const xIndex = params.axesInfo[0].value;
                    const xValue = xAxisData[xIndex] || xIndex;

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
