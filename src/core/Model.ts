import * as Inspectable from 'effect/Inspectable';
import * as Pipeable from 'effect/Pipeable';
import * as Fn from './Fn.js';
import * as Jsx from './Jsx.js';
import type * as Util from './util.js';
import type {Prototype} from './util.js';
import type * as Types from 'effect/Types';
import * as Effect from 'effect/Effect';
import * as MutableRef from 'effect/MutableRef';
import * as Data from 'effect/Data';
import * as Option from 'effect/Option';
import * as Patch from './Patch.js';
import * as Equal from 'effect/Equal';
import * as GlobalValue from 'effect/GlobalValue';
import {dual, identity} from 'effect/Function';

const TypeId = '~disreact/Model';

export interface Model extends Pipeable.Pipeable, Inspectable.Inspectable {
  readonly [TypeId]: typeof TypeId;
  readonly _tag    : 'Model';
  readonly _rid    : string | undefined;
  readonly flags   : Set<LogicNode>;
  readonly body    : Node;
  readonly withLock: <A, E, R>(self: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>;
}

// =============================================================================
// Prototype
// =============================================================================

const ModelProto: Util.Prototype<Model> = {
  ...Pipeable.Prototype,
  ...Inspectable.BaseProto,
  [TypeId]: TypeId,
  _tag    : 'Model',
  _rid    : undefined,
  flags   : undefined,
  body    : undefined,
  withLock: undefined,
};

export class ModelUnregisteredError extends Data.TaggedError('ModelUnregisteredError')<{
  readonly id: string;
}>
{}

export class ModelRegistryError extends Data.TaggedError('ModelRegistryError')<{
  readonly message: string;
}>
{}

export class ModelHydrationError<E = any> extends Data.TaggedError('ModelHydrationError')<{
  readonly cause: E;
}>
{}

// =============================================================================
// Constructors
// =============================================================================

export const make = (jsx: Jsx.Jsx): Effect.Effect<Model> => {
  const self         = Object.create(ModelProto) as Types.Mutable<Model>;
  const body         = fromJsxRoot(jsx);
  body.model.current = self;
  self.flags         = new Set();
  self.body          = body;
  const lock         = Effect.unsafeMakeSemaphore(1);
  self.withLock      = lock.withPermits(1);
  return Effect.succeed(self);
};

export type ModelPatch =
  | Patch.Skip
  | Patch.Update<Model>
  | Patch.Replace<Model, Model>;

// =============================================================================
// Lifecycle Errors
// =============================================================================

export class ModelRenderError<E = any> extends Data.TaggedError('ModelRenderError')<{
  readonly node : LogicNode;
  readonly cause: E;
}>
{}

export class ModelEffectError<E = any> extends Data.TaggedError('ModelEffectError')<{
  readonly node : LogicNode;
  readonly cause: E;
}>
{}

export class ModelEventError<E = any> extends Data.TaggedError('ModelEventError')<{
  readonly node?: DataNode;
  readonly cause: E;
}>
{}

// =============================================================================
// Lifecycle
// =============================================================================

export const mount = (self: Model): Effect.Effect<void, ModelRenderError | ModelEffectError> =>
  mountFromNode(self.body).pipe(
    self.withLock,
  );

export const render = (self: Model): Effect.Effect<void, ModelRenderError | ModelEffectError> =>
  self.withLock(
    Effect.void,
  );

export const unmount = (self: Model): Effect.Effect<void> =>
  self.withLock(
    Effect.sync(() => {
      unmountFromNode(self.body);
    }),
  );

export const dispatch = (self: Model, event: Event): Effect.Effect<void, ModelEventError> =>
  self.body.pipe(
    findNode((node): node is DataNode => {
      if (node._tag !== Node.Data) {
        return false;
      }
      return true;
    }),
    Effect.catchAll(() => Effect.fail(
      new ModelEventError({
        cause: new Error('event target not found'),
      }),
    )),
    Effect.flatMap((target) => dispatchNode(target, event)),
    self.withLock,
  );

// =============================================================================
// Node Model
// =============================================================================

type Node =
  | GroupNode
  | DataNode
  | LogicNode;

type ChildNode =
  | Node
  | ValueNode;

interface BaseNode extends Pipeable.Pipeable, Inspectable.Inspectable {
  readonly _tag    : string;
  readonly children: ChildNode[];
  readonly parent  : Node | undefined;
  readonly model   : MutableRef.MutableRef<Model>;
  readonly name    : string;
  readonly index   : number;
  readonly step    : string;
  readonly trie    : string;
}

interface LogicNode extends BaseNode, Fn.State {
  readonly _tag : typeof Node.Logic;
  readonly type : Fn.Fn;
  readonly props: object;
}

interface DataNode extends BaseNode, Fn.Target {
  readonly _tag : typeof Node.Data;
  readonly type : string;
  readonly props: object;
}

interface GroupNode extends BaseNode {
  readonly _tag : typeof Node.Group;
  readonly type : typeof Jsx.Fragment;
  readonly props: object;
}

interface ValueNode extends Pipeable.Pipeable, Inspectable.Inspectable {
  readonly _tag : typeof Node.Value;
  readonly type : undefined;
  readonly props: Jsx.Value;
}

// =============================================================================
// Node Prototype
// =============================================================================

const Node = {
  Logic: 'LogicNode',
  Data : 'DataNode',
  Group: 'GroupNode',
  Value: 'ValueNode',
} as const;

const NodeProto: Util.Prototype<ChildNode> = {
  ...Pipeable.Prototype,
  ...Inspectable.BaseProto,
  ...Fn.StateProto,
  ...Fn.TargetProto,
  _tag    : undefined,
  children: undefined,
  model   : undefined,
  parent  : undefined,
  nodeId  : undefined,
  name    : undefined,
  childId : undefined,
  stepId  : undefined,
  trieId  : undefined,
};

// =============================================================================
// Node Constructors
// =============================================================================

const fromValue = (value: Jsx.Value): ValueNode => {
  const self = Object.create(NodeProto) as Types.Mutable<ValueNode>;
  self._tag  = Node.Value;
  self.props = value;
  return self;
};

const fromJsx = (jsx: Jsx.Jsx, parent?: Node, index = 0): Node => {
  const self = Object.create(NodeProto) as Types.Mutable<Node>;
  switch (jsx._tag) {
    case 'Intrinsic':
      self._tag     = Node.Data;
      self.type     = jsx.type;
      self.props    = jsx.props;
      self.children = [];
      self.name     = jsx.type;
      break;
    case 'Function':
      self._tag     = Node.Logic;
      self.type     = jsx.type;
      self.props    = jsx.props;
      self.children = [];
      self.name     = jsx.type.name;
      Fn.make(self as any);
      break;
    case 'Fragment':
      self._tag     = Node.Group;
      self.type     = jsx.type;
      self.props    = jsx.props;
      self.children = [];
      self.name     = '<>';
      break;
  }
  self.index  = index;
  self.parent = parent;
  self.model  = parent?.model ?? MutableRef.make({} as any);
  return self;
};

const fromJsxRoot = (jsx: Jsx.Jsx): Node => {
  const root  = fromJsx(jsx);
  const stack = [root] as Node[];
  const refs  = new Map([[root, jsx.children]]);

  while (stack.length > 0) {
    const parent = stack.pop()!;
    const jsxs   = refs.get(parent)!;

    for (let i = 0; i < jsxs.length; i++) {
      const jsx = jsxs[i];

      if (Jsx.isValue(jsx)) {
        const child = fromValue(jsx);

        parent.children.push(child);
        continue;
      }
      if (Jsx.isJsx(jsx)) {
        const child = fromJsx(jsx, parent, i);

        parent.children.push(child);
        refs.set(child, jsx.children);
        stack.push(child);
        continue;
      }
      const child    = Object.create(NodeProto) as Types.Mutable<GroupNode>;
      child._tag     = Node.Group;
      child.children = [];
      child.name     = '[]';

      parent.children.push(child);
      refs.set(child, jsx);
      stack.push(child);
    }
  }
  return root;
};

const fromJsxChildren = (jsxs: Jsx.Children, parent: Node): ChildNode[] => {
  if (Jsx.isValue(jsxs)) {
    return [fromValue(jsxs)];
  }
  if (Jsx.isJsx(jsxs)) {
    return [fromJsx(jsxs, parent)];
  }
  const children = [] as ChildNode[];
  for (const jsx of jsxs) {
    if (Jsx.isValue(jsx)) {
      children.push(fromValue(jsx));
      continue;
    }
    if (Jsx.isJsx(jsx)) {
      children.push(fromJsx(jsx, parent));
      continue;
    }
  }
  return children;
};

// =============================================================================
// Node Lifecycle Unmount
// =============================================================================

// =============================================================================
// Node Lifecycle Mount
// =============================================================================

// =============================================================================
// Node Lifecycle Hydrate
// =============================================================================

// =============================================================================
// Node Lifecycle Rerender
// =============================================================================

// =============================================================================
// Node Algorithms
// =============================================================================

const findNode: {
  <A extends ChildNode>(predicate: (node: ChildNode) => node is A): (root: Node) => Option.Option<A>;
  (predicate: (node: ChildNode) => boolean): (root: Node) => Option.Option<ChildNode>;
  <A extends ChildNode>(root: Node, predicate: (node: ChildNode) => node is A): Option.Option<A>;
  (root: Node, predicate: (node: ChildNode) => boolean): Option.Option<ChildNode>;
} = dual(2, (root, predicate) => {
  if (predicate(root)) {
    return Option.some(root);
  }
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];

      if (predicate(child)) {
        return Option.some(child);
      }
      if (child._tag !== Node.Value) {
        stack.push(child);
      }
    }
  }
  return Option.none();
});

