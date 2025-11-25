import type * as Types from 'effect/Types';
import type * as Function from 'effect/Function';

export const AsyncConstructor = (async () => {}).constructor;

export const isAsync = <A extends any[], B>(fn: Function.FunctionN<A, B>): fn is Function.FunctionN<A, B> => fn.constructor === AsyncConstructor;

export type Prototype<T> = {
  [K in keyof Types.UnionToIntersection<T>]: Types.UnionToIntersection<T>[K] | undefined
};

export type AnyFn = Function.FunctionN<any, any>;

export type  MutableFn<T> =
  T extends (...args: infer P) => infer R
  ? { -readonly [K in keyof T]: T[K]; } & ((...args: P) => R)
  : never;

export type Destroying<T> = {-readonly [K in keyof T]+?: T[K] extends {} ? Destroying<T[K]> : T[K]};

export const asMutable = <A>(a: A): Types.Mutable<A> => a as any;
