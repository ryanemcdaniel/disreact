import {defineConfig} from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['esnext'],
      dts   : true,
      source: {
        entry: {
          index: ['src/index.ts'],
        },
        tsconfigPath: 'tsconfig.build.json'
      }
    },
    {
      format: 'cjs',
      syntax: ['esnext'],
      source: {
        entry: {
          index: ['src/index.ts'],
        },
      }
    },
  ]
});
