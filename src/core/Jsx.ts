import * as Inspectable from 'effect/Inspectable';
import * as Pipeable from 'effect/Pipeable';
import type * as Types from 'effect/Types';
import * as Effect from 'effect/Effect';
import type * as Util from './util.js';
import * as Fn from './Fn.js';
import * as Predicate from 'effect/Predicate';

export const Fragment = Symbol.for('~disreact/jsx/Fragment');

const TypeId = '~disreact/jsx';

export interface Jsx extends Pipeable.Pipeable, Inspectable.Inspectable {
  readonly [TypeId]: 'jsx' | 'jsxs' | 'jsxDEV';
  readonly _tag    : 'Fragment' | 'Intrinsic' | 'Function';
  readonly key     : string | number | undefined;
  readonly type    : any;
  readonly props   : any;
  readonly children: any[];
}

export type Value =
  | string
  | bigint
  | number
  | boolean
  | null
  | undefined;

export type Children =
  | Value
  | Jsx
  | (Value | Jsx)[]
  | Children[];

export interface FC<P> {
  <E, R>(props: P): Children | Promise<Children> | Effect.Effect<Children, E, R>;
}

interface DEV extends Jsx {
  readonly dev: {
    multi : DEV.IsJsxs;
    source: DEV.Source;
    this  : DEV.This;
  };
}

namespace DEV {
  export type IsJsxs = boolean;
  export type Source = {
    fileName    : string;
    lineNumber  : number;
    columnNumber: number;
  };
  export type This = {};
}

// =============================================================================
// Prototype
// =============================================================================

export const isJsx = (u: unknown): u is Jsx => typeof u === 'object' && u !== null && TypeId in u;

export const isValue = (u: Children): u is Value => !u || typeof u !== 'object';

const Proto: Util.Prototype<Jsx> = {
  ...Pipeable.Prototype,
  ...Inspectable.BaseProto,
  [TypeId]: undefined,
  _tag    : undefined,
  key     : undefined,
  type    : undefined,
  props   : undefined,
  children: undefined,
  toJSON() {
    const {children, ...props} = this.props;
    return {
      type    : typeof this.type === 'function' ? this.type.name : String(this.type),
      key     : this.key,
      props   : props,
      children: this.children,
    };
  },
};

const DevProto: Util.Prototype<DEV> = {
  ...Proto,
  dev: undefined,
  toJSON() {
    const {children, ...props} = this.props;
    return {
      type    : typeof this.type === 'function' ? this.type.name : String(this.type),
      key     : this.key,
      // jsxs    : this.dev?.multi,
      // src     : this.dev?.source,
      // ctx     : this.dev?.this === globalThis ? 'globalThis' : 'unknown',
      props   : props,
      children: this.children,
    };
  },
};

// =============================================================================
// Constructors
// =============================================================================

const getChilds = (props: any) =>
  !props.children ? [] :
  Array.isArray(props.children) ? props.children :
  [props.children];

export const jsx = (type: any, props: any, key?: string | number): Jsx => {
  const self   = Object.create(Proto) as Types.Mutable<Jsx>;
  self[TypeId] = 'jsx';
  switch (typeof type) {
    case 'string':
      self._tag     = 'Intrinsic';
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.children = getChilds(props);
      return self;
    case 'function':
      self._tag     = 'Function';
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.children = [];
      return self;
    case 'symbol':
      self._tag     = 'Fragment';
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.children = getChilds(props);
      return self;
    default:
      throw new Error(`[jsx] invalid type: ${type}`);
  }
};

export const jsxs = (type: any, props: any, key?: string | number): Jsx => {
  const self   = Object.create(Proto) as Types.Mutable<Jsx>;
  self[TypeId] = 'jsxs';
  switch (typeof type) {
    case 'string':
      self._tag     = 'Intrinsic';
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.children = props.children;
      return self;
    case 'function':
      self._tag     = 'Function';
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.children = [];
      return self;
    case 'symbol':
      self._tag     = 'Fragment';
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.children = props.children;
      return self;
    default:
      throw new Error(`[jsxs] invalid type: ${type}`);
  }
};

export const jsxDEV = (
  type: any,
  props: any,
  key: string | number | undefined,
  isJsxs: DEV.IsJsxs,
  src: DEV.Source,
  This: DEV.This,
): DEV => {
  const self   = Object.create(DevProto) as Types.DeepMutable<DEV>;
  self[TypeId] = 'jsxDEV';
  switch (typeof type) {
    case 'string':
      self._tag     = 'Intrinsic';
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.children = isJsxs ? props.children : getChilds(props);
      break;
    case 'function':
      self._tag     = 'Function';
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.children = [];
      break;
    case 'symbol':
      self._tag     = 'Fragment';
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.children = isJsxs ? props.children : getChilds(props);
      break;
    default:
      throw new Error(`[jsxDEV] invalid type: ${type}`);
  }
  self.dev        = {} as any;
  self.dev.multi  = isJsxs;
  self.dev.source = src;
  self.dev.this   = This;
  return self as DEV;
};

export const clone = (src: Jsx): Jsx => {
  const self    = Object.create(Proto) as Types.Mutable<Jsx>;
  self[TypeId]  = src[TypeId];
  self._tag     = src._tag;
  self.key      = src.key;
  self.type     = src.type;
  self.props    = {...src.props};
  self.children = src.children.map((c) => isJsx(c) ? clone(c) : c);
  return self;
};

const getPropsChilds = (self: Jsx) =>
  !('children' in self.props) ? [] :
  Array.isArray(self.props.children) ? self.props.children :
  [self.props.children];

// =============================================================================
// Folding
// =============================================================================

