export const formatHourly = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return `${date.getHours().toString().padStart(2, "0")}:00`; // e.g., "11:00", "12:00"
};
export const formatDaily = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }); // e.g., "Nov 1"
};
const formatWeekly = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", { weekday: "short" }); // e.g., "Mon"
};
export const formatMonthly = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date
        .toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
        })
        .replace(" ", " '"); // e.g., "Apr, '24"
};
export const formatYearly = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date
        .toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
        })
        .replace(" ", " '"); // e.g., "Apr '24"
};
export const format2Years = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date
        .toLocaleDateString("en-US", { year: "numeric" })
        .replace(" ", " '"); // e.g., "2024"
};
export const format3Years = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", { year: "numeric" }); // e.g., "2024"
};
export const formatAll = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", { year: "numeric" }); // e.g., "2024"
};

export const xAxisFormatter = (value: string, timeSpan: string): string => {
    return timeSpan === "1D"
        ? formatHourly(value)
        : timeSpan === "1W"
        ? formatDaily(value)
        : timeSpan === "3M"
        ? formatDaily(value)
        : timeSpan === "6M"
        ? formatMonthly(value)
        : timeSpan === "1Y"
        ? formatYearly(value)
        : timeSpan === "2Y"
        ? format2Years(value)
        : timeSpan === "3Y"
        ? format3Years(value)
        : timeSpan === "ALL"
        ? formatAll(value)
        : value;
};
