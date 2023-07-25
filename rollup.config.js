import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'node:fs';
import camelCase from 'camelcase';
import json from '@rollup/plugin-json';

const pkg = JSON.parse(readFileSync('package.json'));

// Human timestamp for banner.
const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
const year = datetime.slice(0, 4);

// Remove npm namespace from the package name.
const pkgName = pkg.name.replace(/@.*\//, '');
const name = camelCase(pkgName, { pascalCase: true });

const license =
  pkg.license === 'UNLICENSED'
    ? 'All rights reserved'
    : `${pkg.license} license`;

// Main banner.
const banner = `/*!
 * ${name} v${pkg.version} ${datetime}
 * ${pkg.homepage}
 * Copyright (C) ${year} ${pkg.author}.
 * ${license}.
 */
`;

// Target ECMAScript version (es2017 is good for all modern browsers in 2023).
const target = 'es2017';

const builds = [
  {
    input: './src/index.ts',
    output: {
      name,
      file: 'index.min.js',
      format: 'iife',
      banner,
      sourcemap: true,
    },
    plugins: [
      json(),

      typescript({
        compilerOptions: {
          target,
        },
      }),

      terser({ output: { comments: /^!/, max_line_len: 999 } }),
    ],
  },
  {
    input: './src/index.ts',
    output: [
      {
        file: './index.js',
        format: 'esm',
        banner,
        sourcemap: true,
      },
      {
        file: './index.cjs',
        format: 'commonjs',
        banner,
        sourcemap: true,
      },
    ],
    plugins: [
      json(),

      typescript({
        compilerOptions: {
          target,
        },
      }),
    ],
  },
];

const warning = ` * Note that this effect only modifies the results that are DISPLAYED when a
 * results file is viewed in a browser with JavaScript enabled; the results
 * stored in the html file are unchanged. For more information see
 * https://github.com/os3w/swv-series-alt-dnc#result-modifying-effects.`;

const sailwaveEffectBuilds = [
  {
    input: './src/effect/count-only-qualifiers.ts',
    file: './dist/CountOnlyQualifiers.js',
    banner: `/*!
 * name=Count Only Qualifiers
 * dependencies=
 * author=${pkg.author}
 * version=${pkg.version}
 * date=${datetime.slice(0, 10)}
 * url=${pkg.homepage}
 * 
 * Rescore DNC results based on the number of competitors qualifying according
 * to the amendments to the Racing Rules of Sailing described at
 * ${pkg.homepage}#count-only-qualifiers
 *
${warning}
 */
${banner}
`,
  },
  {
    input: './src/effect/count-only-qualifying-races.ts',
    file: './dist/CountOnlyQualifyingRaces.js',
    banner: `/*!
 * name=Count Only Qualifying Races
 * dependencies=
 *
 * author=${pkg.author}
 * version=${pkg.version}
 * date=${datetime.slice(0, 10)}
 * url=${pkg.homepage}
 *
 * Exclude races and rescore DNC results based on the number of competitors
 * qualifying according to the amendments to the Racing Rules of Sailing
 * described at ${pkg.homepage}#count-only-qualifying-races.
 *
${warning}
 */
${banner}
`,
  },
];

for (const { input, file, banner } of sailwaveEffectBuilds) {
  builds.push({
    input,
    output: { file, format: 'iife', banner },
    plugins: [
      json(),
      typescript({ compilerOptions: { target } }),
      terser({ output: { comments: /^!/, max_line_len: 999 } }),
    ],
  });
}

export default builds;
