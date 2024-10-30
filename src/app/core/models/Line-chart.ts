import { LineChartSeries } from "./Line-chart-series";

/**
 * Represents the data structure for a full line chart.
 * Each line chart consists of a name (label) and a series of data points.
 */
export interface LineChartData {
    /**
     * The label or name for the data series (e.g., country name).
     */
    name: string;

    /**
     * An array of data points (series) for the line chart, where each point includes a name (label) and a value.
     */
    series: LineChartSeries[];
}
