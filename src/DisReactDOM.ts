import * as Effect from 'effect/Effect';
import * as Context from 'effect/Context';
import * as Layer from 'effect/Layer';
import type * as Jsx from './core/Jsx.js';
import * as Data from 'effect/Data';
import * as Model from './core/Model.js';
import * as DisReactTransformer from './DisReactTransformer.js';
import type * as Intrinsic from './core/Intrinsic.js';

export class DisReactDOMError extends Data.TaggedError('DisReactDOMError')<{
  readonly cause: unknown;
}> {}

export interface DisReactDOMService {
  readonly mount    : (jsx: Jsx.Jsx) => Effect.Effect<Model.Model, DisReactDOMError>;
  readonly unmount  : (model: Model.Model) => Effect.Effect<void, DisReactDOMError>;
  readonly dispatch : (model: Model.Model, event: Model.Event) => Effect.Effect<void, DisReactDOMError>;
  readonly render   : (model: Model.Model) => Effect.Effect<void, DisReactDOMError>;
  readonly transform: (model: Model.Model) => Effect.Effect<Intrinsic.Folds & {hydrant: Model.Hydrant}, DisReactDOMError>;
}

const service = Effect.gen(function* () {
  const transformer = yield* DisReactTransformer.DisReactTransformer;

  const mount = (jsx: Jsx.Jsx) =>
    jsx.pipe(
      Model.make,
      Effect.tap(Model.mount),
      Effect.catchAll((cause) => Effect.fail(
        new DisReactDOMError({
          cause,
        }),
      )),
    );

  const unmount = (model: Model.Model) =>
    model.pipe(
      Model.unmount,
      Effect.catchAllDefect((cause) => Effect.fail(
        new DisReactDOMError({
          cause,
        }),
      )),
    );

  const dispatch = (model: Model.Model, event: Model.Event) =>
    Model.dispatch(model, event).pipe(
      Effect.catchAll((cause) => Effect.fail(
        new DisReactDOMError({
          cause,
        }),
      )),
    );

  const render = (model: Model.Model) =>
    Model.render(model).pipe(

      Effect.catchAll((cause) => Effect.fail(
        new DisReactDOMError({
          cause,
        }),
      )),
    );

  const transform = (model: Model.Model) =>
    model.pipe(
      transformer.transform,
      Effect.catchAll((cause) => Effect.fail(
        new DisReactDOMError({
          cause,
        }),
      )),
    );

  return {
    mount,
    unmount,
    dispatch,
    render,
    transform,
  };
});

export interface DisReactDOM {
  readonly _: unique symbol;
}

export const DisReactDOM = Context.GenericTag<DisReactDOM, DisReactDOMService>(
  '~disreact/DOM',
);

export const live = Layer.effect(DisReactDOM, service);
