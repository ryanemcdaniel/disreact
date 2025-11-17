import * as Inspectable from 'effect/Inspectable';
import * as Pipeable from 'effect/Pipeable';
import type * as Types from 'effect/Types';

export const Fragment = Symbol.for('disreact/fragment');

const TypeId = Symbol.for('disreact/jsx');

export interface Jsx extends Pipeable.Pipeable, Inspectable.Inspectable {
  readonly [TypeId]: typeof TypeId;
  readonly key     : Key;
  readonly type    : any;
  readonly props   : any;
  readonly children: any[];
  readonly ref     : any;
  readonly creator : string;
  readonly source? : any | undefined;
  readonly context?: any | undefined;
}

export type Value = string | bigint | number | boolean | null | undefined;

export type Child = Jsx | Value;

export type Childs = Child[];

export type Children = Child | Childs;

export const isJsx = (u: unknown): u is Jsx => typeof u === 'object' && u !== null && TypeId in u;

export const isFragment = (u: Jsx): u is Jsx => u.type === Fragment;

export const isIntrinsic = (u: Jsx): u is Jsx => typeof u.type === 'string';

export const isComponent = (u: Jsx): u is Jsx => typeof u.type === 'function';

export const isValue = (u: Children): u is Value => !u || typeof u !== 'object';

export const isChilds = (u: Children): u is Childs => Array.isArray(u);

const Proto: Partial<{ [K in keyof Jsx]: any }> = {
  ...Pipeable.Prototype,
  ...Inspectable.BaseProto,
  [TypeId]: TypeId,
  key     : undefined,
  type    : undefined,
  props   : undefined,
  children: undefined,
  ref     : undefined,
  creator : undefined,
  toJSON() {
    const {children, ...props} = this.props;
    return {
      _id     : this.creator,
      type    : typeof this.type === 'function' ? this.type.name : String(this.type),
      key     : this.key,
      props   : props,
      children: this.children,
    };
  },
};

const DEVProto: Partial<{ [K in keyof Jsx]: any }> = {
  ...Proto,
  source : undefined,
  context: undefined,
  toJSON() {
    const {children, ...props} = this.props;
    return {
      _id     : this.creator,
      type    : typeof this.type === 'function' ? this.type.name : String(this.type),
      key     : this.key,
      source  : this.source,
      context : this.context,
      props   : props,
      children: this.children,
    };
  },
};

const getChilds = (props: any) =>
  !props.children ? [] :
  Array.isArray(props.children) ? props.children :
  [props.children];

export type Key = string | number | undefined;

export const jsx = (type: any, props: any, key?: Key): Jsx => {
  const self = Object.create(Proto) as Types.Mutable<Jsx>;
  switch (typeof type) {
    case 'string':
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.creator  = 'jsx';
      self.children = getChilds(props);
      return self;
    case 'function':
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.creator  = 'jsx';
      self.children = [];
      return self;
    case 'symbol':
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.creator  = 'jsx';
      self.children = getChilds(props);
      return self;
    default:
      throw new Error(`[jsx] invalid type: ${type}`);
  }
};

export const jsxs = (type: any, props: any, key?: Key): Jsx => {
  const self = Object.create(Proto) as Types.Mutable<Jsx>;
  switch (typeof type) {
    case 'string':
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.creator  = 'jsxs';
      self.children = props.children;
      return self;
    case 'function':
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.creator  = 'jsxs';
      self.children = [];
      return self;
    case 'symbol':
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.creator  = 'jsxs';
      self.children = props.children;
      return self;
    default:
      throw new Error(`[jsxs] invalid type: ${type}`);
  }
};

export const jsxDEV = (type: any, props: any, key: Key, source: any, context: any): Jsx => {
  const self = Object.create(DEVProto) as Types.Mutable<Jsx>;
  switch (typeof type) {
    case 'string':
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.creator  = 'jsxDEV';
      self.source   = source;
      self.context  = context;
      self.children = getChilds(props);
      return self;
    case 'function':
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.creator  = 'jsxDEV';
      self.source   = source;
      self.context  = context;
      self.children = [];
      return self;
    case 'symbol':
      self.key      = key;
      self.type     = type;
      self.props    = props;
      self.creator  = 'jsxDEV';
      self.source   = source;
      self.context  = context;
      self.children = getChilds(props);
      return self;
    default:
      throw new Error(`[jsxDEV] invalid type: ${type}`);
  }
};

export const clone = (ref: Jsx): Jsx => {
  const self    = Object.create(Proto) as Types.Mutable<Jsx>;
  self.key      = ref.key;
  self.type     = ref.type;
  self.props    = {...ref.props};
  self.creator  = ref.creator;
  self.source   = ref.source;
  self.context  = ref.context;
  self.children = ref.children.map((c) => isJsx(c) ? clone(c) : c);
  return self;
};

export const getPropsOnly = (self: Jsx) => {
  const {children, ...props} = self.props;
  return props;
};

export const getPropsChilds = (self: Jsx): Childs =>
  !('children' in self.props) ? [] :
  Array.isArray(self.props.children) ? self.props.children :
  [self.props.children];

export interface Transform<T extends string = string, D = any> {
  type: T;
  data: D;
}

export interface TransformValue {
  value: any;
}

export type Transforms = (Transform | TransformValue)[];

export const transform = (self: Jsx, f: (node: Jsx, childs: (string | Transform)[]) => any): Transform => {
  const stack   = [self as Jsx | TransformValue];
  const targets = new WeakMap<Jsx | TransformValue, Transforms>();
  const sources = new WeakMap<Jsx | TransformValue, (string | Transform)[]>();

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (!isJsx(node)) {
      const target = targets.get(node)!;
      target.push(node);
    }
    else if (node.children.length === 0) {
      const target    = targets.get(node)!;
      const transform = {type: node.type, data: f(node, [])};
      target.push(transform);
    }
    else if (sources.has(node)) {
      const target    = targets.get(node)!;
      const transform = {type: node.type, data: f(node, sources.get(node)!)};
      target.push(transform);
    }
    else {
      const transforms = [] as Transform[];
      sources.set(node, transforms);
      stack.push(node);

      for (let i = node.children.length - 1; i >= 0; i--) {
        const child = node.children[i];

        if (!isJsx(child)) {
          const value = {value: child};
          targets.set(value, transforms);
          stack.push(value);
        }
        else {
          targets.set(child, transforms);
          stack.push(child);
        }
      }
    }
  }

  return {
    type: self.type,
    data: f(self, sources.get(self) ?? []),
  };
};

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
