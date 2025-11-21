import {expect, it} from 'vitest';
import * as Jsx from '../../src/core/Jsx.js';

it('when transforming', () => {
  function Tag1(props: any) {return props.children;}
  function Tag2(props: any) {return props.children;}

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

  const transform = Jsx.transformTemplate(jsx, (node) => {
    console.log(node.type, ...node.children.flatMap((c) => [c._tag, c.value ?? c.data]));
    return [String(node.type), ...node.children.map((c) => [c._tag, c.value ?? c.data])].join('\n');
  });

  console.log(transform);

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
