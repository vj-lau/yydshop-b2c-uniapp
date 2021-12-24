import { PainterLinerGradientOption } from "./liner-gradient";
import { PainterElement } from "../painter-element/base";
export interface PainterGradientPatternOption {
    type: string;
}
export declare type BuiltInPainterGradientPatternOption = PainterLinerGradientOption;
export declare abstract class PainterGradientPatternStyle {
    element: PainterElement;
    constructor(element: PainterElement);
    get painter(): import("../painter").default;
    abstract get style(): CanvasGradient | CanvasPattern;
}
