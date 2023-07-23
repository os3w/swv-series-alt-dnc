import { version } from './version';
import { parseResultsHtml, rescoreQualifiers } from '.';
import { recalculateGroup, renderGroup } from './scored-group/group';

const addCaption = () => {
  const $title = document.querySelector('.seriestitle');
  const caption = document.createElement('div');
  caption.innerHTML =
    'DNC scores are provisional based on the number of qualifiers.' +
    '<br><small>Rescored by Count Only Qualifying Races effect v' +
    version +
    '</small>';
  $title?.insertAdjacentElement('afterend', caption);
};

document.addEventListener('DOMContentLoaded', () => {
  const results = parseResultsHtml(document);
  for (const group of results.groups) {
    rescoreQualifiers(group);
    recalculateGroup(group);
    renderGroup(group);
  }
  addCaption();
});
