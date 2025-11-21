import {describe, expect, it} from 'vitest';
import * as Jsx from '../../../src/core/Jsx.js';

describe('jsx', () => {
  it('unknown', () => {
    expect(() => Jsx.jsx({}, {})).toThrowErrorMatchingInlineSnapshot(`[Error: [jsx] invalid type: [object Object]]`);
  });

  it('intrinsic', () => {
    const actual = Jsx.jsx('tag1', {
      prop1   : 'prop1',
      children: Jsx.jsx('tag2', {
        prop2   : 'prop2',
        children: 'Hello World!',
      }),
    });

    expect(JSON.stringify(actual, null, 2)).toMatchInlineSnapshot(`
      "{
        "type": "tag1",
        "props": {
          "prop1": "prop1"
        },
        "children": [
          {
            "type": "tag2",
            "props": {
              "prop2": "prop2"
            },
            "children": [
              "Hello World!"
            ]
          }
        ]
      }"
    `);
  });

  it('fragment', () => {
    const actual = Jsx.jsx(Jsx.Fragment, {
      children: Jsx.jsx('tag2', {
        prop2   : 'prop2',
        children: 'Hello World!',
      }),
    });

    expect(JSON.stringify(actual, null, 2)).toMatchInlineSnapshot(`
      "{
        "type": "Symbol(~disreact/jsx/Fragment)",
        "props": {},
        "children": [
          {
            "type": "tag2",
            "props": {
              "prop2": "prop2"
            },
            "children": [
              "Hello World!"
            ]
          }
        ]
      }"
    `);
  });

  it('component', () => {
    function Tag1() {}
    const actual = Jsx.jsx(Tag1, {
      children: Jsx.jsx('tag2', {
        prop2   : 'prop2',
        children: 'Hello World!',
      }),
    });

    expect(JSON.stringify(actual, null, 2)).toMatchInlineSnapshot(`
      "{
        "type": "Tag1",
        "props": {},
        "children": []
      }"
    `);
  });
});

describe('jsxs', () => {
  it('unknown', () => {
    expect(() => Jsx.jsxs({}, {})).toThrowErrorMatchingInlineSnapshot(`[Error: [jsxs] invalid type: [object Object]]`);
  });

  it('intrinsic', () => {
    const actual = Jsx.jsxs('tag1', {
      prop1   : 'prop1',
      children: [
        Jsx.jsx('tag2', {
          prop2   : 'prop2',
          children: 'Hello World!',
        }),
        Jsx.jsx('tag3', {
          prop2   : 'prop3',
          children: 'Hello World!',
        }),
      ],
    });

    expect(JSON.stringify(actual, null, 2)).toMatchInlineSnapshot(`
      "{
        "type": "tag1",
        "props": {
          "prop1": "prop1"
        },
        "children": [
          {
            "type": "tag2",
            "props": {
              "prop2": "prop2"
            },
            "children": [
              "Hello World!"
            ]
          },
          {
            "type": "tag3",
            "props": {
              "prop2": "prop3"
            },
            "children": [
              "Hello World!"
            ]
          }
        ]
      }"
    `);
  });

  it('fragment', () => {
    const actual = Jsx.jsxs(Jsx.Fragment, {
      children: [
        Jsx.jsx('tag2', {
          prop2   : 'prop2',
          children: 'Hello World!',
        }),
        Jsx.jsx('tag3', {
          prop2   : 'prop3',
          children: 'Hello World!',
        }),
      ],
    });

    expect(JSON.stringify(actual, null, 2)).toMatchInlineSnapshot(`
      "{
        "type": "Symbol(~disreact/jsx/Fragment)",
        "props": {},
        "children": [
          {
            "type": "tag2",
            "props": {
              "prop2": "prop2"
            },
            "children": [
              "Hello World!"
            ]
          },
          {
            "type": "tag3",
            "props": {
              "prop2": "prop3"
            },
            "children": [
              "Hello World!"
            ]
          }
        ]
      }"
    `);
  });

  it('component', () => {
    function Tag1() {}
    const actual = Jsx.jsxs(Tag1, {
      children: [
        Jsx.jsx('tag2', {
          prop2   : 'prop2',
          children: 'Hello World!',
        }),
        Jsx.jsx('tag3', {
          prop2   : 'prop3',
          children: 'Hello World!',
        }),
      ],
    });

    expect(JSON.stringify(actual, null, 2)).toMatchInlineSnapshot(`
      "{
        "type": "Tag1",
        "props": {},
        "children": []
      }"
    `);
  });
});

