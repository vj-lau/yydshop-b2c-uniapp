import { Color } from "../value";
import { PainterLinerGradientOption } from "./liner-gradient";
import { PainterElement } from "../painter-element/base";
export declare type BuiltInPainterFillStrokeOption = Color | PainterLinerGradientOption;
export declare function createFillStrokeStyle(element: PainterElement, option: BuiltInPainterFillStrokeOption): string | CanvasGradient;
