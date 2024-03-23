import {UserIdentityEnum} from "../Enum/WorkEnum.ts";
import {ReactNode} from "react";

export interface BasicUserInfo {
    nick: string;
    hash: string;
    privateKey: string;
    identity: UserIdentityEnum;
}

export interface HashedUserRegisterInformation {
    userIdentity: UserIdentityEnum;
    userName: string;
    userIDCard: string;
    userAnoKey: string;
}
export interface UserGroup{
    userHeader:ReactNode;
    userIdentity:string;
}