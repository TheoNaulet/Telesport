/**
 * Represents a country's participation in a specific Olympic Games.
 */
export interface Participation {
    /**
     * The unique identifier for the participation entry.
     */
    id: number;

    /**
     * The year of the Olympic Games in which the country participated.
     */
    year: number;

    /**
     * The host city of the Olympic Games for this participation.
     */
    city: string;

    /**
     * The number of medals won by the country in this Olympic Games.
     */
    medalsCount: number;

    /**
     * The number of athletes who represented the country in this Olympic Games.
     */
    athleteCount: number;
}