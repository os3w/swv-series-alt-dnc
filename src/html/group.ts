import { checkIsSailedResult } from '../scored-group';

import { parseResultsTable } from './results-table';
import { formatSailedResult, formatScore } from './helpers';

import type { Group, GroupRace } from '../scored-group';

export const renderGroup = (group: Group) => {
  for (const competitor of group.competitors) {
    const { elements, rank, results } = competitor;
    // Place this in order in the DOM to suit the new ranking.
    if (elements?.competitor?.parentElement) {
      elements.competitor.parentElement.insertBefore(elements.competitor, null);
    }
    // Update the ranking.
    if (elements?.rank) {
      elements.rank.textContent =
        typeof rank === 'number' ? getOrdinal(rank) : rank;
    }

    // Update all the scores in the DOM.
    for (const result of results) {
      const sailedResult = checkIsSailedResult(result);
      if (!sailedResult) {
        // Skip races not sailed.
        continue;
      }
      result.element.textContent = formatSailedResult(sailedResult);
    }

    // Check these exist to avoid any problems.
    if (elements?.net && elements.total) {
      elements.net.textContent = formatScore(competitor.net);
      elements.total.textContent = formatScore(competitor.total);
    }
  }
};

export const parseGroup = (titleElement: Element): Group => {
  const group: Group = {
    // Remove 'summary' from the beginning of the id.
    id: titleElement.id.slice(7),
    caption: '',
    title: titleElement.textContent ?? '',
    competitors: [],
    qualifiedCount: 0,
    races: [],
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
      group.caption = el.textContent ?? '';
    } else if (el.classList.contains('summarytable')) {
      // Process the results table.
      const results = parseResultsTable(el);
      raceCount = results.raceCount;
      group.qualifiedCount = results.qualifiedCount;
      group.competitors = results.competitors;
    }
  }

  group.races = processRaces(group, raceCount);
  return group;
};

const processRaces = (group: Group, raceCount: number): GroupRace[] => {
  const races: GroupRace[] = [];
  // Build results for each race.
  for (let i = 0; i < raceCount; ++i) {
    const race: GroupRace = {
      isSailed: false,
      cameToStartArea: 0,
    };
    // Look at each competitor's result for the race.
    for (const { results } of group.competitors) {
      const sailedResult = checkIsSailedResult(results[i]);

      if (!sailedResult) {
        if (race.isSailed) {
          // If a race is sailed we should have a score for every competitor,
          // but if we do not we will ignore it.
        }
        continue;
      }

      race.isSailed = true;
      if (sailedResult.isCts) {
        // Add the competitor to the count of competitors that came to the start area.
        ++race.cameToStartArea;
      }
    }

    // races.push(race.isSailed ? new SailedRace(race) : new NotSailedRace());
    races.push(race);
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
