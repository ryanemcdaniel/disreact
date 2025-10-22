import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'integration',
          include: ['test/integration/**/*.spec.(ts|tsx)'],
        }
      },
      {
        test: {
          name: 'unit',
          include: ['test/unit/**/*.spec.(ts|tsx)'],
        }
      }
    ],
  },
})
