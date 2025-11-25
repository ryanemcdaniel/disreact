import type * as Types from 'effect/Types';
import type * as Util from './util.js';

export type Patch<A extends {_tag: string}, B = A> =
  | Skip
  | Update<A>
  | Replace<A, B>
  | Nested<A, B>
  | Add<A>
  | Remove<A>
  | AndThen<Patch<A, B>, Patch<A, B>>
  | Mount<A>
  | Unmount<A>
  | Render<A>;

export interface Skip {
  readonly _tag: 'skip';
}

export interface Update<A extends {_tag: string}, B = A> {
  readonly _tag: 'update';
  readonly _cat: A['_tag'];
  readonly self: A;
  readonly that: B;
}

export interface Replace<A, B> {
  readonly _tag: 'replace';
  readonly self: A;
  readonly that: B;
}

export interface Add<A> {
  readonly _tag: 'add';
  readonly that: A;
}

export interface Remove<A> {
  readonly _tag: 'remove';
  readonly self: A;
}

export interface Nested<A, B> {
  readonly _tag : 'cont';
  readonly self : A;
  readonly those: B[];
}

export interface AndThen<A extends Patch<any, any>, B = A> {
  readonly _tag  : 'andThen';
  readonly first : A;
  readonly second: B;
}

export interface Mount<A> {
  readonly _tag: 'mount';
  readonly that: A;
}

export interface Unmount<A> {
  readonly _tag: 'unmount';
  readonly self: A;
}

export interface Render<A> {
  readonly _tag: 'render';
  readonly self: A;
}

const Proto: Util.Prototype<Patch<any>> = {
  _tag : '',
  _cat : undefined,
  self : undefined,
  that : undefined,
  those: undefined,
};

export const skip = (): Skip => {
  const patch = Object.create(Proto) as Types.Mutable<Skip>;
  patch._tag  = 'skip';
  return patch;
};

export const update = <A extends {_tag: string}>(self: A, that: A): Update<A> => {
  const patch = Object.create(Proto) as Types.Mutable<Update<A>>;
  patch._tag  = 'update';
  patch._cat  = self._tag;
  patch.self  = self;
  patch.that  = that;
  return patch;
};

export const replace = <A, B>(self: A, that: B): Replace<A, B> => {
  const patch = Object.create(Proto) as Types.Mutable<Replace<A, B>>;
  patch._tag  = 'replace';
  patch.self  = self;
  patch.that  = that;
  return patch;
};

export const cont = <A, B>(parent: A, children: B[]): Nested<A, B> => {
  const patch = Object.create(Proto) as Types.Mutable<Nested<A, B>>;
  patch._tag  = 'cont';
  patch.self  = parent;
  patch.those = children;
  return patch;
};

export const add = <A>(that: A): Add<A> => {
  const patch = Object.create(Proto) as Types.Mutable<Add<A>>;
  patch._tag  = 'add';
  patch.that  = that;
  return patch;
};

export const remove = <A>(self: A): Remove<A> => {
  const patch = Object.create(Proto) as Types.Mutable<Remove<A>>;
  patch._tag  = 'remove';
  patch.self  = self;
  return patch;
};

export const andThen = <A extends Patch<any, any>, B>(first: A, second: B): AndThen<A, B> => {
  const patch  = Object.create(Proto) as Types.Mutable<AndThen<A, B>>;
  patch._tag   = 'andThen';
  patch.first  = first;
  patch.second = second;
  return patch;
};

export const mount = <A>(that: A): Mount<A> => {
  const patch = Object.create(Proto) as Types.Mutable<Mount<A>>;
  patch._tag  = 'mount';
  patch.that  = that;
  return patch;
};

export const unmount = <A>(self: A): Unmount<A> => {
  const patch = Object.create(Proto) as Types.Mutable<Unmount<A>>;
  patch._tag  = 'unmount';
  patch.self  = self;
  return patch;
};

export const render = <A>(self: A): Render<A> => {
  const patch = Object.create(Proto) as Types.Mutable<Render<A>>;
  patch._tag  = 'render';
  patch.self  = self;
  return patch;
};
