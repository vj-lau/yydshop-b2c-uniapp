import Painter from "../painter";
import { PainterElementOption, PainterElement } from "./base";
import { OmitBaseOption } from "../value";
import { BuiltInPainterElementOption } from "./index";
export interface PainterContainerElementOption extends PainterElementOption {
    type: "container";
    /** 子元素的排列方式 */
    direction: "vertical" | "horizontal";
    width: number | "auto";
    height: number | "auto";
    /** 子元素 */
    children: BuiltInPainterElementOption[];
}
export declare class PainterContainerElement extends PainterElement {
    option: OmitBaseOption<PainterContainerElementOption>;
    children: PainterElement[];
    childOffsetTop: number;
    childOffsetLeft: number;
    constructor(painter: Painter, option: PainterContainerElementOption, parent?: PainterElement);
    _layout(): Promise<{
        width: number;
        height: number;
    }>;
    private layoutChildren;
    private layoutChild;
    private calcContainerWidth;
    private calcContainerHeight;
    paint(): Promise<void>;
    childrenMaxWidth(): number;
    childrenMaxHeight(): number;
}
