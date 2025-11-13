import * as Inspectable from 'effect/Inspectable';
import * as Pipeable from 'effect/Pipeable';
import type * as Types from 'effect/Types';

export const Fragment = Symbol.for('disreact/fragment');

const TypeId = Symbol.for('disreact/jsx');

export interface Jsx extends Pipeable.Pipeable, Inspectable.Inspectable {
  readonly [TypeId]: typeof TypeId;
  readonly key     : string | undefined;
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

export const isChild = (u: Children): u is Child => !Array.isArray(u);

export const isChilds = (u: Children): u is Childs => Array.isArray(u);

const Proto = {
  ...Pipeable.Prototype,
  ...Inspectable.BaseProto,
  [TypeId]: TypeId,
  key     : undefined,
  type    : undefined,
  props   : undefined,
  children: undefined,
  ref     : undefined,
  creator : undefined,
  toJSON(this: any) {
    const {children, ...props} = this.props;
    return {
      _id     : this.creator,
      key     : this.key,
      type    : typeof this.type === 'function' ? this.type.name : String(this.type),
      props   : props,
      children: this.children,
    };
  },
};

const DEVProto = {
  ...Proto,
  source : undefined,
  context: undefined,
  toJSON(this: any) {
    const {children, ...props} = this.props;
    return {
      _id     : this.creator,
      key     : this.key,
      type    : typeof this.type === 'function' ? this.type.name : String(this.type),
      source  : this.source,
      context : this.context,
      props   : props,
      children: this.children,
    };
  },
};

const makeChildren = (props: any) =>
  !props.children ? [] :
  Array.isArray(props.children) ? props.children :
  [props.children];

export const jsx = (type: any, props: any, key?: string | undefined): Jsx => {
  const self   = Object.create(Proto);
  self.key     = key;
  self.type    = type;
  self.props   = props;
  self.creator = 'jsx';
  switch (typeof type) {
    case 'string':
      self.children = makeChildren(props);
      return self;
    case 'function':
      self.children = [];
      return self;
    case 'symbol':
      self.children = makeChildren(props);
      return self;
    default:
      throw new Error(`[jsx] invalid type: ${type}`);
  }
};

export const jsxs = (type: any, props: any, key?: string | undefined): Jsx => {
  const self   = Object.create(Proto);
  self.key     = key;
  self.type    = type;
  self.props   = props;
  self.creator = 'jsxs';
  switch (typeof type) {
    case 'string':
      self.children = props.children;
      return self;
    case 'function':
      self.children = [];
      return self;
    case 'symbol':
      self.children = props.children;
      return self;
    default:
      throw new Error(`[jsxs] invalid type: ${type}`);
  }
};

export const jsxDEV = (type: any, props: any, key: string | undefined, source: any, context: any): Jsx => {
  const self   = Object.create(DEVProto);
  self.key     = key;
  self.type    = type;
  self.props   = props;
  self.creator = 'jsxDEV';
  self.source  = source;
  self.context = context;
  switch (typeof type) {
    case 'string':
      self.children = makeChildren(props);
      return self;
    case 'function':
      self.children = [];
      return self;
    case 'symbol':
      self.children = makeChildren(props);
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

export const propsWithoutChildren = (self: Jsx): any => {
  const {children, ...props} = self.props;
  return props;
};

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

export const map = <A>(self: Jsx, f: (node: Jsx, childs: A[]) => A): A => {
  const stack   = [self as Jsx | TransformValue];
  const targets = new WeakMap<Jsx | TransformValue, A[]>();
  const sources = new WeakMap<Jsx | TransformValue, A[]>();

  return f(self, []);
};

const toStringPropsValue = (value: any) => {
  switch (typeof value) {
    case 'string':
      return `"${value}"`;
    case 'object':
      return !value ? `${value}` :
             Array.isArray(value) ? `[Array (${value.length})]` :
             `[Object (${Object.keys(value).length})]`;
    case 'function':
      return `[Function (${value.name})]`;
    case 'symbol':
      return `[Symbol (${value.toString()})]`;
    default:
      return `${value}`;
  }
};

const toStringProps = (props: any) => {
  const values = [] as string[];
  const keys   = Object.keys(props);
  if (keys.length === 0) {
    return values;
  }
  for (const key of keys) {
    if (key !== 'children') {
      values.push(`  ${key}=${toStringPropsValue(props[key])}`);
    }
  }
  return values;
};

const toStringName = (self: Jsx) => {
  switch (typeof self.type) {
    case 'string':
      return self.type;
    case 'function':
      return self.type.name;
  }
  if ('ref' in self.props) {
    return 'Fragment';
  }
  return '';
};

const indent = (s: string, n: number) => '  '.repeat(n).concat(s).concat('\n');

const toStringSS = (self: Jsx) => {
  const values = [] as string[];
  const stack  = [self];
  const levels = new WeakMap();
  const tails  = new WeakMap();

  levels.set(self, 0);

  while (stack.length > 0) {
    const cur      = stack.pop()!;
    const curLevel = levels.get(cur)!;

    if (!tails.has(cur)) {
      const name     = toStringName(cur);
      const props    = toStringProps(cur.props);
      const children = makeChildren(cur.props);

      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];

        if (isValue(child)) {

        }
      }

      for (const child of children) {
        if (isJsx(child)) {
          levels.set(child, curLevel + 1);
        }
        else {
          values.push(indent(toStringPropsValue(child), curLevel));
        }
      }

      if (props.length === 0) {
        if (children.length === 0) {
          values.push(indent(`<${name}/>`, curLevel));
          tails.set(cur, '');
        }
        else {
          values.push(indent(`<${name}>`, curLevel));
          tails.set(cur, indent(`</${name}>`, curLevel));
        }
      }
      else if (children.length === 0) {
        values.push(indent(`<${name}`, curLevel));
        for (const prop of props) {
          values.push(indent(prop, curLevel));
        }
        values.push(indent(`/>`, curLevel));
        tails.set(cur, '');
      }
      else {
        values.push(indent(`<${name}`, curLevel));
        for (const prop of props) {
          values.push(indent(prop, curLevel));
        }
        values.push(indent(`>`, curLevel));
        tails.set(cur, indent(`</${name}>`, curLevel));
      }
    }
    else {
      const tail = tails.get(cur)!;
      if (tail) {
        values.push(tail);
      }
    }
  }
};

export function toString(self: Jsx) {
  return '';
}
