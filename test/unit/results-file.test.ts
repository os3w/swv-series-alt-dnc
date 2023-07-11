import { expect } from 'chai';

import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

import { parseResultsHtml } from '../../src/results-file';
import { BoatSailedResult } from '../../src/group/boat';

const content = readFileSync(
  './examples/results-v2-groups-all-races.html',
  'utf8',
);
const { document } = new JSDOM(content).window;
const results = parseResultsHtml(document);

describe('Results file functions', function () {
  it('should parse an ordinary result', function () {
    const group = results.groups[3];
    expect(group.id).to.equal('handicap');

    const result = group.boats[0].races[3] as BoatSailedResult;
    expect(result).not.to.have.property('isNotSailed');
    expect(result.isCts).to.be.true;
    expect(result.score).to.equal(10);
    expect(result.code).to.be.null;
    expect(result.isDiscard).to.be.false;
  });

  it('should parse an OOD result', function () {
    const group = results.groups[2];
    expect(group.id).to.equal('enterprise');

    const result = group.boats[0].races[0] as BoatSailedResult;
    expect(result).not.to.have.property('isNotSailed');
    expect(result.isCts).to.be.false;
    expect(result.score).to.equal(13);
    expect(result.code).to.equal('OOD');
    expect(result.isDiscard).to.be.false;
  });

  it('should parse a DNF', function () {
    const group = results.groups[0];
    expect(group.id).to.equal('all_in_handicap');

    const result = group.boats[4].races[7] as BoatSailedResult;
    expect(result).not.to.have.property('isNotSailed');
    expect(result.isCts).to.be.true;
    expect(result.score).to.equal(120);
    expect(result.code).to.equal('DNF');
    expect(result.isDiscard).to.be.false;
  });

  it('should parse a discarded DNF', function () {
    const group = results.groups[3];
    expect(group.id).to.equal('handicap');

    const result = group.boats[1].races[7] as BoatSailedResult;
    expect(result).not.to.have.property('isNotSailed');
    expect(result.isCts).to.be.true;
    expect(result.score).to.equal(40);
    expect(result.code).to.equal('DNF');
    expect(result.isDiscard).to.be.true;
  });
});
