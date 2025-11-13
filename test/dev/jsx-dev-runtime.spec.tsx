import {expect, it} from 'vitest';

it('when transforming', () => {
  function Tag1() {return undefined;}
  function Tag2() {return undefined;}

  const jsx = (
    <>
      <Tag1>
        <Tag2>Hello World!</Tag2>
      </Tag1>
      <message>
        <embed title={'Hello World!'}/>
      </message>
    </>
  );

  expect(JSON.stringify(jsx, null, 2)).toMatchInlineSnapshot(`
    "{
      "_id": "jsxDEV",
      "type": "Symbol(disreact/fragment)",
      "source": true,
      "context": {
        "fileName": "/Users/ryan/repos/ryanemcdaniel/disreact/test/dev/jsx-dev-runtime.spec.tsx",
        "lineNumber": 8,
        "columnNumber": 5
      },
      "props": {},
      "children": [
        {
          "_id": "jsxDEV",
          "type": "Tag1",
          "source": false,
          "context": {
            "fileName": "/Users/ryan/repos/ryanemcdaniel/disreact/test/dev/jsx-dev-runtime.spec.tsx",
            "lineNumber": 9,
            "columnNumber": 7
          },
          "props": {},
          "children": []
        },
        {
          "_id": "jsxDEV",
          "type": "message",
          "source": false,
          "context": {
            "fileName": "/Users/ryan/repos/ryanemcdaniel/disreact/test/dev/jsx-dev-runtime.spec.tsx",
            "lineNumber": 12,
            "columnNumber": 7
          },
          "props": {},
          "children": [
            {
              "_id": "jsxDEV",
              "type": "embed",
              "source": false,
              "context": {
                "fileName": "/Users/ryan/repos/ryanemcdaniel/disreact/test/dev/jsx-dev-runtime.spec.tsx",
                "lineNumber": 13,
                "columnNumber": 9
              },
              "props": {
                "title": "Hello World!"
              },
              "children": []
            }
          ]
        }
      ]
    }"
  `);
});
