import { parseResultsTable } from './results';
import { Boat } from './boat';
import { Column } from './column';
import { SailedRace, NotSailedRace, Race } from './race';

/**
 * A group (also referred to as a "Scored Group") is a set of boats that are
 * scored against each other in a series.
 */
export class Group {
  caption: string;
  id: string | null;
  title: string;
  boats: Boat[];
  resultsColumns: Column[];
  races: Race[];

  constructor(partial: Partial<Group>, raceCount: number) {
    this.id = partial.id ?? null;
    this.caption = partial.caption ?? '';
    this.title = partial.title ?? '';
    this.boats = partial.boats ?? [];
    this.resultsColumns = partial.resultsColumns ?? [];
    this.races = processRaces(this, raceCount);
  }
}

export const parseGroup = (titleElement: Element): Group => {
  const partialGroup: Partial<Group> = {
    // Remove 'summary' from the beginning of the id.
    id: titleElement.id.slice(7),
    title: titleElement.textContent ?? undefined,
  };

  let el: Element | null = titleElement;
  let raceCount = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Look at the next element, stopping when there are no more siblings
    // or we reach the next title element (which should not happen).
    el = el.nextElementSibling;
    if (!el || el.classList.contains('summarytitle')) break;

    if (el.classList.contains('summarycaption')) {
      // Process the caption.
      partialGroup.caption = el.textContent ?? '';
    } else if (el.classList.contains('summarytable')) {
      // Process the results table.
      const results = parseResultsTable(el);
      raceCount = results.raceCount;
      partialGroup.boats = results.boats;
      partialGroup.resultsColumns = results.columns;
    }
  }

  return new Group(partialGroup, raceCount);
};

const processRaces = (group: Group, raceCount: number): Race[] => {
  const races: Race[] = [];
  // Build results for each race.
  for (let i = 0; i < raceCount; ++i) {
    const race: Partial<Race> = {};
    // Look at each boat's result for the race.
    for (const { races } of group.boats) {
      const result = races[i];

      if ('isNotSailed' in result) {
        if (race.isSailed) {
          // If a race is sailed we should have a score for every competitor,
          // but if we do not we will ignore it.
          continue;
        }
        race.isSailed = false;
        continue;
      }

      // We can now upgrade race to a SailedRace.
      if (!(race.isSailed === true)) {
        race.isSailed = true;
        (race as SailedRace).ctsCount = 0;
      }
      if (result.isCts) {
        // Add the boat to the count of boats that came to the start area.
        ++(race as SailedRace).ctsCount;
      }
    }
    races.push(race.isSailed ? new SailedRace(race) : new NotSailedRace());
  }
  return races;
};
