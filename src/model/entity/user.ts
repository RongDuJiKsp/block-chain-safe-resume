import {UserIdentityEnum} from "../Enum/WorkEnum.ts";

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
