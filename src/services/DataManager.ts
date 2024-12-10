// src/services/DataManager.ts

import Papa from "papaparse";
import {
    CombinedData,
    Coordinates,
    LithologyLayer,
    TimeSeriesData,
} from "../types/timeSeriesTypes";

/**
 * Helper function to standardize dateTime strings to ISO format.
 * - For rain data: "2024-11-02 (Sat)" => "2024-11-02T00:00:00Z"
 * - For water data: "2024-11-07 14:02:35" => "2024-11-07T14:02:35Z"
 * @param dateTime - The original dateTime string from CSV.
 * @param type - 'water' or 'rain' to determine the format.
 * @returns ISO-formatted dateTime string.
 */
const standardizeDateTime = (
    dateTime: string,
    type: "water" | "rain"
): string => {
    if (type === "rain") {
        // Extract the date part before any parentheses
        const datePart = dateTime.split(" ")[0];
        return `${datePart}T00:00:00Z`; // UTC timezone
    } else if (type === "water") {
        // Replace space with 'T' and append 'Z' for UTC
        return `${dateTime.replace(" ", "T")}Z`;
    }
    return dateTime; // Fallback to original if type is unknown
};

export class DataManager {
    /**
     * Fetches and parses a CSV file for a given well and type.
     * @param wellId - The ID of the well.
     * @param type - 'water' or 'rain'.
     * @returns A promise that resolves to an array of TimeSeriesData.
     */
    static async fetchCSV(
        wellId: string,
        type: "water" | "rain"
    ): Promise<TimeSeriesData[]> {
        const fileName =
            type === "water"
                ? `${wellId}_water_level.csv`
                : `${wellId}_rain_level.csv`;
        const response = await fetch(`/data/${fileName}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch ${fileName}`);
        }

        const csvText = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse<any>(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const data: TimeSeriesData[] = results.data
                        .map((row: any) => {
                            if (
                                type === "rain" &&
                                row["Date"] &&
                                row["Rain (in)"] !== undefined
                            ) {
                                // Example: "Escondido_5_rain_level.csv"
                                return {
                                    dateTime: standardizeDateTime(
                                        row["Date"],
                                        type
                                    ),
                                    value: parseFloat(row["Rain (in)"]),
                                };
                            } else if (
                                type === "water" &&
                                row["Date and Time"] &&
                                row["ft (below ground)"] !== undefined
                            ) {
                                // Example: "Escondido_5_water_level.csv"
                                return {
                                    dateTime: standardizeDateTime(
                                        row["Date and Time"],
                                        type
                                    ),
                                    value: parseFloat(row["ft (below ground)"]),
                                };
                            } else {
                                console.warn("Unexpected CSV format:", row);
                                return null; // or handle unexpected format
                            }
                        })
                        .filter(
                            (row: TimeSeriesData | null) => row !== null
                        ) as TimeSeriesData[];
                    resolve(data);
                },
                error: (error: any) => {
                    reject(error);
                },
            });
        });
    }

    /**
     * Fetches and parses the lithology JSON file for a given well.
     * @param wellId - The ID of the well.
     * @returns A promise that resolves to an object containing coordinates and layers.
     */
    static async fetchLithology(
        wellId: string
    ): Promise<{ coordinates: Coordinates; layers: LithologyLayer[] }> {
        const fileName = `${wellId}_lithology.json`;
        const response = await fetch(`/data/${fileName}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch ${fileName}`);
        }

        const data = await response.json();

        // Validate JSON structure
        if (!data.coordinates || !data.layers) {
            throw new Error(`Invalid structure in ${fileName}`);
        }

        return {
            coordinates: data.coordinates,
            layers: data.layers,
        };
    }

    /**
     * Fetches both water, rain, and lithology data for a given well.
     * @param wellId - The ID of the well.
     * @returns A promise that resolves to CombinedData.
     */
    static async getCombinedData(wellId: string): Promise<CombinedData> {
        const [waterLevel, rainLevel, lithologyData] = await Promise.all([
            this.fetchCSV(wellId, "water"),
            this.fetchCSV(wellId, "rain"),
            this.fetchLithology(wellId),
        ]);

        // Sort data by dateTime
        waterLevel.sort(
            (a, b) =>
                new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
        );
        rainLevel.sort(
            (a, b) =>
                new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
        );

        return {
            waterLevel,
            rainLevel,
            coordinates: lithologyData.coordinates,
            layers: lithologyData.layers,
        };
    }
}
