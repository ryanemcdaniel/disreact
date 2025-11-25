import {expect, it} from '@effect/vitest';
import * as Effect from 'effect/Effect';
import {toJson} from './util.js';
import * as DisReactTemplater from '../../src/DisReactTemplater.js';
import {StaticMessageInlineJsx, StaticModalInlineJsx} from './util-components.js';

const layer = DisReactTemplater.layer();

it.effect('when transforming message', Effect.fn(function* () {
  const templater = yield* DisReactTemplater.DisReactTemplater;
  const actual = yield* templater.transform(StaticMessageInlineJsx);

  expect(toJson(actual)).toMatchInlineSnapshot(`
    "{
      "type": "message",
      "data": {
        "flags": 0
      }
    }"
  `);
}, Effect.provide(layer)));

it.effect('when transforming modal', Effect.fn(function* () {
  const templater = yield* DisReactTemplater.DisReactTemplater;
  const actual = yield* templater.transform(StaticModalInlineJsx);

  expect(toJson(actual)).toMatchInlineSnapshot(`
    "{
      "type": "modal",
      "data": {
        "title": "Hello World!",
        "components": [
          {
            "title": "Hello World!",
            "components": [
              {
                "id": 0,
                "type": 18,
                "label": "Selector 1",
                "component": {
                  "id": 0,
                  "type": 3,
                  "placeholder": "Select String",
                  "min_values": 1,
                  "max_values": 1,
                  "required": false
                }
              },
              {
                "id": 0,
                "type": 18,
                "label": "Selector 2",
                "component": {
                  "id": 0,
                  "type": 6,
                  "placeholder": "Select Role",
                  "min_values": 1,
                  "max_values": 1,
                  "required": false
                }
              }
            ]
          }
        ]
      }
    }"
  `);
}, Effect.provide(layer)));
