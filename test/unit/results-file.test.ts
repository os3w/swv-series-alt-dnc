import { expect } from 'chai';

import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

import { parseResultsHtml } from '../../src/html';
import {
  checkIsSailedResult,
  SailedResult,
  cameToStartingArea,
} from '../../src/scored-group/result';

const content = readFileSync(
  './examples/results-v2-groups-all-races.html',
  'utf8',
);
const { document } = new JSDOM(content).window;
const results = parseResultsHtml(document);

describe('Results file functions', function () {
  describe('Group results parsing', function () {
    it('should calculate number qualifed in a group', function () {
      const handicapGroup = results.groups[3];
      expect(handicapGroup.id).to.equal('handicap');
      expect(handicapGroup.qualifiedCount).to.equal(4);
      const allInGroup = results.groups[0];
      expect(allInGroup.id).to.equal('all_in_handicap');
      expect(allInGroup.qualifiedCount).to.equal(15);
    });
  });

  describe('Single result parsing', function () {
    it('should parse an ordinary result', function () {
      const group = results.groups[3];
      expect(group.id).to.equal('handicap');

      const result = checkIsSailedResult(
        group.competitors[0].results[3],
      ) as SailedResult;
      expect(cameToStartingArea(result.code)).to.be.true;
      expect(result.score).to.equal(1);
      expect(result.code).to.be.null;
      expect(result.isDiscard).to.be.false;
    });

    it('should parse an OOD result', function () {
      const group = results.groups[2];
      expect(group.id).to.equal('enterprise');

      const result = group.competitors[0].results[0] as SailedResult;
      expect(cameToStartingArea(result.code)).to.be.false;
      expect(result.score).to.equal(1.3);
      expect(result.code).to.equal('OOD');
      expect(result.isDiscard).to.be.false;
    });

    it('should parse a DNF', function () {
      const group = results.groups[0];
      expect(group.id).to.equal('all_in_handicap');

      const result = group.competitors[4].results[7] as SailedResult;
      expect(cameToStartingArea(result.code)).to.be.true;
      expect(result.score).to.equal(12);
      expect(result.code).to.equal('DNF');
      expect(result.isDiscard).to.be.false;
    });

    it('should parse a discarded DNF', function () {
      const group = results.groups[3];
      expect(group.id).to.equal('handicap');

      const result = group.competitors[1].results[7] as SailedResult;
      expect(cameToStartingArea(result.code)).to.be.true;
      expect(result.score).to.equal(4);
      expect(result.code).to.equal('DNF');
      expect(result.isDiscard).to.be.true;
    });
  });
});
