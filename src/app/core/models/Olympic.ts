import { Participation } from './Participation';

/**
 * Represents the data for a country's involvement in the Olympic Games.
 */
export interface Olympic {
  /**
   * The unique identifier for the Olympic entry.
   */
  id: number;

  /**
   * The name of the country participating in the Olympic Games.
   */
  country: string;

  /**
   * An array of participations by this country in various Olympic Games.
   * Each participation includes information like the year, city, medals, and athletes.
   */
  participations: Participation[];
}
