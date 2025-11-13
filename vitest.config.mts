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
      ignoreEmptyLines: true,
      thresholds: {
        autoUpdate: true,
        lines: 28.84,
        branches: 32.96,
        functions: 29.26,
        statements: 27.96,
      }
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