import { compareSeriesResults } from './competitor';
import { DNQ, checkIsSailedResult } from './result';
import { getDiscardIndexes } from './score';

import type { GroupCompetitor } from './competitor';
import type { GroupRace } from './race';

/**
 * A group (also referred to as a "Scored Group") is a set of competitors that are
 * scored against each other in a series.
 */
export interface Group {
  caption: string;
  id: string | null;
  title: string;
  competitors: GroupCompetitor[];
  races: GroupRace[];
  qualifiedCount: number;
}

export const recalculateGroup = (group: Group) => {
  recalculateDiscards(group);
  recalculateRankings(group);
};

export const recalculateDiscards = (group: Group) => {
  for (const competitor of group.competitors) {
    // Calculate the number of discards allowed and collect the scores for
    // each race.
    let discardsAllowed = 0;
    let totalScoreTimesTen = 0;
    const scores = [];
    for (const result of competitor.results) {
      const sailedResult = checkIsSailedResult(result);
      if (!sailedResult) {
        // Still add the score so we get the index right.
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

export const recalculateRankings = (group: Group) => {
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
