import {UserIdentityEnum} from "../Enum/WorkEnum.ts";

export interface RegisterReq{
    /**
     * 用户身份
     */
    identity:UserIdentityEnum
    /**
     * 用户信息的hash
     */
    hash:string;
    /**
     * 用户昵称
     */
    nickname:string;
}