export type Fold<T extends string = string, D = any> = {
  readonly _tag: 'Fold';
  readonly type: T;
  readonly data: D;
};
export namespace Fold {
  export type Value<V = any> = {
    readonly _tag: 'Value';
    readonly data: V;
  };
  export type Node<T = string, P = any, V extends Value = any, I extends Fold = any> = {
    type    : T;
    props   : P;
    children: (V | I)[];
    step    : string;
  };
}

const FoldProto: Util.Prototype<Fold> = {
  _tag: 'Fold',
  type: undefined,
  data: undefined,
};

const FoldValue: Util.Prototype<Fold.Value> = {
  _tag: 'Value',
  data: undefined,
};

const FoldNodeProto: Util.Prototype<Fold.Node> = {
  type    : undefined,
  props   : undefined,
  children: undefined,
  step    : undefined,
};

export const foldResult = (obj: {type: any}) => {
  const self = Object.create(FoldProto) as Types.Mutable<Fold>;
  self.type  = obj.type;
  return self;
};

export const foldValue = (value: Value) => {
  const self = Object.create(FoldValue) as Types.Mutable<Fold.Value>;
  self.data  = value;
  return self;
};

export const foldNode = (jsx: Jsx) => {
  const self    = Object.create(FoldNodeProto) as Types.Mutable<Fold.Node>;
  self.type     = jsx.type;
  self.props    = {...jsx.props};
  self.children = [];
  return self;
};

// =============================================================================
// Folding - Template
// =============================================================================

export class TemplateError extends Error {
  readonly _tag = 'TemplateError';
}

const callTemplate = (jsx: Jsx) => {
  if (jsx._tag !== 'Function') return jsx.children.flat();
  let children = jsx.children;

  try {
    children = jsx.type(jsx.props);
  }
  catch (cause) {
    if (cause instanceof Fn.HookError) {
      throw new TemplateError('hooks are not allowed in jsx template components', {cause});
    }
    throw new TemplateError(cause as string, {cause});
  }
  if (Predicate.isPromise(children)) {
    throw new TemplateError('invalid template FC: promise/async');
  }
  if (Effect.isEffect(children)) {
    throw new TemplateError('invalid template FC: effectful');
  }
  if (!children) return [];
  if (!Array.isArray(children)) return [children];
  return children.flat();
};

export const transformTemplate = (self: Jsx, fn: (node: Fold.Node) => any): Fold => {
  const root    = foldNode(self);
  const stack   = [self] as (Jsx | Fold.Value)[];
  const outputs = new Map([[stack[0], root]]);
  const inputs  = new Map();

  while (stack.length > 0) {
    const curr = stack.pop()!;

    if (curr._tag === 'Value') {
      const output = outputs.get(curr)!;
      output.children.push(curr);
    }
    else if (curr._tag === 'Function' || curr._tag === 'Fragment') {
      const output = outputs.get(curr)!;
      const jsxs   = callTemplate(curr);

      for (let i = jsxs.length - 1; i >= 0; i--) {
        const jsx  = jsxs[i];
        const next = isValue(jsx) ? foldValue(jsx) : jsx;
        outputs.set(next, output);
        stack.push(next);
      }
    }
    else if (curr.children.length === 0 || inputs.has(curr)) {
      const output = outputs.get(curr)!;
      const input  = inputs.get(curr) ?? foldNode(curr);
      const result = foldResult(curr);
      result.data  = fn(input);
      output.children.push(result);
    }
    else {
      const input = foldNode(curr);
      const jsxs  = callTemplate(curr);
      inputs.set(curr, input);
      stack.push(curr);

      for (let i = jsxs.length - 1; i >= 0; i--) {
        const jsx  = jsxs[i];
        const next = isValue(jsx) ? foldValue(jsx) : jsx;
        outputs.set(next, input);
        stack.push(next);
      }
    }
  }
  outputs.clear();
  inputs.clear();
  const final = foldResult(self);
  final.data  = fn(root);
  return final;
};

// =============================================================================
// Misc
// =============================================================================

const toStringProp = (v: unknown): string => {
  if (v === null) return `${v}`;
  const type = typeof v;
  if (type === 'undefined') return `${v}`;
  if (type === 'boolean') return `${v}`;
  if (type === 'number') return `${v}`;
  if (type === 'bigint') return `${v}n`;
  if (type === 'string') return `"${v}"`;
  if (type === 'symbol') return `[Symbol(${String(v)})]`;
  if (type === 'function') return `[Function (${(v as any).name})]`;
  if (Array.isArray(v)) return `[Array (${v.length})]`;
  return `[Object (${Object.keys(v as any).length})]`;
};

const toStringsProps = (p: any) => {
  const {children, ...props} = p;
  const keys                 = Object.keys(props);
  return keys.map((k) => `  ${k}=${toStringProp(props[k])}`);
};

const toStringValue = (v: Value) => {
  if (v === null) return `${v}`;
  const type = typeof v;
  if (type === 'undefined') return `${v}`;
  if (type === 'boolean') return `${v}`;
  if (type === 'number') return `${v}`;
  if (type === 'bigint') return `${v}n`;
  return `"${v}"`;
};

export function toString(this: Jsx): string {
  const stack   = [this as Jsx | {value: Value}];
  const indents = new WeakMap();
  const visited = new WeakMap();
  const values  = [] as [number, string][];
  indents.set(this, 0);

  while (stack.length > 0) {
    const node   = stack.pop()!;
    const indent = indents.get(node)!;

    if (!isJsx(node)) {
      const value = toStringValue(node.value);
      values.push([indent, value]);
    }

    if (isJsx(node)) {
      const props    = toStringsProps(node.props);
      const children = getPropsChilds(node);
    }

    // if (indents.has(node)) {
    //   const [indent, value] = indents.get(node)!;
    // }
    // else {
    //
    // }
  }
  return '';
}
