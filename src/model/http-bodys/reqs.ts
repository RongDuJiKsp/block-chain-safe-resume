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
}

export interface RegisterRes extends BaseRes {
    message:string;
    "hashID": string,
    "identity": string,
    "ETHAccounts": string,
    "PrivateKeys": string,
}
export interface LoginReq{
    PrivateKeys:string;
    identity:UserIdentityEnum
}
