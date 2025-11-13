import {describe, expect, it} from 'vitest';
import * as Jsx from '../../../src/core/Jsx.js';

describe('jsx', () => {
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
        "_id": "jsx",
        "type": "tag1",
        "props": {
          "prop1": "prop1"
        },
        "children": [
          {
            "_id": "jsx",
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
        "_id": "jsx",
        "type": "Symbol(disreact/fragment)",
        "props": {},
        "children": [
          {
            "_id": "jsx",
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
        "_id": "jsx",
        "type": "Tag1",
        "props": {},
        "children": []
      }"
    `);
  });
});

describe('jsxs', () => {
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
        "_id": "jsxs",
        "type": "tag1",
        "props": {
          "prop1": "prop1"
        },
        "children": [
          {
            "_id": "jsx",
            "type": "tag2",
            "props": {
              "prop2": "prop2"
            },
            "children": [
              "Hello World!"
            ]
          },
          {
            "_id": "jsx",
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
    const actual = Jsx.jsx(Jsx.Fragment, {
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
        "_id": "jsx",
        "type": "Symbol(disreact/fragment)",
        "props": {},
        "children": [
          {
            "_id": "jsx",
            "type": "tag2",
            "props": {
              "prop2": "prop2"
            },
            "children": [
              "Hello World!"
            ]
          },
          {
            "_id": "jsx",
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
    const actual = Jsx.jsx(Tag1, {
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
        "_id": "jsx",
        "type": "Tag1",
        "props": {},
        "children": []
      }"
    `);
  });
});

describe('jsxDEV', () => {
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
        "_id": "jsxDEV",
        "type": "tag1",
        "source": false,
        "context": {},
        "props": {
          "prop1": "prop1"
        },
        "children": [
          {
            "_id": "jsxDEV",
            "type": "tag2",
            "source": false,
            "context": {},
            "props": {
              "prop2": "prop2"
            },
            "children": [
              "Hello World!"
            ]
          },
          {
            "_id": "jsxDEV",
            "type": "tag3",
            "source": false,
            "context": {},
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
        "_id": "jsxDEV",
        "type": "Symbol(disreact/fragment)",
        "source": false,
        "context": {},
        "props": {},
        "children": [
          {
            "_id": "jsxDEV",
            "type": "tag2",
            "source": false,
            "context": {},
            "props": {
              "prop2": "prop2"
            },
            "children": [
              "Hello World!"
            ]
          },
          {
            "_id": "jsxDEV",
            "type": "tag3",
            "source": false,
            "context": {},
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
        "_id": "jsxDEV",
        "type": "Tag1",
        "source": false,
        "context": {},
        "props": {},
        "children": []
      }"
    `);
  });
});
