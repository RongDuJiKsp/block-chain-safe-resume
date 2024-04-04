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

/**
 * @interface GetDownloadHisReq .ap查看自己简历的被下载记录
 * @property ApUserName ap用户名(登陆时已经返回)
 */
export interface GetDownloadHisReq {
    ApUserName: string;
}

/**
 * @interface GetMoreFileMesReq ap查看简历其他信息(下载总次数，上传时间)
 * @property address ap用户地址(登陆时已经返回)
 */
export interface GetMoreFileMesReq {
    address: string;
}
