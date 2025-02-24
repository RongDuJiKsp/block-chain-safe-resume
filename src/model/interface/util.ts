import {CSSProperties, ReactElement, ReactNode} from "react";

export interface UserFileSystem {
    downloadToFileFromSuffixAsync(file: BinFile, prefix: string, suffix: string): Promise<void>;

    downloadToFileAsNameAsync(file: BinFile, name: string): Promise<void>;

    downloadMetaFileAsync(file: MetaFile): Promise<void>;

    readFileAsBase64Async(file: MetaFile): Promise<string>;

    readBase64AsBlob(base64: string, type: string): BinFile;

    base64ToAscii(base64: string): string;

    readFileAsArrayBufferAsync(file: MetaFile): Promise<ArrayBuffer>;

    arrayBufferToFile(arrayBuffer: ArrayBuffer, fileName: string, fileType: string): MetaFile

    writeTextToClipboard(text: string): boolean;

    readFileAsTextAsync(file: MetaFile): Promise<string>;

    buildFormWithFile(fieldName: string, file: MetaFile): FormData;

    addWaterMaskToPDF(file: MetaFile): Promise<MetaFile>;

}

export type ConfigTable<List extends string | number, ValuesType> = {
    [key in List]: ValuesType
}

export interface ComponentUtils {
    getIconLabel(labelValue: string, elementName: string, config?: CSSProperties): ReactNode;

    getQuestionLabel(labelValue: string, tipsValue: string): ReactNode;

    getIcon(element: string, config?: CSSProperties): ReactNode;

    getIconVal(element: string, val: string | number, config?: CSSProperties): ReactNode
}

export interface StepInformation {
    title: string;
    focusDescription: string;
    noFocusIcon: ReactElement;
    element: ReactElement
}

export interface GetFileTemplate {
    getRegisterKey(SKey: string, userName: string): string;

    getKeyKeeperSubKey(X: string, M: string, NO: string, apName: string, kkName: string): string;

    getApInfo(ApName: string, ApAddressString: string): string;
}