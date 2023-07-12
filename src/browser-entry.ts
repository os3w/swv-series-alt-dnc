import { parseResultsHtml, rescoreDncBasedOnQualifiers } from '.';

document.addEventListener('DOMContentLoaded', () => {
  const results = parseResultsHtml(document);
  for (const group of results.groups) {
    rescoreDncBasedOnQualifiers(group);
    group.recalculate();
    group.render();
  }
});
