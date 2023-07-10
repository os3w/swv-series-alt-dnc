import { parseResultsHtml } from '.';

document.addEventListener('DOMContentLoaded', () => {
  const results = parseResultsHtml(document);
  console.log(results);
});
