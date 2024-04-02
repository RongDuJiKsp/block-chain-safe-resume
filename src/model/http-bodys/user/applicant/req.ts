/**
 * @interface UploadFileReq
 * @property base64 文件的base64
 */
export interface UploadFileReq {
    base64: string;
}

//ap查看所有的简历申请请求
export interface GetRequestReq {
    ApAddress: string;
}

/**
 * @interface ApAuthorizeReq ap用户授权相应re查看自己的简历(分同意或不同意两种情况)
 * @property status int型,0表示不同意申请,1表示同意申请
 * @property ApAddress  ap用户地址
 * @property ReAddress re用户地址
 */
export interface ApAuthorizeReq {
    status: number;
    ApAddress: string;
    ReAddress: string;
}