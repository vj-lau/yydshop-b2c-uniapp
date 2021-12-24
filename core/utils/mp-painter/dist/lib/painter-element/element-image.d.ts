import Painter from "../painter";
import { PainterElementOption, PainterElement } from "./base";
import { ObjectFit, OmitBaseOption, ObjectPosition } from "../value";
export interface PainterImageElementOption extends PainterElementOption {
    type: "image";
    /**
     * 图片地址
     *
     * 可以使用网络图片地址或下载后的临时图片地址
     */
    src: string;
    width: number;
    height: number;
    /**
     * 图片的适应方式
     * - fill 拉伸图片以铺满容器
     * - contain 等比缩放，使图片刚好能完整显示出来
     * - cover 等比缩放，使图片更好能占满容器
     */
    objectFit?: ObjectFit;
    /**
     * 图片的位置
     * 默认为 `["center","center"]`
     */
    objectPosition?: ObjectPosition;
}
export declare class PainterImageElement extends PainterElement {
    option: OmitBaseOption<PainterImageElementOption>;
    constructor(painter: Painter, option: PainterImageElementOption, parent?: PainterElement);
    _layout(): {
        width: number;
        height: number;
    };
    paint(): Promise<void>;
}
