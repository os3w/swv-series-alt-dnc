import { Boat } from './boat';
import {
  cameToStartingArea,
  NotSailedResult,
  Result,
  SailedResult,
} from './result';
import { Column } from './column';

/*
export class Results {
  /** The boats entered in this group. * /
  boats: Boat[];
  /** The columns of the results table. * /
  columns: Column[];
  /** Races for this group (may not all be sailed). * /
  races: Race[];

  constructor(partial: Partial<Results>) {
    this.columns = partial.columns ?? [];
    this.boats = partial.boats ?? [];
    this.races = partial.races ?? [];
  }
}
*/

export const DNQ = 'DNQ';

class ResultsHtmlParser {
  boats: Boat[] = [];
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
   * Parse the <colgroup> of a results table.
   *
   * @param parent The <colgroup> node.
   * @returns The parsed columns.
   */
  parseColGroup(parent: HTMLElement): void {
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

  parseRaceScore(element: HTMLElement): Result {
    const html = element.innerHTML;
    if (html === '&nbsp;') {
      return { element, html, isNotSailed: true } as NotSailedResult;
    }
    const { isCts, isDiscard, score, code } = parseRaceScore(html);
    return {
      element,
      html,
      isCts,
      isDiscard,
      score,
      code,
    } as SailedResult;
  }

  /**
   * Parse a boat's summary row in a results table.
   *
   * @param parent The <tr> node.
   * @returns The parsed columns.
   */
  parseSummaryRow(parent: HTMLElement): Boat {
    const boat: Boat = {
      rank: NaN,
      net: NaN,
      total: NaN,
      results: [],
      // elements {},
    };
    boat.elements = { boat: parent };

    // Column index.
    let colIndex = 0;

    for (const node of parent.children) {
      // Skip any unexpected nodes.
      if (node.nodeName !== 'TD') continue;

      const column = this.columns[colIndex];
      ++colIndex;
      switch (column.type) {
        case 'rank':
          boat.elements.rank = node;
          boat.rank = parseRank(node.textContent);
          if (boat.rank !== DNQ) {
            ++this.qualifiedCount;
          }
          break;
        case 'total':
          boat.elements.total = node;
          boat.total = parseValue(node.textContent);
          break;
        case 'nett':
          boat.elements.net = node;
          boat.net = parseValue(node.textContent);
          break;
        case 'race':
          boat.results[column.index] = this.parseRaceScore(node as HTMLElement);
        // Ignore labels for now.
        // case 'label':
      }
    }
    return boat;
  }

  /**
   * Parse a boat's summary row in a results table.
   *
   * @param parent The <tr> node.
   * @returns The parsed columns.
   */
  parseSummaryRows(parent: HTMLElement): void {
    for (const node of parent.children) {
      // Skip any unexpected nodes.
      if (node.nodeName !== 'TR' || !node.classList.contains('summaryrow')) {
        continue;
      }

      this.boats.push(this.parseSummaryRow(node as HTMLElement));
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
 * Extract results for each boat from a summary results table.
 *
 * @param element the <table> element.
 * @returns the results.
 */
export const parseResultsTable = (element: Element): ResultsHtmlParser => {
  return new ResultsHtmlParser().parse(element);
};

/**
 * Convert a (possibly null) string to a numerical score x 10.
 *
 * @param text the displayed score.
 * @returns the score x 10.
 */
export const parseValue = (text: string | null): number => {
  if (text === null) return 0;
  return Math.round(parseFloat(text) * 10);
};

/**
 *
 * @param result
 */
export const formatSailedResult = ({
  code,
  isDiscard,
  score,
}: SailedResult) => {
  // Sailwave Effects import breaks on template strings so don't use them.
  // const text = code ? `${formatScore(score)} ${code}` : formatScore(score);
  // return isDiscard ? `(${text})` : text;
  const text = code ? formatScore(score) + ' ' + code : formatScore(score);
  return isDiscard ? '(' + text + ')' : text;
};

export const formatScore = (score: number) => (score / 10).toFixed(1);
