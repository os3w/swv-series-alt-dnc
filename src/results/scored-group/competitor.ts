import { Result } from '../result';

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
