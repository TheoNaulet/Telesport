/**
 * Represents a single data point in a series for a line chart.
 * Each data point has a name (label) and a corresponding value.
 */
export interface LineChartSeries {
    /**
     * The label or name representing a specific point in the series (e.g., year).
     */
    name: string;

    /**
     * The numerical value associated with the data point (e.g., medals won in that year).
     */
    value: number;
}