const getAncestryList = (node: Node) => {
  const ancestry = [] as Node[];
  let current    = node.parent;
  while (current) {
    ancestry.push(current);
    current = current.parent;
  }
  return ancestry;
};

const getLowestCommonAncestor = (nodes: Node[]): Option.Option<Node> => {
  switch (nodes.length) {
    case 0:
      return Option.none();
    case 1:
      return Option.some(nodes[0]);
  }
  let ancestors = new Set(getAncestryList(nodes[0]));
  let common    = nodes[0].parent;

  for (let i = 1; i < nodes.length; i++) {
    let node = nodes.at(i);

    while (node) {
      if (ancestors.has(node)) {
        ancestors = new Set(getAncestryList(node));
        common    = node;
        break;
      }
      node = node.parent;
    }
  }
  if (!common) {
    throw new Error('todo');
  }
  return Option.some(common);
};

interface LogicalBoundary {
  readonly syncTraversal : (ValueNode | GroupNode | DataNode)[];
  readonly logicTraversal: LogicNode[];
}

const getLogicalBoundary = (node: Node): LogicalBoundary => {
  const stack          = [...node.children].reverse();
  const syncTraversal  = [] as (ValueNode | GroupNode | DataNode)[];
  const logicTraversal = [] as LogicNode[];

  while (stack.length > 0) {
    const n = stack.pop()!;

    if (n._tag === Node.Logic) {
      logicTraversal.push(n);
      continue;
    }
    syncTraversal.push(n);
    if (n._tag === Node.Value) {
      continue;
    }
    for (let i = n.children.length - 1; i >= 0; i--) {
      const c = n.children[i];
      stack.push(c);
    }
  }
  return {
    syncTraversal,
    logicTraversal,
  };
};

