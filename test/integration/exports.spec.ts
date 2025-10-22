import {expect, it} from 'vitest';
import * as lib from '../../dist/index.js';

it('has export shape', () => {
  expect(lib).toMatchInlineSnapshot(`
    {
      "HelloWorld": "Hello World!",
      "default": {
        "HelloWorld": "Hello World!",
      },
    }
  `);
});
