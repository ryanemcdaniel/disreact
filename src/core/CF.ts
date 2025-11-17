import * as Effect from 'effect/Effect';
import * as Inspectable from 'effect/Inspectable';
import * as Pipeable from 'effect/Pipeable';
import * as Predicate from 'effect/Predicate';
import type * as Types from 'effect/Types';
import type * as Jsx from './Jsx.js';

export interface CF<T extends 'Sync' | 'Async' | 'Effect' | undefined = undefined> extends Pipeable.Pipeable, Inspectable.Inspectable {
  readonly _id         : 'CF';
  readonly _tag        : T;
  readonly displayName?: string | undefined;
  <E = never, R = never>(props: any):
    T extends 'Sync' ? Jsx.Children :
    T extends 'Async' ? Promise<Jsx.Children> :
    T extends 'Effect' ? Effect.Effect<Jsx.Children, E, R> :
    Jsx.Children | Promise<Jsx.Children> | Effect.Effect<Jsx.Children, E, R>;
}

export const isJsxFC = (u: unknown): u is CF => typeof u === 'function' && '_id' in u && u._id === 'CF';

const Proto = {
  ...Pipeable.Prototype,
  ...Inspectable.BaseProto,
  _id        : 'CF',
  _tag       : undefined,
  displayName: undefined,
  toJSON(this: any) {
    return {
      _id : 'CF',
      _tag: this._tag,
      name: this.displayName ?? this.name ?? 'Anonymous',
    };
  },
};

const AsyncFunctionConstructor = (async () => {}).constructor;

export interface Input {
  displayName?: string;
  (props: any): any;
}

export const bind = (f: Input): CF => {
  if (isJsxFC(f)) {
    return f;
  }
  const self = Object.assign(f, Proto as unknown as Types.Mutable<CF<any>>);

  if (f.constructor === AsyncFunctionConstructor) {
    self._tag = 'Async';
  }
  if (f.displayName) {
    self.displayName = f.displayName as any;
  }
  return self as CF;
};

export const call = (self: CF<any>, props: any): Effect.Effect<Jsx.Children> => {
  switch (self._tag) {
    case 'Sync':
      return Effect.sync(() => self(props) as any);
    case 'Async':
      return Effect.promise(() => self(props) as any);
    case 'Effect':
      return Effect.suspend(() => self(props) as any);
  }
  return Effect.suspend(() => {
    const mut = self as Types.Mutable<CF<any>>;
    const res = self(props);

    if (Effect.isEffect(res)) {
      mut._tag = 'Effect';
      return res;
    }
    if (Predicate.isPromise(res)) {
      mut._tag = 'Async';
      return Effect.promise(() => res);
    }
    mut._tag = 'Sync';
    return Effect.succeed(res);
  });
};
