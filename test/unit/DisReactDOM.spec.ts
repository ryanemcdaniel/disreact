import * as DisReactDOM from '../../src/DisReactDOM.js';
import {it, expect} from '@effect/vitest';
import * as Effect from 'effect/Effect';
import * as DisReactTransformer from '../../src/DisReactTransformer.js';
import * as Layer from 'effect/Layer';
import {pipe} from 'effect/Function';
import {StaticMessageJsx} from './util-components.js';
import * as Model from '../../src/core/Model.js';
import {toJson} from './util.js';

const layer = pipe(
  DisReactDOM.live,
  Layer.provide(DisReactTransformer.layer()),
);

it.effect('when mounting', Effect.fn(function* () {
  const dom    = yield* DisReactDOM.DisReactDOM;
  const doc    = yield* dom.mount(StaticMessageJsx);
  const actual = yield* dom.transform(doc);

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

it.effect('when unmounting', Effect.fn(function* () {
  const dom = yield* DisReactDOM.DisReactDOM;
  const doc = yield* dom.mount(StaticMessageJsx);
  yield* dom.unmount(doc);
  const actual = yield* dom.transform(doc);

  expect(toJson(actual)).toMatchInlineSnapshot(`
    "{
      "type": "",
      "data": {},
      "hydrant": {
        "props": {},
        "state": {}
      }
    }"
  `);
}, Effect.provide(layer)));

it.effect('when dispatching event', Effect.fn(function* () {
  const dom = yield* DisReactDOM.DisReactDOM;
  const doc = yield* dom.mount(StaticMessageJsx);
  yield* dom.dispatch(doc, Model.eventOnClick());
  const actual = yield* dom.transform(doc);

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
