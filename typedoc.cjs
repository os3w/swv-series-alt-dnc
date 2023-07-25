module.exports = {
  entryPoints: [
    // 'src',
    'src/index.ts',
    'src/effect/count-only-qualifiers.ts',
    'src/effect/count-only-qualifying-races.ts',
    // 'src/html/index.ts',
  ],
  entryPointStrategy: 'expand',
  includeVersion: true,
  excludePrivate: true,
  excludeProtected: true,
  readme: 'README.api.md',
  // hideParameterTypesInTitle: false,
};
