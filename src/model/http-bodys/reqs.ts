import {UserIdentityEnum} from "../Enum/WorkEnum.ts";

export interface RegisterReq {
    identity: UserIdentityEnum
    hashID: string;
    username: string;
}

export interface BaseRes {
    status: number;
}

export interface RegisterRes extends BaseRes {
    message: string
    username: string;
    hashID: string;
    identity: UserIdentityEnum,
    ETHAccounts: string,
    PublicKeys: string,
    PrivateKeys: string,
    S: number,
    P: number,
    M: number[],
    X: number[],
}

export interface LoginReq {
    PrivateKeys: string;
    username: string;
    identity: UserIdentityEnum;
}
