import { ColorStop } from "../value";
import { PainterGradientPatternOption, PainterGradientPatternStyle } from "./base";
import { PainterElement } from "../painter-element/base";
export interface PainterLinerGradientOption extends PainterGradientPatternOption {
    type: "liner-gradient";
    colorStops: ColorStop[];
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export declare class PainterLinerGradientStyle extends PainterGradientPatternStyle {
    option: PainterLinerGradientOption;
    constructor(element: PainterElement, option: PainterLinerGradientOption);
    get style(): CanvasGradient;
}
