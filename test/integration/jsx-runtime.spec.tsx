import {expect, it, vi } from 'vitest';

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
      "_id": "jsxs",
      "type": "Symbol(disreact/fragment)",
      "props": {},
      "children": [
        {
          "_id": "jsx",
          "type": "Tag1",
          "props": {},
          "children": []
        },
        {
          "_id": "jsx",
          "type": "message",
          "props": {},
          "children": [
            {
              "_id": "jsx",
              "type": "embed",
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
