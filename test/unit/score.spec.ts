import { expect } from 'chai';

import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

import { parseResultsHtml } from '../../src/html';
import { getSailedResult, SailedResult } from '../../src/scored-group/result';

import { rescoreQualifiers } from '../../src/score';

import { getDiscardIndexes } from '../../src/scored-group/score';

const content = readFileSync(
  './examples/results-v2-groups-all-races.html',
  'utf8',
);
const { document } = new JSDOM(content).window;
const results = parseResultsHtml(document);

describe('Rescoring', function () {
  it('should rescore individual races for the handicap group', function () {
    const group = results.groups[3];
    expect(group.id).to.equal('handicap');

    const result = getSailedResult(
      group.competitors[0].results[2],
    ) as SailedResult;
    expect(result.score).to.equal(70);

    rescoreQualifiers(group);
    expect(result.score).to.equal(50);
  });

  it('should rescore individual races for the all-in group', function () {
    const group = results.groups[0];
    expect(group.id).to.equal('all_in_handicap');

    const result = getSailedResult(
      group.competitors[0].results[0],
    ) as SailedResult;
    expect(result.score).to.equal(290);

    rescoreQualifiers(group);
    expect(result.score).to.equal(160);
  });

  describe('Calculating discards', function () {
    it('should calculate discards correctly', function () {
      const scores = [160, 10, 10, 50, 20, 10, 10, 80, 50, 10];
      const discards = getDiscardIndexes(scores, 4);
      expect(discards).to.eql([0, 7, 3, 8]);
    });
  });
});
