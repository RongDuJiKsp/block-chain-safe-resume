import {CSSProperties, ReactElement, ReactNode} from "react";

export interface UserFileSystem {
    downloadToFile(file: BinFile, prefix: string, suffix: string): Promise<void>;
    base64ToAscii(base64:string):string

}

export type ConfigTable<List extends string | number, ValuesType> = {
    [key in List]: ValuesType
}

export interface ComponentUtils {
    getIconLabel(labelValue: string, elementName: string, config?: CSSProperties): ReactNode;

    getQuestionLabel(labelValue: string, tipsValue: string): ReactNode;

    getIcon(element: string, config?: CSSProperties): ReactNode;

    getIconVal(element: string, val: string|number, config?: CSSProperties): ReactNode
}

export interface StepInformation {
    title: string;
    focusDescription: string;
    noFocusIcon: ReactElement;
    element: ReactElement
}