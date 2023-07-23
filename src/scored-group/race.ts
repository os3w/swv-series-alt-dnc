export type Race = SailedRace | NotSailedRace;

export class SailedRace {
  /** Flag indicating the race was sailed. */
  isSailed = true;
  /** The number of competitors that came to the start area. */
  ctsCount: number;

  constructor(partial: Partial<SailedRace>) {
    this.ctsCount = partial.ctsCount ?? 0;
  }
}

export class NotSailedRace {
  /** Flag indicating the race was not sailed. */
  isSailed = false;
}
