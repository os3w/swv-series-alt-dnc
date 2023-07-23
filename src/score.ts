import { DNC, DNQ } from './scored-group/result';
import { getSailedRace, setRaceNotSailed } from './scored-group/race';
import { getSailedResult } from './scored-group/result';

import type { Group } from './scored-group/group';

/**
 * Adjust the score for each DNC result to the greater of the number of competitors
 * qualifying for the series and the number that came to the starting area for
 * the race, plus 1.
 *
 * Note that this only recalculates individual race scores, it does NOT
 * recalculate discards or totals.
 *
 * @param group The group to be rescored.
 */
export const rescoreQualifiers = (group: Group) => {
  const { competitors, races, qualifiedCount } = group;

  for (let raceIndex = 0; raceIndex < races.length; ++raceIndex) {
    const sailedRace = getSailedRace(races[raceIndex]);
    if (!sailedRace) {
      // We shouldn't have to do anything with a race that is not sailed.
      continue;
    }

    for (const competitor of competitors) {
      const result = getSailedResult(competitor.results[raceIndex]);
      if (result === false) {
        // We shouldn't have a competitor without a result for a sailed race, but
        // we will ignore this.
        continue;
      }

      if (result.code === DNC) {
        // Rescore DNC result only.
        result.score = (Math.max(qualifiedCount, sailedRace.ctsCount) + 1) * 10;
      }
    }
  }
};

/**
 * Adjust the score for each DNC result to the greater of the number of competitors
 * qualifying for the series and the number that came to the starting area for
 * the race, plus 1.
 *
 * Note that this only recalculates individual race scores, it does NOT
 * recalculate discards or totals.
 *
 * @param group The group to be rescored.
 */
export const rescoreQualifyingRaces = (group: Group) => {
  const { competitors, races, qualifiedCount } = group;

  for (let raceIndex = 0; raceIndex < races.length; ++raceIndex) {
    const sailedRace = getSailedRace(races[raceIndex]);
    if (!sailedRace) {
      // We shouldn't have to do anything with a race that is not sailed.
      continue;
    }

    let atLeastOneQualifierCame = false;
    for (const competitor of competitors) {
      if (!atLeastOneQualifierCame && competitor.rank !== DNQ) {
        atLeastOneQualifierCame = true;
      }
      const result = getSailedResult(competitor.results[raceIndex]);
      if (result === false) {
        // We shouldn't have a competitor without a result for a sailed race, but
        // we will ignore this.
        continue;
      }

      if (result.code === DNC) {
        // Rescore DNC result only.
        result.score = (Math.max(qualifiedCount, sailedRace.ctsCount) + 1) * 10;
      }
    }

    // @REVISIT need a test to check this works.
    if (!atLeastOneQualifierCame) {
      setRaceNotSailed(sailedRace);
    }
  }
};
