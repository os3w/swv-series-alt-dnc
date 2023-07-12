import { DNC } from '../result-codes';

import type { Group } from '../group';
import type { BoatNotSailedResult, BoatSailedResult } from '../group/boat';
import type { SailedRace } from '../group/race';

/**
 * Adjust the score for each DNC result to the greater of the number of boats
 * qualifying for the series and the number that came to the starting area for
 * the race, plus 1.
 *
 * Note that this only recalculates individual race scores, it does NOT
 * recalculate discards or totals.
 *
 * @param group The group to be rescored.
 */
export const rescoreDncBasedOnQualifiers = (group: Group) => {
  const { boats, races, qualifiedCount } = group;

  for (let raceIndex = 0; raceIndex < races.length; ++raceIndex) {
    const race = races[raceIndex] as SailedRace;
    if (!race.isSailed) {
      // We shouldn't have to do anything with a race that is not sailed.
      continue;
    }

    for (const boat of boats) {
      const result = boat.races[raceIndex] as BoatSailedResult;
      if ((result as unknown as BoatNotSailedResult).isNotSailed) {
        // We shouldn't have a boat without a result for a sailed race, but
        // we will ignore this.
        continue;
      }

      if (result.code === DNC) {
        // Rescore DNC result only.
        result.score = (Math.max(qualifiedCount, race.ctsCount) + 1) * 10;
      }
    }
  }
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
export const calculateDiscards = (
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
