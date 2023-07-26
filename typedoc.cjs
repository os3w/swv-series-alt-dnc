module.exports = {
  entryPoints: [
    'src/index.ts',
    'src/effect/count-only-qualifiers.ts',
    'src/effect/count-only-qualifying-races.ts',
  ],
  // entryPointStrategy: 'expand',
  includeVersion: true,
  readme: 'README.api.md',
  // hideParameterTypesInTitle: false,
  excludePrivate: true,
  excludeProtected: true,
  visibilityFilters: {
    // protected: false,
    // private: false,
    // inherited: false,
    // external: false,
    // '@alpha': false,
    // '@beta': false,
  },
};
