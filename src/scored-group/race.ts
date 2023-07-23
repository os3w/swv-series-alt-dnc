export type Race = SailedRace | NotSailedRace;

export interface SailedRace {
  /** Flag indicating the race was sailed. */
  isSailed: true;
  /** The number of competitors that came to the start area. */
  ctsCount: number;
}

export interface NotSailedRace {
  /** Flag indicating the race was not sailed. */
  isSailed: false;
}

/**
 * Check if a result is a sailed result.
 *
 * @param result The result to check.
 * @returns The result if sailed, otherwise false.
 */
/**
 * Set a race to NotSailed.*/

export const setRaceNotSailed = (race: Race): NotSailedRace => {
  (race as unknown as NotSailedRace).isSailed = false;
  return race as unknown as NotSailedRace;
};

/**
 * Check if a result is a sailed result.
 *
 * @param result The result to check.
 * @returns The result if sailed, otherwise false.
 */
export const getSailedRace = (race: Race): SailedRace | false =>
  (race as unknown as SailedRace).isSailed === true && (race as SailedRace);
