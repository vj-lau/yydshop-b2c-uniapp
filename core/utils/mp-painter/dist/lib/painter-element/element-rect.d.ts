import Painter from "../painter";
import { PainterElementOption, PainterElement } from "./base";
import { OmitBaseOption, BorderRadius, BorderStyle, Color } from "../value";
import { BuiltInPainterFillStrokeOption } from "../painter-fill-stroke/index";
export interface PainterRectagleElementOption extends PainterElementOption {
    type: "rect";
    width: number;
    height: number;
    /**
     * 圆角
     *
     * - `number` 一个数字，四个角的圆角都使用设置的值
     * - `[number, number, number, number]` 四个数字的元组分别代表 **左上**、**右上**、**右下** 和 **左下** 的圆角值。
     */
    borderRadius: BorderRadius;
    /**
     * 背景颜色
     */
    background: BuiltInPainterFillStrokeOption;
    borderWidth: number;
    borderStyle: BorderStyle;
    borderColor: Color;
}
export declare class PainterRectagleElement extends PainterElement {
    option: OmitBaseOption<PainterRectagleElementOption>;
    constructor(painter: Painter, option: PainterRectagleElementOption, parent?: PainterElement);
    _layout(): {
        width: number;
        height: number;
    };
    paint(): void;
    private get shouldFill();
    private get shouldStroke();
    private applyFillStyle;
    private applyStrokeStyle;
    private paintByRect;
    private paintByPath;
}
