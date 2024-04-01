import {BaseRes} from "../ress.ts";
import {AccessibleSubKeyInfo} from "../../../entity/keykeeper.ts";

//kk上传子密钥的响应体
export interface UploadSubKeyRes extends BaseRes {

}

//kk获取所有等待kk上传子密钥请求的列表
export interface RequestListRes extends BaseRes {

}

//kk获取所有可获取上传权限的子密钥
export interface AccessibleSubKeyListRes extends BaseRes {
    list: AccessibleSubKeyInfo[];
}