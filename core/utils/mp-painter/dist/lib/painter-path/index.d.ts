import { PainterElement } from "../painter-element/base";
import { PainterRoundedRectanglePath, PainterRoundedRectanglePathOption } from "./path-rounded-rect";
export declare type BuiltInPainterPathOption = PainterRoundedRectanglePathOption;
export declare function createPath(element: PainterElement, option: BuiltInPainterPathOption): PainterRoundedRectanglePath;
