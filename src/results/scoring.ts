import { DNQ, checkIsSailedResult } from './result';

import type { GroupCompetitor } from './scored-group/competitor';
import type { Group } from './scored-group/group';

/*
export interface ComparableResult {
  score: number;
}

export interface ComparableResults {
  net: number;
  results: ComparableResult[];
}
*/

export const applyDiscardsAndCalculateTotals = (group: Group) => {
  for (const competitor of group.competitors) {
    // Calculate the number of discards allowed and collect the scores for
    // each race.
    let discardsAllowed = 0;
    let totalScoreTimesTen = 0;
    const scores = [];

    for (const result of competitor.results) {
      const sailedResult = checkIsSailedResult(result);

      if (!sailedResult) {
        // Still add the score so we get the index right but make sure it is
        // the last to be discarded.
        scores.push(-Infinity);
        continue;
      }

      const { isDiscard, score } = sailedResult;
      if (isDiscard) {
        // Count the number allowed and then forget it.
        ++discardsAllowed;
        sailedResult.isDiscard = false;
      }
      totalScoreTimesTen += Math.round(score * 10);
      scores.push(score);
    }

    // Get which results to discard.
    const discardIndexes = getDiscardIndexes(scores, discardsAllowed);

    // Mark the appropriate races.
    let netScoreTimesTen = totalScoreTimesTen;
    for (const index of discardIndexes) {
      const sailedResult = checkIsSailedResult(competitor.results[index]);
      // We cannot discard a race that has not been sailed.
      if (!sailedResult) continue;
      sailedResult.isDiscard = true;
      netScoreTimesTen -= Math.round(sailedResult.score * 10);
    }

    // Set the totals for the competitor and we are done.
    competitor.total = totalScoreTimesTen / 10;
    competitor.net = netScoreTimesTen / 10;
  }
};

/**
 * Compare series results for two competitors in a scored group.
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

/**
 * Get the indexes of scores to discard.
 *
 * The indexes are in order of applying the discard algorithm so the index of
 * the highest value is returned first; for equal values the earlier index is
 * returned first.
 *
 * @param scores
 * @param number
 * @returns
 */
export const getDiscardIndexes = (
  scores: number[],
  number: number,
): number[] => {
  if (number < 1) return [];

  // Sort the scores so we know what to discard.
  const sorted = scores.slice().sort((a: number, b: number) => a - b);
  const scoresToDiscard = sorted.slice(-number).reverse();
  const discards = [];

  let lastScore = NaN;
  let lastIndex = NaN;
  for (const score of scoresToDiscard) {
    if (score === lastScore) {
      lastIndex = scores.indexOf(score, lastIndex + 1);
      discards.push(lastIndex);
    } else {
      lastIndex = scores.indexOf(score);
      lastScore = score;
      discards.push(lastIndex);
    }
  }
  return discards;
};

export const recalculateGroupRankings = (group: Group) => {
  console.log('Before', JSON.parse(JSON.stringify(group.competitors)));
  // Sort into the new rank order.
  group.competitors.sort(compareSeriesResults);

  // Update the rank for each competitor.
  let rank = 0;
  for (const competitor of group.competitors) {
    ++rank;
    if (competitor.rank === DNQ) break;
    competitor.rank = rank;
  }
  console.log('After', JSON.parse(JSON.stringify(group.competitors)));
};

export const scoreGroup = (group: Group) => {
  applyDiscardsAndCalculateTotals(group);
  recalculateGroupRankings(group);
};
