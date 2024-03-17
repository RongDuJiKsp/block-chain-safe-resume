import {UserIdentityEnum} from "../Enum/WorkEnum.ts";

export interface RegisterReq {
    /**
     * 用户身份
     */
    identity: UserIdentityEnum
    /**
     * 用户信息的hash
     */
    hashID: string;
    /**
     * 用户昵称
     */
    nickname: string;
}

export interface BaseRes {
    status: number;
    message:string;
}

export interface RegisterRes extends BaseRes {
    "hashID": string,
    "identity": string,
    "ETHAccounts": string,
    "PrivateKeys": string,
}