import { version } from './version';
import { parseResultsHtml, rescoreDncBasedOnQualifiers } from '.';

document.addEventListener('DOMContentLoaded', () => {
  const results = parseResultsHtml(document);
  for (const group of results.groups) {
    rescoreDncBasedOnQualifiers(group);
    group.recalculate();
    group.render();
  }
  addProvisionalCaption();
});

const addProvisionalCaption = () => {
  const $title =  document .querySelector('.seriestitle');
  if ($title) {
    $title?.textContent += 'DNC scores are provisional based on number of qualifiers';
  }
  const caption = document.createElement('div');
  caption.textContent =
    'calculated by Alt DNC v' +
    version;
  $title?.insertAdjacentElement('afterend', caption);
};
