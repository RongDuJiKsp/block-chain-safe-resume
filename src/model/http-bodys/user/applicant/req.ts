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
 * @property ApAddress ap用户名(登陆时已经返回)
 */
export interface GetDownloadHisReq {
    ApUserName: string;
    ApAddress: string;
}

/**
 * @interface GetMoreFileMesReq ap查看简历其他信息(下载总次数，上传时间)
 * @property ApAddress ap用户地址(登陆时已经返回)
 */
export interface GetMoreFileMesReq {
    ApAddress: string;
}

/**
 * @interface GetAllKKReq
 * @property ApAddress ap用户地址(登陆时已经返回)
 */
export interface GetAllKKReq {
    ApAddress: string;
}

/**
 * @interface PostOnekeyReq
 * @property KKAddress KK用户地址
 * @property ApAddress Ap用户地址
 * @property publicKeys kk公钥
 *  一组秘密份额 i,x,m
 */
export interface PostOnekeyReq {
    KKAddress: string;
    publicKeys: string;
    ApAddress: string;
    i: number
    x: number
    m: number
}

