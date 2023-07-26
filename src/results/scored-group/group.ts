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
