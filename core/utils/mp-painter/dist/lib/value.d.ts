import { PainterElementOption } from "./painter-element/base";
export interface Size {
    width: number;
    height: number;
}
export interface Rect {
    top: number;
    left: number;
    width: number;
    height: number;
}
export declare type BaseLine = "top" | "middle" | "bottom" | "normal";
export declare type BorderRadius = number | [number, number, number, number];
export declare type BorderStyle = "solid" | "dashed";
/** @example "#rrggbb" | "#rgb" | "colorName" */
export declare type Color = string;
export interface ColorStop {
    offset: number;
    color: Color;
}
export declare type FillStrokeStyle = string | CanvasGradient | CanvasPattern;
export declare type FontWeight = "normal" | "bold";
export declare type FontStyle = "normal" | "italic";
export declare type ObjectFit = "fill" | "contain" | "cover";
export declare type ObjectPosition = ["left" | "center" | "right", "top" | "center" | "bottom"];
export declare type Position = "static" | "absolute";
export declare type TextAlign = "left" | "right" | "center";
export declare type TextDecoration = "none" | "line-through";
/** left-top right-top right-bottom left-bottom */
export declare type OmitBaseOption<T> = Omit<T, keyof PainterElementOption>;
export declare function cssBorderStyleToLinePattern(borderStyle: BorderStyle, borderWidth: number): [number, number];
