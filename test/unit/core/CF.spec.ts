import {describe, expect, it} from '@effect/vitest';
import * as Effect from 'effect/Effect';
import * as CF from '../../../src/core/CF.js';

const sfc = (props: any) => props;
const afc = async (props: any) => props;
const efc = (props: any) => Effect.succeed(props);

describe('given sync function', () => {
  it('when binding', () => {
    const bound = CF.bind(sfc);

    expect(bound).toEqual(sfc);
    expect(JSON.stringify(bound, null, 2)).toMatchInlineSnapshot(`
      "{
        "_id": "CF",
        "name": "sfc"
      }"
    `);
  });

  it.effect('when rendering', Effect.fn(function* () {
    const bound  = CF.bind(sfc);
    const actual = yield* CF.call(bound, {prop: 'prop'});

    expect(actual).toMatchInlineSnapshot(`
      {
        "prop": "prop",
      }
    `);
    expect(bound._tag).toMatchInlineSnapshot(`"s"`);
  }));

  it.effect('when rendering again', Effect.fn(function* () {
    const bound  = CF.bind(sfc);
    const actual = yield* CF.call(bound, {prop: 'prop'});

    expect(actual).toMatchInlineSnapshot(`
      {
        "prop": "prop",
      }
    `);
    expect(bound._tag).toMatchInlineSnapshot(`"s"`);
  }));
});

describe('given async function', () => {
  it('when binding', () => {
    const bound = CF.bind(afc);

    expect(bound).toEqual(afc);
    expect(JSON.stringify(bound, null, 2)).toMatchInlineSnapshot(`
      "{
        "_id": "CF",
        "_tag": "a",
        "name": "afc"
      }"
    `);
  });

  it.effect('when rendering', Effect.fn(function* () {
    const bound  = CF.bind(afc);
    const actual = yield* CF.call(bound, {prop: 'prop'});

    expect(actual).toMatchInlineSnapshot(`
      {
        "prop": "prop",
      }
    `);
    expect(bound._tag).toMatchInlineSnapshot(`"a"`);
  }));

  it.effect('when rendering again', Effect.fn(function* () {
    const bound  = CF.bind(afc);
    const actual = yield* CF.call(bound, {prop: 'prop'});

    expect(actual).toMatchInlineSnapshot(`
      {
        "prop": "prop",
      }
    `);
    expect(bound._tag).toMatchInlineSnapshot(`"a"`);
  }));
});

describe('given effect function', () => {
  it('when binding', () => {
    const bound = CF.bind(efc);

    expect(bound).toEqual(efc);
    expect(JSON.stringify(bound, null, 2)).toMatchInlineSnapshot(`
      "{
        "_id": "CF",
        "name": "efc"
      }"
    `);
  });

  it.effect('when rendering', Effect.fn(function* () {
    const bound  = CF.bind(efc);
    const actual = yield* CF.call(bound, {prop: 'prop'});

    expect(actual).toMatchInlineSnapshot(`
      {
        "prop": "prop",
      }
    `);
    expect(bound._tag).toMatchInlineSnapshot(`"e"`);
  }));

  it.effect('when rendering again', Effect.fn(function* () {
    const bound  = CF.bind(efc);
    const actual = yield* CF.call(bound, {prop: 'prop'});

    expect(actual).toMatchInlineSnapshot(`
      {
        "prop": "prop",
      }
    `);
    expect(bound._tag).toMatchInlineSnapshot(`"e"`);
  }));
});
