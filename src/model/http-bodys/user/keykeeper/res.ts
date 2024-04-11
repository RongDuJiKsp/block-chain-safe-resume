import {BaseRes} from "../ress.ts";
import {AccessibleSubKeyInfo, UploadSubKeyRequestInfo} from "../../../entity/keykeeper.ts";
import {BasicInfo} from "../../../entity/user.ts";

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

/**
 * @interface GetFileMesRes
 * @extends BaseRes
 * @property s 对称密钥s
 * @property fileName 文件名
 * @property fileType 文件类型
 * @property fileHash 文件hash
 */
export interface GetFileMesRes extends BaseRes {
    s: number;
    fileName: string;
    fileType: string;
    fileHash: string;
}

/**
 * @interface ChangeKKRes kk成为合法的保管人
 */
export interface ChangeKKRes extends BaseRes {
}

//kk查看已经保管的秘密份额
export interface GetSavedRes extends BaseRes {
    list: BasicInfo[];
}
/**
 * @interface KKDownloadKeyRes
 */
export interface KKDownloadKeyRes extends BaseRes{
    i: number
    x: number
    m: number
}