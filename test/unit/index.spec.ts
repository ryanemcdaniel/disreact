import {expect, it} from 'vitest';
import {HelloWorld} from '../../src/index.js';

it('hello world', () => {
  expect(HelloWorld).toMatchInlineSnapshot(`"Hello World!"`);
});
