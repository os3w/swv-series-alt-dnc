import { ScoredGroup } from './scored-group/scored-group';
import { Boat } from './scored-group/boat';
import type { Column } from './scored-group/column';

const parseValue = (text: string | null): number => {
  if (text === null) return 0;
  return Math.round(parseFloat(text) * 10);
};

const parseRank = (text: string | null): number | 'DNQ' => {
  if (text === null) return 'DNQ';
  if (text === 'DNQ') return text;
  return parseInt(text);
};

/**
 * Parse the <colgroup> of a results table.
 *
 * @param parent The <colgroup> node.
 * @returns The parsed columns.
 */
const parseColGroup = (parent: HTMLElement): Column[] => {
  const columns: Column[] = [];
  // Race index.
  let index = 0;

  for (const node of parent.children) {
    // Skip any unexpected nodes.
    if (node.nodeName !== 'COL') continue;

    const { className } = node;
    switch (className) {
      case 'rank':
      case 'total':
      case 'nett':
        columns.push({ type: className });
        break;
      case 'race':
        columns.push({ type: className, index });
        ++index;
        break;
      default:
        columns.push({ type: 'label', name: className });
        break;
    }
  }
  return columns;
};

/**
 * Parse a boat's summary row in a results table.
 *
 * @param parent The <tr> node.
 * @returns The parsed columns.
 */
const parseSummaryRow = (parent: HTMLElement, columns: Column[]) => {
  const boat: Partial<Boat> = {};
  boat.elements = {};
  boat.races = [];

  // Column index.
  let colIndex = 0;

  for (const node of parent.children) {
    // Skip any unexpected nodes.
    if (node.nodeName !== 'TD') continue;

    const column = columns[colIndex];
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
        boat.races[column.index] = parseRaceScore(node as HTMLElement);
      // Ignore labels for now.
      // case 'label':
    }
  }
  return new Boat(boat);
};

const parseRaceScore = (
  element: HTMLElement,
  // columns: Column[],
) => {
  const html = element.innerHTML;
  const isDiscard = html.charAt(0) === '(';
  if (html === '&nbsp;') {
    return { element, html, isNotSailed: true };
  }
  return {
    element,
    html,
    isDiscard,
    score: parseValue(isDiscard ? html.slice(1) : html),
  };
};

/**
 * Parse a boat's summary row in a results table.
 *
 * @param parent The <tr> node.
 * @returns The parsed columns.
 */
const parseSummaryRows = (parent: HTMLElement, columns: Column[]) => {
  const boats = [];
  for (const node of parent.children) {
    // Skip any unexpected nodes.
    if (node.nodeName !== 'TR' || !node.classList.contains('summaryrow'))
      continue;

    boats.push(parseSummaryRow(node as HTMLElement, columns));
  }
  return boats;
};

const parseTable = (tableElement: Element) => {
  let columns: Column[] = [];
  let boats;

  for (const node of tableElement.children) {
    switch (node.nodeName) {
      case 'COLGROUP':
        columns = parseColGroup(node as HTMLElement);
        break;
      // case 'THEAD':
      // Don't bother looking at the headings.
      // break;
      case 'TBODY':
        boats = parseSummaryRows(node as HTMLElement, columns);
        break;
    }
  }
  return { columns, boats };
};

const parseScoredGroup = (titleElement: Element): ScoredGroup | false => {
  const partialGroup: Partial<ScoredGroup> = {
    // Remove 'summary' from the beginning of the id.
    id: titleElement.id.slice(7),
    title: titleElement.textContent ?? undefined,
  };

  let el: Element | null = titleElement;
  do {
    el = el.nextElementSibling;
    if (!el) break;
    if (el.classList.contains('summarycaption')) {
      partialGroup.caption = el.textContent ?? '';
    } else if (el.classList.contains('summarytable')) {
      partialGroup.table = parseTable(el);
    }
  } while (el && !el.classList.contains('summarytitle'));

  return new ScoredGroup(partialGroup);
};

export const parseResultsHtml = (doc: Document) => {
  const scoredGroupTitleElements = doc.querySelectorAll('.summarytitle');
  const scoredGroups: ScoredGroup[] = [];
  scoredGroupTitleElements.forEach((el) => {
    const group = parseScoredGroup(el);
    if (group) {
      scoredGroups.push(group);
    }
  });
  return {
    scoredGroups,
  };
};
