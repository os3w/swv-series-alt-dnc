import { expect } from 'chai';

import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

import { parseResultsHtml } from '../../src/results-file';

const content = readFileSync(
  './downloads/results-v2-groups-all-races.html',
  'utf8',
);

describe('Results file functions', function () {
  it('should parse a file', function () {
    const { document } = new JSDOM(content).window;
    const results = parseResultsHtml(document);
    console.log(results.scoredGroups[5].table);
    expect(results).to.eql([]);
  });
});
