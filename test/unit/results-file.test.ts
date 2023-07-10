import { expect } from 'chai';

import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

import { parseResultsHtml } from '../../src/results-file';

const content = readFileSync('./downloads/results-v2.html', 'utf8');

describe('Results file functions', function () {
  it('should parse a file', function () {
    const { document } = new JSDOM(content).window;
    const results = parseResultsHtml(document);
    expect(results).to.eql([]);
  });
});
