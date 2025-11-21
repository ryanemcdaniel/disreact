import * as Effect from 'effect/Effect';
import * as Context from 'effect/Context';
import * as Layer from 'effect/Layer';
import * as Jsx from './core/Jsx.js';
import type * as JsxIntrinsic from './core/JsxIntrinsic.js';

export interface DisReactTemplaterService {
  readonly transform: (jsx: Jsx.Jsx) => Effect.Effect<JsxIntrinsic.Folds>;
}

export interface DisReactTemplater {
  readonly _: unique symbol;
}

export const DisReactTemplater = Context.GenericTag<DisReactTemplater, DisReactTemplaterService>(
  '~disreact/Templater',
);

export const layer = () => Layer.succeed(DisReactTemplater, {
  transform: (jsx: Jsx.Jsx) =>
    Effect.sync(() =>
      Jsx.transformTemplate(jsx, (node) => {}) as JsxIntrinsic.Folds, // todo
    ),
});
