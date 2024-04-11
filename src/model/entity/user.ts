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
    name:string;
    address:string;
    publicKey:string;
}