type NodePatch =
  | Patch.Skip
  | Patch.Update<ValueNode>
  | Patch.Update<GroupNode>
  | Patch.Update<DataNode>
  | Patch.Update<LogicNode>
  | Patch.Replace<ChildNode, ChildNode>
  | Patch.Add<ChildNode>
  | Patch.Remove<ChildNode>;

const diffNode = (self?: ChildNode, that?: ChildNode): NodePatch => {
  if (!self && that) return Patch.add(that);
  if (self && !that) return Patch.remove(self);
  if (!self || !that) return Patch.skip();
  switch (self._tag) {
    case Node.Value:
      if (that._tag !== Node.Value) return Patch.replace(self, that);
      if (self.props !== that.props) return Patch.update(self, that);
      return Patch.skip();
    case Node.Group:
      if (that._tag !== Node.Group) return Patch.replace(self, that);
      if (!Equal.equals(self.props, that.props)) return Patch.update(self, that);
      return Patch.skip();
    case Node.Data:
      if (that._tag !== Node.Data) return Patch.replace(self, that);
      if (self.type !== that.type) return Patch.replace(self, that);
      if (!Equal.equals(self.props, that.props)) return Patch.update(self, that);
      return Patch.skip();
    case Node.Logic:
      if (that._tag !== Node.Logic) return Patch.replace(self, that);
      if (self.type !== that.type) return Patch.replace(self, that);
      if (!Equal.equals(self.props, that.props)) return Patch.update(self, that);
      return Patch.skip();
  }
};

const diffNodes = (parent: Node, rendered: Node[]): NodePatch[] => {
  const children = parent.children;
  const patches  = [] as NodePatch[];
  const length   = Math.max(children.length, rendered.length);
  for (let i = 0; i < length; i++) {
    const self  = children[i];
    const that  = rendered[i];
    const patch = diffNode(self, that);
    patches.push(patch);
  }
  return patches;
};

