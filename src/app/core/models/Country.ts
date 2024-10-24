import { Participation } from "./Participation";

/**
 * Represents a country and its participation data in the Olympic Games.
 */
export interface Country {
  /**
   * The name of the country.
   */
  country: string;

  /**
   * A list of participations in various Olympic Games for this country.
   * Each participation includes the year, number of medals, and athlete data.
   */
  participations: Participation[];
}
