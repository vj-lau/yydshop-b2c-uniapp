import Painter from "../painter";
import { PainterElementOption, PainterElement } from "./base";
import { BuiltInPainterElementOption } from "./index";
import { BuiltInPainterPathOption } from "../painter-path/index";
import { PainterPath } from "../painter-path/base";
export interface PainterClipElementOption extends PainterElementOption {
    type: "clip";
    /** 裁剪使用的路径 */
    path: BuiltInPainterPathOption;
    /** 被裁剪的内容 */
    content: BuiltInPainterElementOption;
}
export declare class PainterClipElement extends PainterElement {
    contentElement: PainterElement;
    clipPath: PainterPath;
    constructor(painter: Painter, option: PainterClipElementOption, parent?: PainterElement);
    _layout(): Promise<import("../value").Size>;
    paint(): Promise<void>;
}
