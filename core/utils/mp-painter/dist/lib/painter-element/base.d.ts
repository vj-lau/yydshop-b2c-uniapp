import Painter from "../painter";
import { Size, Position } from "../value";
export interface PainterElementOption {
    type: string;
    /** 定位方式 */
    position: Position;
    left: number;
    top: number;
}
export declare abstract class PainterElement {
    parent?: PainterElement;
    offsetTop: number;
    offsetLeft: number;
    left: number;
    top: number;
    contentHeight: number;
    contentWidth: number;
    position: Position;
    painter: Painter;
    constructor(painter: Painter, option: Partial<PainterElementOption>, parent?: PainterElement);
    protected abstract _layout(): Promise<Size> | Size;
    layout(): Promise<Size>;
    abstract paint(): void;
    get anchorX(): number;
    get anchorY(): number;
    get elementX(): number;
    get elementY(): number;
    get offsetHeight(): number;
    get offsetWidth(): number;
}
