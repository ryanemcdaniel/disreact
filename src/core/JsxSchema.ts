import type * as Effect from 'effect/Effect';
import * as Predicate from 'effect/Predicate';
import * as Record from 'effect/Record';
import * as Schema from 'effect/Schema';
import * as Jsx from './Jsx.js';

export const Fragment = Schema.UniqueSymbolFromSelf(Jsx.Fragment);

const AnyHandler = Schema.declare(Predicate.isFunction);

export const Handler = <A extends Schema.Schema.Any>(event: A): Schema.Schema<
  <E, R>(event: A['Type']) => void | Promise<void> | Effect.Effect<void, E, R>
> =>
  AnyHandler as any;

export const createAttributeValidator = (schemas: {[k: string]: [Schema.Schema<any, any>]}): (self: Jsx.Jsx) => void => {
  const validators = Record.map(
    schemas,
    ([schema]) => Schema.validateSync(schema),
  );
  return (self) => {
    const validator = validators[self.type];
    if (!validator) {
      throw new Error(`[JsxSchema] invalid type: ${String(self.type)}`);
    }
    validator(self.props);
  };
};
