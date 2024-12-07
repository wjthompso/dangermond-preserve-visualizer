// src/services/DataManager.ts

import Papa from "papaparse";
import { TimeSeriesData } from "../types/timeSeriesTypes";

export interface CombinedData {
    waterLevel: TimeSeriesData[];
    rainLevel: TimeSeriesData[];
}

export class DataManager {
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
            Papa.parse<TimeSeriesData>(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const data = results.data
                        .map((row: any) => {
                            if (row["Date"] && row["Rain (in)"]) {
                                // Escondido_5_rain_level.csv
                                return {
                                    dateTime: row["Date"],
                                    value: row["Rain (in)"],
                                };
                            } else if (
                                row["Date and Time"] &&
                                row["ft (below ground)"]
                            ) {
                                // Escondido_5_water_level.csv
                                return {
                                    dateTime: row["Date and Time"],
                                    value: row["ft (below ground)"],
                                };
                            } else {
                                return null; // or handle unexpected format
                            }
                        })
                        .filter((row) => row !== null);
                    resolve(data);
                },
                error: (error: any) => {
                    reject(error);
                },
            });
        });
    }

    static async getCombinedData(wellId: string): Promise<CombinedData> {
        const [waterLevel, rainLevel] = await Promise.all([
            this.fetchCSV(wellId, "water"),
            this.fetchCSV(wellId, "rain"),
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

        return { waterLevel, rainLevel };
    }
}
