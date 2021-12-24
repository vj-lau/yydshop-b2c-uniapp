import Painter from "../painter";
import { PainterTextElementOption } from "./element-text";
import { PainterElement } from "./base";
import { OmitBaseOption } from "../value";
export interface PainterTextBlockElementOption extends Omit<PainterTextElementOption, "type"> {
    type: "text-block";
    /** 行高 */
    lineHeight: number;
    /** 文本块的最大行数 */
    lineClamp: number;
    /** 文本块的宽度 */
    width: number;
    height: number | "auto";
}
export declare class PainterTextBlockElement extends PainterElement {
    option: OmitBaseOption<Partial<PainterTextBlockElementOption> & Pick<PainterTextBlockElementOption, "fontSize" | "width" | "height" | "lineClamp" | "content" | "lineHeight" | "top" | "color">>;
    lines: string[];
    constructor(painter: Painter, option: PainterTextBlockElementOption, parent?: PainterElement);
    _layout(): {
        width: number;
        height: number;
    };
    paint(): Promise<void>;
}
