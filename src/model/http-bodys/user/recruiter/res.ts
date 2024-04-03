import {ApSearchInfo, ConnectingResumeInfo} from "../../../entity/recruiter.ts";
import {BaseRes} from "../ress.ts";

/**
 * @interface DownloadRes
 * @extends BaseRes
 * @property base64 二进制文件的base64编码
 */
interface DownloadRes extends BaseRes {
    base64: string;
}

//rc请求许可的响应体
export interface RequestResumeLicensingRes extends BaseRes {

}

//rc获取所有正在等待响应和还在有效期内的简历请求列表的响应体
export interface RecruiterResumeStatusListRes extends BaseRes {
    list: ConnectingResumeInfo[];
}

/**
 * @interface SearchApRes
 * @property ApUserName ap用户名 string
 * @property ApAddress ap用户地址 string
 * */
export interface SearchApRes extends BaseRes {
    list: ApSearchInfo[];
}