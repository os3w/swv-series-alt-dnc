import { parseScoredGroup, ScoredGroup } from './scored-group/scored-group';

class Parser {
  parse(doc: Document) {
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
  }
}

export const parseResultsHtml = (doc: Document) => {
  return new Parser().parse(doc);
};
