import { PainterElement } from "../painter-element/base";
export interface PainterPathOption {
    type: string;
    left?: number;
    top?: number;
}
export declare abstract class PainterPath {
    element: PainterElement;
    left: number;
    top: number;
    constructor(element: PainterElement, option: PainterPathOption);
    get painter(): import("../painter").default;
    get pathX(): number;
    get pathY(): number;
    abstract paint(): void;
}