// =============================================================================
// Node Lifecycle
// =============================================================================

const mountFromNode = (root: Node): Effect.Effect<void> => {
  const stack = [root];

  return Effect.whileLoop({
      while: () => stack.length > 0,
      step : identity,
      body : () => {
        const node = stack.pop()!;

        switch (node._tag) {
          case Node.Data:
          case Node.Group: {
            for (let i = node.children.length - 1; i >= 0; i--) {
              const child = node.children[i];
              if (child._tag === Node.Value) continue;
              stack.push(child);
            }
            return Effect.void;
          }
        }
        const mutable = node as Types.Mutable<Node>;
        return Fn.call(node).pipe(
          Effect.map((rendered) => {
            mutable.children = fromJsxChildren(rendered, node);
            for (let i = 0; i < mutable.children.length; i++) {
              const child = mutable.children[i];
              if (child._tag === Node.Value) continue;
              stack.push(child);
            }
          }),
          Effect.tap(Fn.post(node)),
        );
      },
    },
  );
};

const renderFromNode = (root: Node): Effect.Effect<void> => {
  const stack = [root];
  return Effect.void;
};

const dispatchNode = (node: DataNode, event: Event): Effect.Effect<void, ModelEventError> => {
  return Effect.void;
};

const unmountFromNode = (root: Node) => {
  const stack   = [root];
  const visited = new WeakSet();

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (!visited.has(node)) {
      stack.push(node);
      visited.add(node);

      for (const child of node.children) {
        if (child._tag !== Node.Value) {
          stack.push(child);
        }
      }
      continue;
    }
    const mutable = node as Util.Destroying<Node>;
    switch (mutable._tag) {
      case Node.Data: {
        mutable.props    = undefined;
        mutable.children = undefined;
        mutable.parent   = undefined;
        mutable.model    = undefined;
        mutable.handlers = undefined;
        break;
      }
      case Node.Logic: {
        mutable.type     = undefined;
        mutable.props    = undefined;
        mutable.children = undefined;
        mutable.parent   = undefined;
        mutable.model    = undefined;
        mutable.stack    = undefined;
        mutable.queue    = undefined;
        mutable.hooks    = undefined;
        mutable.flags    = undefined;
        break;
      }
      case Node.Group: {
        mutable.props    = undefined;
        mutable.children = undefined;
        mutable.parent   = undefined;
        mutable.model    = undefined;
        break;
      }
    }
  }
};

// =============================================================================
// Event Model
// =============================================================================

export type Event =
  | OnClickEvent
  | OnSelectEvent
  | OnSubmitEvent;

export interface OnClickEvent {
  readonly _tag: 'onClick';
  readonly data: {};
}

export interface OnSelectEvent {
  readonly _tag  : 'onSelect';
  readonly target: {};
}

export interface OnSubmitEvent {
  readonly _tag: 'onSubmit';
}

// =============================================================================
// Event Prototype
// =============================================================================

const EventProto: Util.Prototype<Event> = {
  ...Pipeable.Prototype,
  ...Inspectable.BaseProto,
  _tag: undefined,
};

// =============================================================================
// Event Constructors
// =============================================================================

export const eventOnClick = () => {
  const self = Object.create(EventProto) as Types.Mutable<OnClickEvent>;
  self._tag  = 'onClick';
  return self;
};

export const eventOnSelect = () => {
  const self = Object.create(EventProto) as Types.Mutable<OnSelectEvent>;
  self._tag  = 'onSelect';
  return self;
};

export const eventOnSubmit = () => {
  const self = Object.create(EventProto) as Types.Mutable<OnSubmitEvent>;
  self._tag  = 'onSubmit';
  return self;
};

// =============================================================================
// Hydration Model
// =============================================================================

export interface Hydrant {
  readonly _tag : 'Hydrant';
  readonly _rid : string;
  readonly props: any;
  readonly state: any;
}

// =============================================================================
// Hydration Prototypes
// =============================================================================

const HydrantProto: Util.Prototype<Hydrant> = {
  _tag : undefined,
  _rid : undefined,
  props: undefined,
  state: undefined,
};

const Registry = GlobalValue.globalValue(TypeId, () => new Map<string, any>());

export const register = (type: Jsx.FC<any>, id: string) => {
  if (Registry.has(id)) {
    throw new ModelRegistryError({message: `${id} already registered`});
  }
  (type as any)._rid = id;
  Registry.set(id, type);
};

