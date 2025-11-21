import * as Effect from 'effect/Effect';
import * as Context from 'effect/Context';
import * as Layer from 'effect/Layer';
import type * as Jsx from './core/Jsx.js';
import * as Data from 'effect/Data';
import type * as Model from './core/Model.js';

export class DisReactDOMError extends Data.TaggedError('DisReactDOMError')<{
  readonly cause: | Model.ModelUnregisteredError;
}> {}

export interface DisReactDOMService {
  readonly mount    : (jsx: Jsx.Jsx) => Effect.Effect<Model.Model, DisReactDOMError>;
  readonly mountFC  : <P>(f: Jsx.FC<P>, props: P) => Effect.Effect<Model.Model, DisReactDOMError>;
  readonly unmount  : (model: Model.Model) => Effect.Effect<void, DisReactDOMError>;
  readonly dispatch : (model: Model.Model, event: Model.Event) => Effect.Effect<void, DisReactDOMError>;
  readonly render   : (model: Model.Model) => Effect.Effect<void, DisReactDOMError>;
  readonly transform: (model: Model.Model) => Effect.Effect<Jsx.Fold, DisReactDOMError>;
}

const service = Effect.gen(function* () {
  return {} as DisReactDOMService;
});

export interface DisReactDOM {
  readonly _: unique symbol;
}

export const DisReactDOM = Context.GenericTag<DisReactDOM, DisReactDOMService>(
  '~disreact/DOM',
);

export const live = Layer.effect(DisReactDOM, service);
