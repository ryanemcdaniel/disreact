import type * as Jsx from './Jsx.js';
import * as Effect from 'effect/Effect';
import * as Predicate from 'effect/Predicate';
import type * as Types from 'effect/Types';
import * as Equal from 'effect/Equal';
import * as Data from 'effect/Data';
import * as Pipeable from 'effect/Pipeable';
import * as Inspectable from 'effect/Inspectable';
import * as Exit from 'effect/Exit';
import * as Util from './util.js';

export interface Fn extends Inspectable.Inspectable {
  readonly _id : 'Fn';
  readonly _tag: 'Local' | 'Global';
  readonly _op : 'Sync' | 'Async' | 'Effect' | 'Unknown';
  readonly _sig: readonly Hook['_tag'][] | undefined;
  readonly _rid: string | undefined;
  (...args: unknown[]): unknown;
}

export interface State extends Pipeable.Pipeable, Inspectable.Inspectable {
  readonly cycle  : 'Init' | 'Mount' | 'Hydrate' | 'Render';
  readonly type   : Fn;
  readonly props  : any;
  readonly pc     : number;
  readonly stack  : Hook[];
  readonly queue  : Effector[];
  readonly flags  : Set<State>;
  readonly hooks  : Hooks;
  readonly flagged: boolean;
}

const FnProto: Util.Prototype<Fn> = {
  ...Inspectable.BaseProto,
  _id : 'Fn',
  _tag: 'Local',
  _op : 'Unknown',
  _sig: undefined,
  _rid: undefined,
};

export const StateProto: Util.Prototype<State> = {
  ...Pipeable.Prototype,
  ...Inspectable.BaseProto,
  cycle  : 'Init',
  type   : undefined,
  props  : undefined,
  pc     : 0,
  stack  : undefined,
  queue  : undefined,
  flags  : undefined,
  hooks  : undefined,
  flagged: false,
};

export const isFn = (u: unknown): u is Fn => typeof u === 'function' && '_id' in u && u._id === 'Fn';

export const getDisplayName = (self: Fn) => self._rid ?? self.name ?? 'Anonymous';

export const getRegistryId = (self: Fn) => self._rid;

export const make = <T extends State>(component: T) => {
  const s = component as Types.Mutable<T>;
  const f = s.type as any;
  s.stack = [];
  s.queue = [];
  s.hooks = makeHooks(s);
  if (isFn(f)) return component;
  const _rid = f._rid;
  const fc   = Object.assign(f, Object.create(FnProto)) as Util.MutableFn<Fn>;
  fc._rid    = _rid;
  if (Util.isAsync(f)) fc._op = 'Async';
  return component;
};

export const call = (self: State): Effect.Effect<Jsx.Children> => {
  const f = self.type as Util.MutableFn<Fn>;
  const p = self.props;
  const h = self.hooks;
  switch (f._op) {
    case 'Sync':
      return Effect.sync(() => f(p, h)) as Effect.Effect<Jsx.Children>;
    case 'Async':
      return Effect.promise(() => f(p, h) as Promise<Jsx.Children>);
    case 'Effect':
      return Effect.suspend(() => f(p, h) as Effect.Effect<Jsx.Children>);
  }
  return Effect.suspend(() => {
    const r = f(p, h);
    if (Effect.isEffect(r)) {
      f._op = 'Effect';
      return r as any;
    }
    if (Predicate.isPromise(r)) {
      f._op = 'Async';
      return Effect.promise(() => r);
    }
    f._op = 'Sync';
    return Effect.succeed(r);
  });
};

export const post = (state: State): Effect.Effect<void> => {
  const self  = state as Types.Mutable<State>;
  const queue = self.queue;
  if (queue.length === 0) {
    return Effect.void;
  }
  return Effect.whileLoop({
    while: () => queue.length !== 0,
    step : () => {},
    body : () =>
      Effect.sync(() => queue.shift()!).pipe(
        Effect.tap((effector: Effector): Effect.Effect<void> => {
          const self = effector as Types.Mutable<Effector>;
          switch (self._op) {
            case 'Sync':
              return Effect.succeed(self.run());
            case 'Async':
              return Effect.promise(() => self.run() as any);
            case 'Effect':
              return self.run() as any;
          }
          const r = self.run();
          if (Effect.isEffect(r)) {
            self._op = 'Effect';
            return r as any;
          }
          if (Predicate.isPromise(r)) {
            self._op = 'Async';
            return Effect.promise(() => r);
          }
          self._op = 'Sync';
          return Effect.void;
        }),
        Effect.acquireRelease((fx, exit) => {
          if (Exit.isFailure(exit)) queue.unshift(fx);
          return Effect.void;
        }),
        Effect.scoped,
      ),
  });
};

export const commit = <T extends State>(state: T): Effect.Effect<T> => Effect.sync(() => {
  const self = state as Types.Mutable<T>;
  const type = self.type as Util.MutableFn<Fn>;
  const tags = [] as Hook['_tag'][];
  const prev = type._sig;
  for (let i = 0; i < self.stack.length; i++) {
    const hook = self.stack[i];
    tags.push(hook._tag);
  }
  const curr = Data.array(tags);
  if (!type._sig) {
    type._sig = curr;
    return state;
  }
  if (Equal.equals(prev, curr)) throw new Error('todo');
  return state;
});

type Hook = Reducer | Effector;

