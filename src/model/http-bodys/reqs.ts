import {UserIdentityEnum} from "../Enum/WorkEnum.ts";

export interface RegisterReq {
    identity: UserIdentityEnum
    hashID: string;
    userName: string;
}

export interface LoginReq {
    privateKeys: string;
    /**
     * 登录用户不需要输入用户昵称，数据库将用户地址和用户昵称对应，
     * 用户登录时用用户私钥计算用户地址，将地址和昵称一并返回
     * webase计算私钥传入的用户昵称暂时使用时间戳 这个字段会被弃用
     * @description
     */
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

/**
 * @interface UploadFileReq
 * @property base64 文件的base64 文件的mime类型和文件名由客户端与区块链直接交互得到
 */
export interface UploadFileReq {
    base64: string;
}
/**
 * @interface DownloadFileReq
 * @property hash 文件的ipfs上对应的hash 文件的mime类型和文件名由客户端与区块链直接交互得到
 */
export interface DownloadFileReq {
    hash: string;
}

