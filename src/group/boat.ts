import { Result, DNQ } from './result';

export interface Boat {
  // The finishing rank.
  rank: number | 'DNQ';
  // The net series score as a number x 10.
  net: number;
  // The total series score as a number x 10.
  total: number;

  elements?: {
    /** The TR for the boat. */
    boat?: Element;
    /** The TD showing the rank. */
    rank?: Element;
    /** The TD showing the net score. */
    net?: Element;
    /** The TD showing the total score. */
    total?: Element;
  };

  results: Result[];
}

/**
 * Compare series results for two competitors.
 */

/**
 *
 * @param a First competitor's race scores.
 * @param b Second competitor's race scores.ss
 * @returns
 */
export const compareSeriesResults = (a: Boat, b: Boat): number => {
  // If only one is DNQ it is easy.
  if (a.rank === DNQ) {
    if (b.rank !== DNQ) {
      return 1;
    }
  } else if (b.rank === DNQ) {
    return -1;
  }
  // If the net scores are different it is easy.
  const difference = a.net - b.net;
  if (difference) return difference;
  return 0;
};
