import { DNC } from '../group/result';

import type { Group } from '../group';
import { getSailedResult } from '../group/result';
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
      const result = getSailedResult(boat.results[raceIndex]);
      if (result === false) {
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
