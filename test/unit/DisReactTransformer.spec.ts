import * as DisReactTransformer from '../../src/DisReactTransformer.js';
import {it, expect} from '@effect/vitest';
import * as Model from '../../src/core/Model.js';
import * as Effect from 'effect/Effect';
import {toJson} from './util.js';
import {StaticMessageInlineJsx, StaticModalInlineJsx} from './util-components.js';

const layer = DisReactTransformer.layer();

it.effect('when transforming message', Effect.fn(function* () {
  const transformer = yield* DisReactTransformer.DisReactTransformer;
  const model = yield* Model.make(StaticMessageInlineJsx);
  const actual = yield* transformer.transform(model);

  expect(toJson(actual)).toMatchInlineSnapshot(`
    "{
      "type": "message",
      "data": {
        "flags": 0
      },
      "hydrant": {
        "props": {},
        "state": {}
      }
    }"
  `);
}, Effect.provide(layer)));

it.effect('when transforming modal', Effect.fn(function* () {
  const transformer = yield* DisReactTransformer.DisReactTransformer;
  const model = yield* Model.make(StaticModalInlineJsx);
  const actual = yield* transformer.transform(model);

  expect(toJson(actual)).toMatchInlineSnapshot(`
    "{
      "type": "modal",
      "data": {
        "title": "Hello World!",
        "components": [
          {
            "title": "Hello World!",
            "components": []
          }
        ]
      },
      "hydrant": {
        "props": {
          "title": "Hello World!"
        },
        "state": {}
      }
    }"
  `);
}, Effect.provide(layer)));