// =============================================================================
// Hydration Constructors
// =============================================================================

export const fromRegistered = (id: string): Effect.Effect<Model, ModelUnregisteredError> => {
  const type = Registry.get(id);
  if (!type) {
    throw new ModelUnregisteredError({id});
  }
  return type as any;
};

export const fromHydrant = (hydrant: Hydrant): Effect.Effect<Model, ModelUnregisteredError | ModelHydrationError> => {
  return fromRegistered(hydrant._rid);
};

// =============================================================================
// Folding
// =============================================================================

export interface Fold<T extends string = string, D = any> extends Inspectable.Inspectable, Jsx.Fold<T, D> {
  readonly hydrant: Hydrant;
}

const FoldProto: Prototype<Fold> = {
  ...Inspectable.BaseProto,
  _tag   : 'Fold',
  type   : undefined,
  data   : undefined,
  hydrant: undefined,
  toJSON() {
    return {
      type   : this.type,
      data   : this.data,
      hydrant: this.hydrant,
    };
  },
};

const unsafeTransform = (self: Model, fn: (self: Jsx.Fold.Node) => any): Fold => {
  const hydrant = Object.create(HydrantProto) as Types.Mutable<Hydrant>;
  hydrant._rid  = self._rid!;
  const props   = {...self.body.props} as any;
  delete props.children;
  hydrant.props = props;
  hydrant.state = {} as any;
  const root    = Jsx.foldNode(self.body);
  const stack   = [self.body] as ChildNode[];
  const outputs = new Map<ChildNode, Jsx.Fold.Node>([[stack[0], root]]);
  const inputs  = new Map<ChildNode, Jsx.Fold.Node>();

  while (stack.length > 0) {
    const curr   = stack.pop()!;
    const output = outputs.get(curr)!;

    switch (curr._tag) {
      case Node.Value: {
        const value = Jsx.foldValue(curr.props);
        output.children.push(value);
        break;
      }
      case Node.Group: {
        for (let i = curr.children.length - 1; i >= 0; i--) {
          const child = curr.children[i];
          outputs.set(child, output);
          stack.push(child);
        }
        break;
      }
      case Node.Logic: {
        if (!curr.stack) {
          break;
        }
        if (curr.stack.length !== 0) {
          hydrant.state[curr.trie] = curr.stack.map((c) => c.data);
        }
        for (let i = curr.children.length - 1; i >= 0; i--) {
          const child = curr.children[i];
          outputs.set(child, output);
          stack.push(child);
        }
        break;
      }
      case Node.Data: {
        if (curr.children.length > 0) {
          const input  = Jsx.foldNode(curr);
          const result = Jsx.foldResult(curr.type);
          result.data  = fn(input);
          output.children.push(result);
        }
        else if (inputs.has(curr)) {
          const input  = inputs.get(curr)!;
          const result = Jsx.foldResult(curr.type);
          result.data  = fn(input);
          output.children.push(result);
        }
        else {
          const input = Jsx.foldNode(curr);
          inputs.set(curr, input);
          stack.push(curr);
          for (let i = curr.children.length - 1; i >= 0; i--) {
            const child = curr.children[i];
            outputs.set(child, input);
            stack.push(child);
          }
        }
        break;
      }
    }
  }
  outputs.clear();
  inputs.clear();

  switch (self.body._tag) {
    case Node.Group:
    case Node.Logic: {
      if (!root.children.length) {
        const final   = Object.create(FoldProto) as Types.Mutable<Fold>;
        final.type    = '';
        final.data    = {};
        final.hydrant = hydrant;
        return final;
      }
      const first   = root.children[0];
      const final   = Object.create(FoldProto) as Types.Mutable<Fold>;
      final.type    = first.type;
      final.data    = first.data;
      final.hydrant = hydrant;
      return final;
    }
    case Node.Data: {
      const final   = Object.create(FoldProto) as Types.Mutable<Fold>;
      final.type    = self.body.type;
      final.data    = fn(root);
      final.hydrant = hydrant;
      return final;
    }
  }
};

export const transform: {
  (fn: (self: Jsx.Fold.Node) => any): (self: Model) => Effect.Effect<Fold>;
  (self: Model, fn: (self: Jsx.Fold.Node) => any): Effect.Effect<Fold>;
} = dual(
  2,
  (self: Model, fn: (self: Jsx.Fold.Node) => any): Effect.Effect<Fold> =>
    self.withLock(
      Effect.sync(() => unsafeTransform(self, fn)),
    ),
);
