import { PainterPath, PainterPathOption } from "./base";
import { BorderRadius } from "../value";
import { PainterElement } from "../painter-element/base";
export interface PainterRoundedRectanglePathOption extends PainterPathOption {
    type: "rounded-rect";
    /** 路径的宽度 */
    width: number;
    /** 路径的高度 */
    height: number;
    /** 路径的圆角 */
    borderRadius: BorderRadius;
}
export declare class PainterRoundedRectanglePath extends PainterPath {
    option: PainterRoundedRectanglePathOption;
    constructor(element: PainterElement, option: PainterRoundedRectanglePathOption);
    private assertBorderRadius;
    paint(): void;
    private get normalizedBorderRadius();
    /**
     * @see https://www.w3.org/TR/css-backgrounds-3/#corner-overlap
     * Corner curves must not overlap: When the sum of any two adjacent border
     * radii exceeds the size of the border box, UAs must proportionally reduce
     * the used values of all border radii until none of them overlap.
     */
    private reduceBorderRadius;
}
