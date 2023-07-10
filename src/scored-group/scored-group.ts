import { parseResultsTable } from './results';
import { Results } from './results';

export class ScoredGroup {
  caption: string;
  results: Results;
  id: string | null;
  title: string;

  constructor(partial: Partial<ScoredGroup>) {
    this.id = partial.id ?? null;
    this.caption = partial.caption ?? '';
    this.results =
      partial.results ?? ({ columns: [], boats: [], races: [] } as Results);
    this.title = partial.title ?? '';
  }
}

export const parseScoredGroup = (titleElement: Element): ScoredGroup => {
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
      partialGroup.results = parseResultsTable(el);
    }
  } while (el && !el.classList.contains('summarytitle'));

  return new ScoredGroup(partialGroup);
};
