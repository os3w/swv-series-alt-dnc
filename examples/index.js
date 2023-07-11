
import { readFile, writeFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

import { parseResultsHtml } from '../index.js';

const content = await readFile(
  './examples/results-v2-groups-all-races.html',
  'utf8',
);
const { document } = new JSDOM(content).window;
const results = parseResultsHtml(document);

const json = JSON.stringify(results, null, 2);

await writeFile('./examples/parsed.json', json);
