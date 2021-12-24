import Painter from "../painter";
import { PainterElementOption, PainterElement } from "./base";
import { BuiltInPainterElementOption } from "./index";
export interface PainterTransformElementOption extends PainterElementOption {
    type: "transform";
    /** 变换的内容 */
    content: BuiltInPainterElementOption;
    /** 变换的选项 */
    transform: BuiltInPainterTransformOption[];
    /** 变换的原点、默认为元素的中心 */
    transformOrigin: PaitnerTransformOriginOption;
}
declare type BuiltInPainterTransformOption = PainterTransformTranslateOption | PainterTransformRotateOption | PainterTransformScaleOption | PainterTransformMatrixOption;
interface PainterTransformTranslateOption {
    type: "translate";
    x?: number;
    y?: number;
}
interface PainterTransformRotateOption {
    type: "rotate";
    /** degree */
    rotate: number;
}
interface PainterTransformScaleOption {
    type: "scale";
    scaleWidth?: number;
    scaleHeight?: number;
}
interface PainterTransformMatrixOption {
    type: "set-matrix";
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
}
declare type PaitnerTransformOriginOption = [PaitnerTransformOriginHorizontalOption, PaitnerTransformOriginVerticalOption];
declare type PaitnerTransformOriginHorizontalOption = "left" | "center" | "right";
declare type PaitnerTransformOriginVerticalOption = "top" | "center" | "bottom";
/**
 * - fixme: Cascade transform not supported yet.
 * Cause when we set tansform origin in `withTransformOrigin`,
 * We don't know the transform state of outer element.
 */
export declare class PainterTransformElement extends PainterElement {
    transformOrigin: PaitnerTransformOriginOption;
    transformOptions: BuiltInPainterTransformOption[];
    contentElement: PainterElement;
    constructor(painter: Painter, option: PainterTransformElementOption, parent?: PainterElement);
    _layout(): Promise<import("../value").Size>;
    paint(): Promise<void>;
    private transform;
    private singleTransform;
    private withTransformOrigin;
}
export {};
