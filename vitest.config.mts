import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/jsx-runtime.tsx', 'src/jsx-dev-runtime.tsx'],
      reportOnFailure: true,
      cleanOnRerun: true,
      experimentalAstAwareRemapping: true,
      ignoreEmptyLines: true
    },
    snapshotFormat: {
      compareKeys: null,
    },
    projects: [
      {
        test: {
          name   : 'dev',
          include: ['./test/dev/**/*.spec.(ts|tsx)'],
        },
      },
      {
        test: {
          name   : 'integration',
          include: ['./test/integration/**/*.spec.(ts|tsx)'],
        },
        esbuild: {
          jsxDev: false,
        },
      },
      {
        test: {
          name   : 'unit',
          include: ['./test/unit/**/*.spec.(ts|tsx)'],
        },
      },
    ],
  },
});