interface Reducer extends Inspectable.Inspectable {
  readonly _id : 'Hook';
  readonly _tag: 'Reducer';
  readonly name: string;
  readonly idx : number;
  readonly data: any;
  readonly run : (next: any) => void;
}

interface Effector extends Inspectable.Inspectable {
  readonly _id : 'Hook';
  readonly _tag: 'Effector';
  readonly _op : 'Sync' | 'Async' | 'Effect' | 'Unknown';
  readonly name: string;
  readonly idx : number;
  readonly data: readonly any[] | undefined;
  readonly run : () => unknown;
}

const Hook = Data.taggedEnum<Hook>();

const isReducerHook = Hook.$is('Reducer');

const isEffectorHook = Hook.$is('Effector');

const HookProto: Util.Prototype<Hook> = {
  ...Inspectable.BaseProto,
  _id : 'Hook',
  _tag: undefined,
  _op : 'Unknown',
  name: undefined,
  idx : 0,
  data: undefined,
  run : undefined,
};

export class HookError extends Data.TaggedError('HookError')<{
  readonly message: string;
}>
{}

const badCallOrder = (hook: Hook, expected: string) =>
  new HookError({
    message: `Expected ${expected} hook, got ${hook._tag}`,
  });

const badDepLength = (hook: Effector, deps?: any[]) =>
  new HookError({
    message: `Expected ${hook.data?.length} dependencies, got ${deps?.length}`,
  });

export interface Hooks {
  readonly useState : <A>(initial: A | (() => A)) => [state: A, setState: (next: A | ((prev: A) => A)) => void];
  readonly useEffect: (effect: () => void | Promise<void> | Effect.Effect<void, any, any>, deps?: any[]) => void;
}

const makeHooks = (state: State): Hooks => {
  const self = state as Types.Mutable<State>;

  const useState = <A>(i: A | (() => A)): [A, (next: A | ((prev: A) => A)) => void] => {
    const type = self.type._sig?.[self.pc];
    const hook = self.stack[self.pc];
    if (!hook) {
      const hook = Object.create(HookProto) as Types.Mutable<Reducer>;
      hook._tag  = 'Reducer';
      hook.data  = Predicate.isFunction(i) ? i() : i;

      hook.run = (n: any) => {
        self.flagged = true;
        self.flags.add(state);
        hook.data = Predicate.isFunction(n) ? n(hook.data) : n;
      };

      self.stack[self.pc++] = hook;
      return [hook.data, hook.run];
    }
    if (!isReducerHook(hook)) throw badCallOrder(hook, 'useState');
    if (!!type && type !== hook._tag) throw badCallOrder(hook, 'useState');
    self.pc++;
    return [hook.data, hook.run];
  };

  const useEffect = (fx: <E, R>() => void | Promise<void> | Effect.Effect<void, E, R>, deps?: any[]) => {
    const type = self.type._sig?.[self.pc];
    const hook = self.stack[self.pc] as Types.Mutable<Effector> | undefined;
    if (!hook) {
      const hook = Object.create(HookProto) as Types.Mutable<Effector>;
      hook._tag  = 'Effector';
      hook.data  = deps ? Data.array(deps) : undefined;
      hook.run   = fx;
      if (Util.isAsync(fx)) hook._op = 'Async';
      self.stack[self.pc++] = hook;
      return;
    }
    if (!isEffectorHook(hook)) throw badCallOrder(hook, 'useEffect');
    if (!!type && type !== hook._tag) throw badCallOrder(hook, 'useEffect');
    if (hook.data?.length !== deps?.length) throw badDepLength(hook, deps);
    if (!hook.data && !deps) {
      hook.run = fx;
      self.pc++;
      return;
    }
    const data = Data.array(deps!);
    if (!Equal.equals(hook.data, data)) self.queue.push(hook);
    hook.data = data;
    hook.run  = fx;
    self.pc++;
  };

  return {
    useState,
    useEffect,
  };
};

export interface Target extends Pipeable.Pipeable, Inspectable.Inspectable {
  readonly type    : string;
  readonly props   : any;
  readonly handlers: {
    readonly onClick? : (event: any) => unknown;
    readonly onSelect?: (event: any) => unknown;
    readonly onSubmit?: (event: any) => unknown;
  };
}

export const TargetProto: Util.Prototype<Target> = {
  ...Pipeable.Prototype,
  ...Inspectable.BaseProto,
  type    : undefined,
  props   : undefined,
  handlers: undefined,
};

const HandlersProto: Util.Prototype<Target['handlers']> = {
  onClick : undefined,
  onSelect: undefined,
  onSubmit: undefined,
};

export const updateTarget = <T extends Target>(self: T): T => {
  const s        = self as Types.DeepMutable<T>;
  const p        = s.props;
  const keys     = Object.keys(p);
  const handlers = Object.create(HandlersProto) as Types.Mutable<Target['handlers']>;
  const props    = {} as any;
  s.handlers     = handlers;
  s.props        = props;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const v = p[k];
    switch (k) {
      case 'onClick':
      case 'onSelect':
      case 'onSubmit':
        handlers[k] = v;
        break;
      default:
        props[k] = v;
    }
  }
  return self;
};

export interface EventData {

}

export const triggerTarget = <T extends Target>(self: T, event: any): Effect.Effect<void> => {
  return Effect.void; // todo
};
