import {UserIdentityEnum} from "../Enum/WorkEnum.ts";
import {ReactNode} from "react";


export interface UserGroup {
    userHeader: ReactNode;
    userIdentity: string;
}


export interface BasicUserState {
    nick: string;
    identity: UserIdentityEnum;
    address: string;
}

export interface BasicEncryptInfo {
    name: string;
    address: string;
    publicKey: string;
}

export interface BasicInfo {
    userName: string;
    address: string;
}

export interface DocumentTraceabilityInformation {
    fileName: string;
    waterMaskContext: string;
    blockCharinData: Record<string, string | Record<string, string>>;
    fromAddress: string;
    fromName: string | null;
    toAddress: string;
    toName: string | null
}