import * as Jsx from './core/Jsx.js';
import type * as JsxIntrinsic from './core/Intrinsic.js';
import type * as Effect from 'effect/Effect';

export const Fragment = Jsx.Fragment;

export const jsxDEV = Jsx.jsxDEV;

export declare namespace JSX {
  export type ElementType =
    | keyof IntrinsicElements
    | typeof Jsx.Fragment
    | ((props: any) => Jsx.Children)
    | ((props: any) => Promise<Jsx.Children>)
    | (<E, R>(props: any) => Effect.Effect<Jsx.Children, E, R>);

  export interface Element extends Jsx.Jsx {}

  export interface IntrinsicElements extends JsxIntrinsic.IntrinsicElements {}
}