describe('jsxDEV', () => {
  it('unknown', () => {
    expect(() => Jsx.jsxDEV({}, {}, undefined, false, {})).toThrowErrorMatchingInlineSnapshot(`[Error: [jsxDEV] invalid type: [object Object]]`);
  });

  it('intrinsic', () => {
    const actual = Jsx.jsxDEV('tag1', {
      prop1   : 'prop1',
      children: [
        Jsx.jsxDEV('tag2', {
          prop2   : 'prop2',
          children: 'Hello World!',
        }, undefined, false, {}),
        Jsx.jsxDEV('tag3', {
          prop2   : 'prop3',
          children: 'Hello World!',
        }, undefined, false, {}),
      ],
    }, undefined, false, {});

    expect(JSON.stringify(actual, null, 2)).toMatchInlineSnapshot(`
      "{
        "type": "tag1",
        "props": {
          "prop1": "prop1"
        },
        "children": [
          {
            "type": "tag2",
            "props": {
              "prop2": "prop2"
            },
            "children": [
              "Hello World!"
            ]
          },
          {
            "type": "tag3",
            "props": {
              "prop2": "prop3"
            },
            "children": [
              "Hello World!"
            ]
          }
        ]
      }"
    `);
  });

  it('fragment', () => {
    const actual = Jsx.jsxDEV(Jsx.Fragment, {
      children: [
        Jsx.jsxDEV('tag2', {
          prop2   : 'prop2',
          children: 'Hello World!',
        }, undefined, false, {}),
        Jsx.jsxDEV('tag3', {
          prop2   : 'prop3',
          children: 'Hello World!',
        }, undefined, false, {}),
      ],
    }, undefined, false, {});

    expect(JSON.stringify(actual, null, 2)).toMatchInlineSnapshot(`
      "{
        "type": "Symbol(~disreact/jsx/Fragment)",
        "props": {},
        "children": [
          {
            "type": "tag2",
            "props": {
              "prop2": "prop2"
            },
            "children": [
              "Hello World!"
            ]
          },
          {
            "type": "tag3",
            "props": {
              "prop2": "prop3"
            },
            "children": [
              "Hello World!"
            ]
          }
        ]
      }"
    `);
  });

  it('component', () => {
    function Tag1() {}
    const actual = Jsx.jsxDEV(Tag1, {
      children: [
        Jsx.jsxDEV('tag2', {
          prop2   : 'prop2',
          children: 'Hello World!',
        }, undefined, false, {}),
        Jsx.jsxDEV('tag3', {
          prop2   : 'prop3',
          children: 'Hello World!',
        }, undefined, false, {}),
      ],
    }, undefined, false, {});

    expect(JSON.stringify(actual, null, 2)).toMatchInlineSnapshot(`
      "{
        "type": "Tag1",
        "props": {},
        "children": []
      }"
    `);
  });
});

describe('utils', () => {
  it('when stringifying', () => {
    function Tag1() {}
    const jsx    = Jsx.jsxDEV(Tag1, {
      children: [
        Jsx.jsxDEV('tag2', {
          prop2   : 'prop2',
          children: 'Hello World!',
        }, undefined, false, {}),
        Jsx.jsxDEV('tag3', {
          prop2   : 'prop3',
          children: 'Hello World!',
        }, undefined, false, {}),
      ],
    }, undefined, false, {});

    const actual = Jsx.toString.apply(jsx);

    expect(actual).toMatchInlineSnapshot(`""`);
  });
});
