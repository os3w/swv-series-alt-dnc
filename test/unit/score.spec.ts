import { expect } from 'chai';

import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

import { parseResultsHtml } from '../../src/results-file';
import { rescoreDncExcludingDnq } from '../../src/score';
import { BoatSailedResult } from '../../src/group/boat';

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

    rescoreDncExcludingDnq(group);
    expect(result.score).to.equal(50);
  });

  it('should rescore races for the all-in group', function () {
    const group = results.groups[0];
    expect(group.id).to.equal('all_in_handicap');

    const result = group.boats[0].races[0] as BoatSailedResult;
    expect(result.score).to.equal(290);

    rescoreDncExcludingDnq(group);
    expect(result.score).to.equal(160);
  });
});
