import { expect } from 'chai';

import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

import { parseResultsHtml } from '../../src/results-file';
import { BoatSailedResult } from '../../src/group/boat';

import {
  rescoreDncBasedOnQualifiers,
  calculateDiscards,
} from '../../src/score';

const content = readFileSync(
  './examples/results-v2-groups-all-races.html',
  'utf8',
);
const { document } = new JSDOM(content).window;
const results = parseResultsHtml(document);

describe('Rescoring', function () {
  it('should rescore races for the handicap group', function () {
    const group = results.groups[3];
    expect(group.id).to.equal('handicap');

    const result = group.boats[0].races[2] as BoatSailedResult;
    expect(result.score).to.equal(70);

    rescoreDncBasedOnQualifiers(group);
    expect(result.score).to.equal(50);
  });

  it('should rescore races for the all-in group', function () {
    const group = results.groups[0];
    expect(group.id).to.equal('all_in_handicap');

    const result = group.boats[0].races[0] as BoatSailedResult;
    expect(result.score).to.equal(290);

    rescoreDncBasedOnQualifiers(group);
    expect(result.score).to.equal(160);
  });

  describe('Calculating discards', function () {
    it('should calculate discards correctly', function () {
      const scores = [160, 10, 10, 50, 20, 10, 10, 80, 50, 10];
      const discards = calculateDiscards(scores, 4);
      expect(discards).to.eql([0, 7, 3, 8]);
    });
  });
});
