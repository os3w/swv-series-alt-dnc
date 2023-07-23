import { parseResultsTable } from '../html/parse-results-table';
import { formatSailedResult, formatScore } from '../html/helpers';
import { Competitor, compareSeriesResults } from './competitor';
import { getSailedResult } from './result';
import { Column } from '../html/column';
import { SailedRace, NotSailedRace, Race } from './race';
import { getDiscardIndexes } from './score';

/**
 * A group (also referred to as a "Scored Group") is a set of competitors that are
 * scored against each other in a series.
 */
export class Group {
  caption: string;
  id: string | null;
  title: string;
  competitors: Competitor[];
  resultsColumns: Column[];
  races: Race[];
  qualifiedCount: number;

  constructor(partial: Partial<Group>, raceCount: number) {
    this.id = partial.id ?? null;
    this.caption = partial.caption ?? '';
    this.title = partial.title ?? '';
    this.competitors = partial.competitors ?? [];
    this.resultsColumns = partial.resultsColumns ?? [];
    this.qualifiedCount = partial.qualifiedCount ?? 0;
    this.races = processRaces(this, raceCount);
  }

  recalculate() {
    this.recalculateDiscards();
    this.recalculateRankings();
  }

  protected recalculateDiscards() {
    for (const competitor of this.competitors) {
      // Calculate the number of discards allowed and collect the scores for
      // each race.
      let discardsAllowed = 0;
      let totalScore = 0;
      const scores = [];
      for (const result of competitor.results) {
        const sailedResult = getSailedResult(result);
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
        totalScore += score;
        scores.push(score);
      }
      // Get which results to discard.
      const discardIndexes = getDiscardIndexes(scores, discardsAllowed);

      // Mark the appropriate races.
      let netScore = totalScore;
      for (const index of discardIndexes) {
        const sailedResult = getSailedResult(competitor.results[index]);
        // We cannot discard a race that has not been sailed.
        if (!sailedResult) continue;
        sailedResult.isDiscard = true;
        netScore -= sailedResult.score;
      }

      // Set the totals for the competitor and we are done.
      competitor.total = totalScore;
      competitor.net = netScore;
    }
  }

  recalculateRankings() {
    console.log('Before', JSON.parse(JSON.stringify(this.competitors)));
    this.competitors.sort(compareSeriesResults);
    console.log('After', JSON.parse(JSON.stringify(this.competitors)));
  }

  render() {
    let rank = 0;
    for (const competitor of this.competitors) {
      // Place this in order in the DOM to suit the new ranking.
      if (competitor.elements?.competitor?.parentElement) {
        competitor.elements.competitor.parentElement.insertBefore(
          competitor.elements.competitor,
          null,
        );
      }
      // Update the ranking.
      ++rank;
      if (competitor.elements?.rank) {
        competitor.elements.rank.textContent = getOrdinal(rank);
      }

      // Update all the scores in the DOM.
      for (const result of competitor.results) {
        const sailedResult = getSailedResult(result);
        if (!sailedResult) {
          // Skip races not sailed.
          continue;
        }
        result.element.textContent = formatSailedResult(sailedResult);
      }

      // Check these exist to avoid any problems.
      if (competitor?.elements?.net && competitor.elements.total) {
        competitor.elements.net.textContent = formatScore(competitor.net);
        competitor.elements.total.textContent = formatScore(competitor.total);
      }
    }
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
      partialGroup.qualifiedCount = results.qualifiedCount;
      partialGroup.competitors = results.competitors;
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
    // Look at each competitor's result for the race.
    for (const { results } of group.competitors) {
      const sailedResult = getSailedResult(results[i]);

      if (!sailedResult) {
        if (race.isSailed) {
          // If a race is sailed we should have a score for every competitor,
          // but if we do not we will ignore it.
          continue;
        }
        race.isSailed = false;
        continue;
      }

      if (!(race.isSailed === true)) {
        race.isSailed = true;
        (race as SailedRace).ctsCount = 0;
      }
      if (sailedResult.isCts) {
        // Add the competitor to the count of competitors that came to the start area.
        ++(race as SailedRace).ctsCount;
      }
    }
    races.push(race.isSailed ? new SailedRace(race) : new NotSailedRace());
  }
  return races;
};

export const getOrdinal = (n: number): string => {
  let ordinal = 'th';
  switch (n % 10) {
    case 1:
      if (n % 100 !== 11) ordinal = 'st';
      break;
    case 2:
      if (n % 100 !== 12) ordinal = 'nd';
      break;
    case 3:
      if (n % 100 !== 13) ordinal = 'rd';
      break;
  }
  return n + ordinal;
};
