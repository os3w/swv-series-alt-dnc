import { version, parseResultsHtml, recalculateGroup, renderGroup } from '..';

import { rescoreQualifyingRaces } from './alternative-dnc';

const addCaption = () => {
  const $title = document.querySelector('.seriestitle');
  const caption = document.createElement('div');
  caption.innerHTML =
    'DNC scores and races sailed are provisional based on the number of qualifiers.' +
    '<br><small>Rescored by Count Only Qualifying Races effect v' +
    version +
    '</small>';
  $title?.insertAdjacentElement('afterend', caption);
};

document.addEventListener('DOMContentLoaded', () => {
  const results = parseResultsHtml(document);
  for (const group of results.groups) {
    rescoreQualifyingRaces(group);
    recalculateGroup(group);
    renderGroup(group);
  }
  addCaption();
});
