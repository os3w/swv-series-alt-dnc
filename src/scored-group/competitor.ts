import { Result, DNQ } from './result';

export interface GroupCompetitor {
  // The finishing rank.
  rank: number | 'DNQ';
  // The net series score.
  net: number;
  // The total series score.
  total: number;

  elements?: {
    /** The TR for the competitor. */
    competitor?: Element;
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
 * @param b Second competitor's race scores.
 * @returns
 */
export const compareSeriesResults = (
  a: GroupCompetitor,
  b: GroupCompetitor,
): number => {
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
