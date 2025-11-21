import * as Effect from 'effect/Effect';
import * as Context from 'effect/Context';
import * as Layer from 'effect/Layer';
import * as Jsx from './core/Jsx.js';
import type * as Intrinsic from './core/Intrinsic.js';

export interface DisReactTransformerService {
  readonly transform: (jsx: Jsx.Jsx) => Effect.Effect<Intrinsic.Folds>;
}

export interface DisReactTransformer {
  readonly _: unique symbol;
}

export const DisReactTransformer = Context.GenericTag<DisReactTransformer, DisReactTransformerService>(
  '~disreact/Transformer',
);

export const layer = () => Layer.succeed(DisReactTransformer, {
  transform: (jsx: Jsx.Jsx) =>
    Effect.sync(() =>
      Jsx.transformTemplate(jsx, (node) => {}) as Intrinsic.Folds, // todo
    ),
});
