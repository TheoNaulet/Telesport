/**
 * Represents the data structure for a pie chart slice.
 * Each slice has a name (label) and a numerical value.
 */
export interface PieChartData {
    /**
     * The label or name representing the data point in the pie chart (e.g., country name).
     */
    name: string;

    /**
     * The numerical value associated with the pie chart slice (e.g., total medals).
     */
    value: number;
}

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
