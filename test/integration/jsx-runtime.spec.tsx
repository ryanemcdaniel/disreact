import {expect, it} from 'vitest';

it('when transforming', () => {
  function Tag1() {return undefined;}
  function Tag2() {return undefined;}

  const jsx = (
    <>
      <Tag1>
        <Tag2>{'Hello World!'}{'Hello World!'}</Tag2>
        <Tag2>Hello World!</Tag2>
      </Tag1>
      <message>
        <embed title={'Hello World!'}/>
      </message>
    </>
  );

  expect(JSON.stringify(jsx, null, 2)).toMatchInlineSnapshot(`
    "{
      "type": "Symbol(~disreact/jsx/Fragment)",
      "props": {},
      "children": [
        {
          "type": "Tag1",
          "props": {},
          "children": []
        },
        {
          "type": "message",
          "props": {},
          "children": [
            {
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
