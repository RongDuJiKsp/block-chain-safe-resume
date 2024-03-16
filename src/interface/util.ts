import {ReactNode} from "react";

export interface UserFileSystem {
    downloadToFile(file: BinFile, prefix: string, suffix: string): Promise<void>;

}

export type ConfigTable<List extends string | number, ValuesType> = {
    [key in List]: ValuesType
}
export interface ComponentUtils{
    getIconLabel(labelValue:string, elementName:string):ReactNode;
}