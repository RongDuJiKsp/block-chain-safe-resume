import {ReactElement, ReactNode} from "react";

export interface UserFileSystem {
    downloadToFile(file: BinFile, prefix: string, suffix: string): Promise<void>;

}

export type ConfigTable<List extends string | number, ValuesType> = {
    [key in List]: ValuesType
}

export interface ComponentUtils {
    getIconLabel(labelValue: string, elementName: string): ReactNode;

    getQuestionLabel(labelValue: string, tipsValue: string): ReactNode;

    getIcon(element: string): ReactNode;

    getIconVal(element: string, val: string|number): ReactNode
}

export interface StepInformation {
    title: string;
    focusDescription: string;
    noFocusIcon: ReactElement;
    element: ReactElement
}