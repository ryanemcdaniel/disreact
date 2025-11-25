import type * as Effect from 'effect/Effect';
import * as Context from 'effect/Context';
import * as Layer from 'effect/Layer';
import * as Intrinsic from './core/Intrinsic.js';
import * as Model from './core/Model.js';

export interface DisReactTransformerService {
  readonly transform: (model: Model.Model) => Effect.Effect<Intrinsic.Folds & {hydrant: Model.Hydrant}>;
}

export interface DisReactTransformer {
  readonly _: unique symbol;
}

export const DisReactTransformer = Context.GenericTag<DisReactTransformer, DisReactTransformerService>(
  '~disreact/Transformer',
);

export const layer = () => Layer.succeed(DisReactTransformer, {
  transform: (model) =>
    model.pipe(
      Model.transform(Intrinsic.transform),
    ) as Effect.Effect<Intrinsic.MFolds>,
});
