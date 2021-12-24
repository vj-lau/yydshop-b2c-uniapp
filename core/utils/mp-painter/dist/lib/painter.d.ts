/// <reference types="uni-app" />
import { UniPlatforms } from "../utils/platform";
import { BuiltInPainterElementOption } from "./painter-element/index";
import { FillStrokeStyle } from "./value";
interface IPanterOption {
    upx2px?: (upx: number) => number;
    platform?: UniPlatforms;
}
export default class Painter {
    ctx: CanvasContext;
    upx2px: (upx: number) => number;
    platform: UniPlatforms;
    constructor(ctx: CanvasContext, { platform, upx2px }?: IPanterOption);
    draw(element: BuiltInPainterElementOption): Promise<import("./value").Size>;
    _drawObj(paintObj: BuiltInPainterElementOption): Promise<import("./value").Size>;
    /**
     * 兼容设置填充样式
     */
    setFillStyle(color: FillStrokeStyle): void;
    /**
     * 兼容设置描边样式
     */
    setStrokeStyle(color: FillStrokeStyle): void;
    measureText(text: string, fontSize: number): number;
    /** 兼容地，根据控制点和半径绘制圆弧路径 */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    /** 兼容绘制图片 */
    drawImage(imageResource: string, sx: number, sy: number, sWidth: number, sHeigt: number, dx: number, dy: number, dWidth: number, dHeight: number): any;
}
export {};
