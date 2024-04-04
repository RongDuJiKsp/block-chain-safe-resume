import {BaseRes} from "../ress.ts";
import {ResumeLicenseRequestInfo, ResumeVisitHistoryInfo} from "../../../entity/applicant.ts";

/**
 * 响应体设计的核心就是 传输的一定是可序列化对象 将对象序列化为json BaseRes为基类 剩下的字段随便搞 然后传输json
 */

//ap获取的简历信息
export interface ResumeInfoRes extends BaseRes {
    putTime: number;
    downloadtimes: number;
}

//ap获取向ap请求响应的rc的列表
export interface ResumeQuestListRes extends BaseRes {
    list: ResumeLicenseRequestInfo[];
}

//ap获取向ap请求简历的rc的历史
export interface ResumeRequestHistoryListRes extends BaseRes {
    list: ResumeVisitHistoryInfo[];
}

//ap同意或者拒绝rc发起的请求的响应体
export interface GiveOrDelayResumeLicensingRes extends BaseRes {

}

/**
 * @interface UploadRes 上传文件的响应体
 * @extends BaseRes
 * @property hash 上传文件时ipfs返回的hash
 */
export interface UploadRes extends BaseRes {
    hash: string;
}