import { cameToStartingArea, DNQ } from '../scored-group';

import { parseValue } from './helpers';

import type {
  NotSailedResult,
  Result,
  SailedResult,
  GroupCompetitor,
} from '../scored-group';

import type { Column } from './column';

export class ResultsHtmlParser {
  competitors: GroupCompetitor[] = [];
  columns: Column[] = [];
  raceCount = 0;
  qualifiedCount = 0;

  parse(tableElement: Element): this {
    for (const node of tableElement.children) {
      switch (node.nodeName) {
        case 'COLGROUP':
          this.parseColGroup(node as HTMLElement);
          break;

        // Don't bother looking at the headings.
        // case 'THEAD':

        case 'TBODY':
          this.parseSummaryRows(node as HTMLElement);
          break;
      }
    }
    return this;
  }

  /**
   * Parse the `<colgroup>` of a results table.
   *
   * @param parent The `<colgroup>` node.
   * @returns The parsed columns.
   */
  protected parseColGroup(parent: HTMLElement): void {
    for (const node of parent.children) {
      // Skip any unexpected nodes.
      if (node.nodeName !== 'COL') continue;

      const { className } = node;
      switch (className) {
        case 'rank':
        case 'total':
        case 'nett':
          this.columns.push({ type: className });
          break;
        case 'race':
          this.columns.push({ type: className, index: this.raceCount });
          ++this.raceCount;
          break;
        default:
          this.columns.push({ type: 'label', name: className });
          break;
      }
    }
  }

  protected parseRaceScore(element: HTMLElement): Result {
    const html = element.innerHTML;
    if (html === '&nbsp;') {
      return { element, html, isNotSailed: true } as NotSailedResult;
    }
    const { isDiscard, score, code } = parseRaceScore(html);
    return {
      element,
      html,
      isDiscard,
      score,
      code,
    } as SailedResult;
  }

  /**
   * Parse a competitor's summary row in a results table.
   *
   * @param parent The `<tr>` node.
   * @returns The parsed columns.
   */
  protected parseSummaryRow(parent: HTMLElement): GroupCompetitor {
    const competitor: GroupCompetitor = {
      rank: NaN,
      net: NaN,
      total: NaN,
      results: [],
      // elements {},
    };
    competitor.elements = { competitor: parent };

    // Column index.
    let colIndex = 0;

    for (const node of parent.children) {
      // Skip any unexpected nodes.
      if (node.nodeName !== 'TD') continue;

      const column = this.columns[colIndex];
      ++colIndex;
      switch (column.type) {
        case 'rank':
          competitor.elements.rank = node;
          competitor.rank = parseRank(node.textContent);
          if (competitor.rank !== DNQ) {
            ++this.qualifiedCount;
          }
          break;
        case 'total':
          competitor.elements.total = node;
          competitor.total = parseValue(node.textContent);
          break;
        case 'nett':
          competitor.elements.net = node;
          competitor.net = parseValue(node.textContent);
          break;
        case 'race':
          competitor.results[column.index] = this.parseRaceScore(
            node as HTMLElement,
          );
        // Ignore labels for now.
        // case 'label':
      }
    }
    return competitor;
  }

  /**
   * Parse a competitor's summary row in a results table.
   *
   * @param parent The `<tbody>` node.
   * @returns The parsed columns.
   */
  protected parseSummaryRows(parent: HTMLElement): void {
    for (const node of parent.children) {
      // Skip any unexpected nodes.
      if (node.nodeName !== 'TR' || !node.classList.contains('summaryrow')) {
        continue;
      }

      this.competitors.push(this.parseSummaryRow(node as HTMLElement));
    }
  }
}

/**
 * Parse a displayed rank value (e.g. '1st') to its numerical value.
 *
 * @param text The displayed rank.
 * @returns The numerical value of the rank, or DNQ.
 */
export const parseRank = (text: string | null): number | 'DNQ' => {
  if (text === null || text === DNQ) return DNQ;
  return parseFloat(text);
};

export const parseRaceScore = (text: string) => {
  const isDiscard = text.charAt(0) === '(';
  const rawText = isDiscard ? text.slice(1, -1) : text;
  const score = parseValue(rawText);
  const spacePos = rawText.indexOf(' ');
  const code = spacePos < 0 ? null : rawText.slice(spacePos + 1);
  const isCts = code === null ? true : cameToStartingArea(code);
  return { isCts, isDiscard, score, code };
};

/**
 * Extract results for each competitor from a summary results table.
 *
 * @param element the `<table>` element.
 * @returns the results.
 */
export const parseResultsTable = (element: Element): ResultsHtmlParser => {
  return new ResultsHtmlParser().parse(element);
};
