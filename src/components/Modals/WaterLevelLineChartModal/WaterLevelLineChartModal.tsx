// src/components/Modals/WaterLevelLineChartModal/WaterLevelLineChartModal.tsx

import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import React, { useEffect, useMemo, useRef } from "react";
import { useWaterLevelStore } from "../../../stores/useWaterLevelStore";
import { TimeSeriesData, TimeSpan } from "../../../types/timeSeriesTypes";

interface WaterLevelLineChartModalProps {
    waterData: TimeSeriesData[];
    rainData: TimeSeriesData[]; // If needed for reference, else can remove
    timeSpan: TimeSpan;
    setTimeSpan: (span: TimeSpan) => void;
}

const WaterLevelLineChartModal: React.FC<WaterLevelLineChartModalProps> = ({
    waterData,
    rainData,
    timeSpan,
    setTimeSpan,
}) => {
    const chartRef = useRef<echarts.ECharts>(null);
    const currentDateRef = useRef<HTMLDivElement>(null);

    const setHoveredAxisIndex =
        useWaterLevelStore.getState().setHoveredAxisIndex;
    const setWaterLevel = useWaterLevelStore.getState().setWaterLevel;
    const hoveredAxisIndexRef = useRef<number | null>(
        useWaterLevelStore.getState().hoveredAxisIndex
    );
    const isProgrammaticUpdate = useRef(false);

    const { min, max } = useMemo(() => {
        if (waterData.length === 0) return { min: 0, max: 1 };
        const minVal = Math.min(...waterData.map((d) => d.value));
        const maxVal = Math.max(...waterData.map((d) => d.value));
        const range = maxVal - minVal || 1;
        const padding = range * 0.2 * 0.5;
        return {
            min: minVal - padding,
            max: maxVal + padding,
        };
    }, [waterData]);

    const interval = useMemo(() => {
        const range = max - min;
        if (range <= 12) return 2;
        if (range <= 50) return 5;
        if (range <= 100) return 10;
        if (range <= 500) return 50;
        return 100;
    }, [min, max]);

    const option: echarts.EChartsOption = useMemo(
        () => ({
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
                            return isNaN(val) ? "" : `${val} ft`;
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
                data: waterData.map((d) => d.dateTime),
                axisLine: { show: true, lineStyle: { color: "#555" } },
                axisLabel: { color: "#aaa" },
            },
            yAxis: {
                type: "value",
                min,
                max,
                splitNumber: 5,
                interval: interval,
                axisLine: { show: true, lineStyle: { color: "#555" } },
                axisLabel: {
                    color: "#aaa",
                    formatter: (value: number) =>
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
                    data: waterData.map((d) => d.value),
                    type: "line",
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "rgba(90, 153, 255, 1)" },
                            { offset: 1, color: "rgba(90, 153, 255, 0)" },
                        ]),
                    },
                    lineStyle: { color: "#91BDE5", width: 2 },
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
        }),
        [waterData, min, max, interval]
    );

    const handleChartReady = (chart: echarts.ECharts) => {
        chartRef.current = chart;
    };

    const updateWaterLevelAndDate = (xIndex: number) => {
        const newLevel = waterData[xIndex]?.value ?? 0;
        setWaterLevel(newLevel);

        const xValue = waterData[xIndex]?.dateTime || "";
        const formattedDate = `<strong>${xValue}</strong>`;
        if (currentDateRef.current) {
            currentDateRef.current.innerHTML = formattedDate;
        }
    };

    // Subscribe to hoveredAxisIndex changes imperatively
    useEffect(() => {
        const unsub = useWaterLevelStore.subscribe(
            (state) => state.hoveredAxisIndex,
            (hovered: number | null) => {
                if (!chartRef.current) return;
                isProgrammaticUpdate.current = true;
                if (hovered !== null && hovered < waterData.length) {
                    chartRef.current.dispatchAction({
                        type: "showTip",
                        seriesIndex: 0,
                        dataIndex: hovered,
                    });
                    updateWaterLevelAndDate(hovered);
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
    }, [waterData]);

    const handleAxisPointerUpdate = (params: any) => {
        if (isProgrammaticUpdate.current) return;
        if (params?.axesInfo?.[0] && chartRef.current) {
            const xIndex = params.axesInfo[0].value;
            if (xIndex !== null && xIndex >= 0 && xIndex < waterData.length) {
                hoveredAxisIndexRef.current = xIndex;
                setHoveredAxisIndex(xIndex);
            }
        }
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
                {["1D", "1W", "3M", "6M", "1Y", "2Y", "3Y"].map((span) => (
                    <button
                        id={`time-span-${span}`}
                        key={span}
                        onClick={() => setTimeSpan(span as TimeSpan)}
                        className={`w-7 h-7 text-sm font-semibold rounded cursor-pointer ${
                            timeSpan === span
                                ? "bg-[#585858] text-white"
                                : " text-white hover:bg-gray-600"
                        }`}
                    >
                        {span}
                    </button>
                ))}
            </div>
            <div
                id="current-date-display"
                ref={currentDateRef}
                className="mt-[0.125rem] text-sm font-medium text-center text-white"
            >
                Hover over the chart
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

export default React.memo(WaterLevelLineChartModal);
