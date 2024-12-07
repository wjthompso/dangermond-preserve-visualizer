// src/utils/timeSeriesUtils.ts
import { TimeSeriesData, TimeSpan } from "../types/timeSeriesTypes";

/**
 * Filters the time series data based on the selected time span.
 * Uses the latest date in the dataset as the reference point.
 */
export const filterTimeSeries = (
    data: TimeSeriesData[],
    timeSpan: TimeSpan
): TimeSeriesData[] => {
    if (timeSpan === "ALL") return data;

    const endDate = new Date(data[data.length - 1].dateTime);
    let startDate = new Date(endDate);

    switch (timeSpan) {
        case "1D":
            startDate.setDate(endDate.getDate() - 1);
            break;
        case "1W":
            startDate.setDate(endDate.getDate() - 7);
            break;
        case "3M":
            startDate.setMonth(endDate.getMonth() - 3);
            break;
        case "6M":
            startDate.setMonth(endDate.getMonth() - 6);
            break;
        case "1Y":
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
        case "2Y":
            startDate.setFullYear(endDate.getFullYear() - 2);
            break;
        case "3Y":
            startDate.setFullYear(endDate.getFullYear() - 3);
            break;
        default:
            startDate = new Date(data[0].dateTime);
    }

    return data.filter(
        (d) =>
            new Date(d.dateTime) >= startDate && new Date(d.dateTime) <= endDate
    );
};

/**
 * Finds the closest timestamp in targetData relative to the referenceTime.
 */
export const findClosestTimestamp = (
    targetData: TimeSeriesData[],
    referenceTime: Date
): TimeSeriesData | null => {
    if (targetData.length === 0) return null;

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
            minDiff = currentDiff;
        }
    }

    return closest;
};
