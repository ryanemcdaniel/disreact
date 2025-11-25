import * as Effect from 'effect/Effect';
import * as Context from 'effect/Context';
import * as Layer from 'effect/Layer';
import * as Jsx from './core/Jsx.js';
import * as Intrinsic from './core/Intrinsic.js';

export interface DisReactTemplaterService {
  readonly transform: (jsx: Jsx.Jsx) => Effect.Effect<Intrinsic.Folds>;
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
      Jsx.transformTemplate(jsx, Intrinsic.transform) as Intrinsic.Folds, // todo
    ),
});
