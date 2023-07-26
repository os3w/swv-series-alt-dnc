import { parseGroup } from './group';

import type { Group } from '../results';

export interface ParsedResults {
  groups: Group[];
}

export class ResultsHtmlParser {
  parse(doc: Document) {
    const parsed: ParsedResults = {
      groups: [],
    };
    const groupTitleElements = doc.querySelectorAll('.summarytitle');

    groupTitleElements.forEach((el) => {
      const group = parseGroup(el);
      if (group) {
        parsed.groups.push(group);
      }
    });
    return parsed;
  }
}

/**
 * Parse a results document.
 *
 * @param doc The DOM tree to parse.
 * @returns A parsed tree.
 */
export const parseResultsHtml = (doc: Document) => {
  return new ResultsHtmlParser().parse(doc);
};
