/**
 * This is the entry point for the CountOnlyQualifyingRaces effect.
 *
 * There are no exports, this module only has the side-effect of modifying the
 * DOM to reflect rescoring according to the changes to the rules described
 * at [blah](../blah).
 * @module
 */
import { version, parseResultsHtml, scoreGroup, renderGroup } from '..';

import { rescoreQualifyingRaces } from './scoring';

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
    scoreGroup(group);
    renderGroup(group);
  }
  addCaption();
});
