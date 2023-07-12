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
const target = 'es5';

export default [
  {
    input: './src/browser-entry.ts',
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

      terser({ output: { comments: /^!/, max_line_len: 999 }}),
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
