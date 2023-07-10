import {
  Boat,
  BoatNotSailedResult,
  BoatResult,
  BoatSailedResult,
} from './boat';
import { Column } from './column';
import { Race } from './race';
import { cameToStartingArea } from './result-codes';

export class Results {
  /** The boats entered in this group. */
  boats: Boat[];
  /** The columns of the results table. */
  columns: Column[];
  /** Races for this group (may not all be sailed). */
  races: Race[];

  constructor(partial: Partial<Results>) {
    this.columns = partial.columns ?? [];
    this.boats = partial.boats ?? [];
    this.races = partial.races ?? [];
  }
}

class ResultsParser implements Partial<Results> {
  boats: Boat[] = [];
  columns: Column[] = [];
  races: Race[] = [];

  parse(tableElement: Element): Partial<Results> {
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
          this.columns.push({ type: className, index: this.races.length });
          this.races.push({});
          break;
        default:
          this.columns.push({ type: 'label', name: className });
          break;
      }
    }
  }

  parseRaceScore(element: HTMLElement): BoatResult {
    const html = element.innerHTML;
    if (html === '&nbsp;') {
      return { element, html, isNotSailed: true } as BoatNotSailedResult;
    }
    const { isCts, isDiscard, score, code } = parseRaceScore(html);
    return {
      element,
      html,
      isCts,
      isDiscard,
      score,
      code,
    } as BoatSailedResult;
  }

  /**
   * Parse a boat's summary row in a results table.
   *
   * @param parent The <tr> node.
   * @returns The parsed columns.
   */
  parseSummaryRow(parent: HTMLElement) {
    const boat: Partial<Boat> = {};
    boat.elements = {};
    boat.races = [];

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
          boat.races[column.index] = this.parseRaceScore(node as HTMLElement);
        // Ignore labels for now.
        // case 'label':
      }
    }
    return new Boat(boat);
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

export const parseRank = (text: string | null): number | 'DNQ' => {
  if (text === null) return 'DNQ';
  if (text === 'DNQ') return text;
  return parseInt(text);
};

export const parseResultsTable = (element: Element) => {
  const partial = new ResultsParser().parse(element);
  return new Results(partial);
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

export const parseValue = (text: string | null): number => {
  if (text === null) return 0;
  return Math.round(parseFloat(text) * 10);
};
