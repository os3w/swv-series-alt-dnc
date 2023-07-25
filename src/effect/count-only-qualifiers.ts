/**
 * This is the entry point for the CountOnlyQualifiers effect.
 *
 * There are no exports, this module only has the side-effect of modifying the
 * DOM to reflect rescoring according to the changes to the rules described
 * at [blah](../blah).
 *
 * @module effect/count-only-qualifiers
 */
import { version, parseResultsHtml, recalculateGroup, renderGroup } from '..';

import { rescoreQualifiers } from './alternative-dnc';

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
