import * as Jsx from './core/Jsx.js';
import type * as Effect from 'effect/Effect';
import type * as JsxIntrinsic from './core/JsxIntrinsic.js';

export const Fragment = Jsx.Fragment;

export const jsx = Jsx.jsx;

export const jsxs = Jsx.jsxs;

 export declare namespace JSX {
  export type ElementType =
    | keyof IntrinsicElements
    | typeof Jsx.Fragment
    | ((props: any) => Jsx.Children)
    | ((props: any) => Promise<Jsx.Children>)
    | (<E, R>(props: any) => Effect.Effect<Jsx.Children, E, R>)
    | Effect.Effect<{}>;

  export interface Element extends Jsx.Jsx {}

  export interface IntrinsicElements extends JsxIntrinsic.IntrinsicElements {}
}
