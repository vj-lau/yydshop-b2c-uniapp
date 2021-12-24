import Painter from "../painter";
import { FontWeight, BaseLine, TextAlign, OmitBaseOption, FontStyle, TextDecoration } from "../value";
import { PainterElementOption, PainterElement } from "./base";
import { BuiltInPainterFillStrokeOption } from "../painter-fill-stroke/index";
export interface PainterTextElementOption extends PainterElementOption {
    type: "text";
    /** 文字的颜色 */
    color: BuiltInPainterFillStrokeOption;
    /** 文字的字号 */
    fontSize: number;
    /** 文字的字重 */
    fontWeight: FontWeight;
    /** 文字的字型 */
    fontStyle: FontStyle;
    /** 文字的字体 */
    fontFamily: string;
    /** 锚点在垂直方向相对文字的位置 */
    baseline: BaseLine;
    /** 锚点在水平方向相对文字的位置 */
    align: TextAlign;
    /** 文本内容 */
    content: string;
    /** 文字的宽度，为空则根据文本内容及字号自动计算宽度 */
    width?: number;
    textDecoration: TextDecoration;
}
export declare class PainterTextElement extends PainterElement {
    option: OmitBaseOption<PainterTextElementOption>;
    constructor(painter: Painter, option: PainterTextElementOption, parent?: PainterElement);
    _layout(): {
        width: number;
        height: number;
    };
    paint({ inTextBlock }?: {
        inTextBlock?: boolean | undefined;
    }): void;
    private paintTextDecoration;
}
