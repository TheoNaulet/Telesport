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
