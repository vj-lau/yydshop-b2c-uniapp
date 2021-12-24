import Painter from "../painter";
import { PainterElementOption, PainterElement } from "./base";
import { OmitBaseOption } from "../value";
import { BuiltInPainterFillStrokeOption } from "../painter-fill-stroke/index";
export interface PainterLineElementOption extends PainterElementOption {
    type: "line";
    /** 直线终点距离起点在水平方向上的距离 */
    dx: number;
    /** 直线终点距离起点在垂直方向上的距离 */
    dy: number;
    /** 直线的颜色 */
    color: BuiltInPainterFillStrokeOption;
    /** 直线的宽度 */
    lineWidth: number;
    /** 虚线样式，默认为实线 */
    dashPattern: number[];
}
export declare class PainterLineElement extends PainterElement {
    option: OmitBaseOption<PainterLineElementOption>;
    constructor(painter: Painter, option: Partial<PainterLineElementOption>, parent?: PainterElement);
    _layout(): {
        width: number;
        height: number;
    };
    paint(): void;
}
