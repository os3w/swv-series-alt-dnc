import { parseGroup } from './group';

import type { Group } from '../scored-group/group';

class Parser {
  parse(doc: Document) {
    const groupTitleElements = doc.querySelectorAll('.summarytitle');
    const groups: Group[] = [];
    groupTitleElements.forEach((el) => {
      const group = parseGroup(el);
      if (group) {
        groups.push(group);
      }
    });
    return {
      groups,
    };
  }
}

/**
 * Parse a results document.
 *
 * @param doc The DOM tree to parse.
 * @returns A parsed tree.
 */
export const parseResultsHtml = (doc: Document) => {
  return new Parser().parse(doc);
};
