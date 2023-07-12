import { BoatNotSailedResult, BoatSailedResult } from '../group/boat';
import type { Group } from '../group';
import { DNC } from '../result-codes';
import { SailedRace } from '../group/race';

export const rescoreDncExcludingDnq = ({
  boats,
  races,
  qualifiedCount,
}: Group) => {
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
