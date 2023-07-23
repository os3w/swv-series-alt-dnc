import { parseGroup, Group } from '../scored-group';

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

export const parseResultsHtml = (doc: Document) => {
  return new Parser().parse(doc);
};
