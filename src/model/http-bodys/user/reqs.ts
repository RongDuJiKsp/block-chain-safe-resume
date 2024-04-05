import {UserIdentityEnum} from "../../Enum/WorkEnum.ts";

export interface RegisterReq {
    identity: UserIdentityEnum
}

export interface LoginReq {
    privateKeys: string;
    identity: UserIdentityEnum;
}

/**
 * @interface ChangeNameReq 更改用户昵称的请求
 * @property oldName 用户将要改的名字
 * @property newName 用户的新名字
 * @property identity 用户身份信息
 * @property privateKey 用户的私钥 在后端计算为用户的地址然后读写数据库更改昵称
 */
export interface ChangeNameReq {
    oldName: string;
    newName: string;
    identity: string;
    privateKey: string;
}

