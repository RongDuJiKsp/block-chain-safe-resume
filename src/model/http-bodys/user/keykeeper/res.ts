import {BaseRes} from "../ress.ts";
import {AccessibleSubKeyInfo, UploadSubKeyRequestInfo} from "../../../entity/keykeeper.ts";

//kk上传子密钥的响应体
export interface UploadSubKeyRes extends BaseRes {

}

//kk下载子子密钥的响应
export interface DownloadSubKeysRes extends BaseRes {
    i: number;
    x: number;
    m: number;
    p: number;
}

//kk获取所有等待kk上传子密钥请求的列表
export interface RequestListRes extends BaseRes {
    list: UploadSubKeyRequestInfo[]
}

//kk获取所有可获取上传权限的子密钥
export interface AccessibleSubKeyListRes extends BaseRes {
    list: AccessibleSubKeyInfo[];
}
