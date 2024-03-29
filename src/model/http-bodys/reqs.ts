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
 * @interface ChangeNickReq 更改用户昵称的请求
 * @property nickname 用户将要改的名字
 * @property privateKey 用户的私钥 在后端计算为用户的地址然后读写数据库更改昵称
 */
export interface ChangeNickReq {
    nickname: string;
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

/**
 * @interface BaseRes 所有响应体的基类  也就是所有响应体都继承自该响应体
 * @property {number} status 响应状态码 0为失败响应 1为正常响应
 * @property {string} message 响应信息，当为正常响应时可以为空字符串
 */
export interface BaseRes {
    status: number;
    message: string;
}

/**
 * @interface RegisterRes 注册的响应体
 * @extends BaseRes
 * @property {string} privateKeys 用户注册的私钥
 * @property {number} S 用户注册得到的 S Key
 * @property {number} P 用户注册得到的 P Key
 * @property {number[]} M 用户注册得到的子密钥M
 * @property {number[]} X 用户注册得到的子密钥X
 */
export interface RegisterRes extends BaseRes {
    address: string,
    privateKeys: string,
    S: number,
    P: number,
    M: number[],
    X: number[],
}

/**
 * @interface LoginRes 登录接口
 * @extends BaseRes
 * @property address 用户私钥对应的地址
 * @property username 用户昵称
 * @property session  用户的会话标识
 */
export interface LoginRes extends BaseRes {
    address: string;
    username: string;
    session:string;
}

/**
 * @interface UploadRes 上传文件的响应体
 * @extends BaseRes
 * @property hash 上传文件时ipfs返回的hash
 */
export interface UploadRes extends BaseRes {
    hash: string;
}

/**
 * @interface DownloadRes
 * @extends BaseRes
 * @property base64 二进制文件的base64编码
 */
interface DownloadRes extends BaseRes {
    base64: string;
}

/**
 * 响应体设计的核心就是 传输的一定是可序列化对象 将对象序列化为json BaseRes为基类 剩下的字段随便搞 然后传输json
 */
export interface ResumeInfoRes extends BaseRes{
    putTime:string;
    downloadtimes:string;
}