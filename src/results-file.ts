type GroupResultsTable = string[];

interface ScoredGroup {
  caption: string;
  table: GroupResultsTable;
  id: string;
  title: string;
}

const parseTable = (tableElement: Element) => {
  const names: string[] = [];
  for (const node of tableElement.childNodes) {
    switch (node.nodeName) {
      case 'COLGROUP':
      case 'THEAD':
      case 'TBODY':
        names.push(node.nodeName);
        break;
    }
  }
  return names;
};

const parseScoredGroup = (titleElement: Element): ScoredGroup | false => {
  const group: ScoredGroup = {
    // Remove 'summary' from the beginning of the id.
    id: titleElement.id.slice(7),
    title: titleElement.textContent ?? '',
    caption: '',
    table: [],
  };

  let el: Element | null = titleElement;
  do {
    el = el.nextElementSibling;
    if (!el) break;
    if (el.classList.contains('summarycaption')) {
      group.caption = el.textContent ?? '';
    } else if (el.classList.contains('summarytable')) {
      group.table = parseTable(el);
    }
  } while (el && !el.classList.contains('summarytitle'));

  return group;
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
  console.log(scoredGroups);
  return {
    scoredGroups,
  };
};
