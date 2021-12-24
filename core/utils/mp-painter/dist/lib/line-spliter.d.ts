/// <reference types="uni-app" />
import Painter from "./painter";
interface ILineSpliterContextOption {
    fontSize: number;
    lineClamp: number;
    width: number;
    painter: Painter;
    content: string;
}
export default class LineSpliterContext {
    fontSize: number;
    lineClamp: number;
    width: number;
    ctx: CanvasContext;
    painter: Painter;
    content: string;
    lines: string[];
    currentLineText: string;
    position: number;
    endPostion: number;
    isOverflow: boolean;
    isDry: boolean;
    isFull: boolean;
    constructor(option: ILineSpliterContextOption);
    split(): string[];
    minCharNumberInWidth(width: number): number;
    freeSpaceInCurrentLine(): number;
    adjustCharNumberInCurrentLine(charNumber: number): void;
    commitLine(): void;
    handleOverflow(): void;
    fillText(): void;
}
export {};
