import type * as Effect from 'effect/Effect';
import type * as Jsx from './core/Jsx.js';
import type * as JsxSpec from './runtime/Spec.js';

declare global {
  export namespace JSX {
    export type ElementType =
      | keyof IntrinsicElements
      | typeof Jsx.Fragment
      | ((props: any) => Jsx.Children)
      | ((props: any) => Promise<Jsx.Children>)
      | (<E, R>(props: any) => Effect.Effect<Jsx.Children, E, R>);

    export type Element = Jsx.Jsx;

    export type IntrinsicElements = JsxSpec.JsxAttributes;
  }
}
