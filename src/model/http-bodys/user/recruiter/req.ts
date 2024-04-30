/**
 * @interface DownloadFileReq
 * @property fileHash 文件的ipfs上对应的hash 文件的mime类型和文件名由客户端与区块链直接交互得到
 * @property ApUserName 要被下载的ap用户名
 * @property ReUserName 下载者re用户名
 */
export interface DownloadFileReq {
    fileHash: string;
    ApUserName: string;
    ReUserName: string;
}

/**
 * @interface RecAuthorizeReq re请求授权查看简历
 * @property ApUserName ap用户名
 * @property ApAddress  ap用户地址
 * @property ReAddress re用户地址
 */
export interface RecAuthorizeReq {
    ApUserName: string;
    ApAddress: string;
    ReAddress: string;
}

/**
 * @interface RecAlreadyAuthorizeReq
 * @property ReAddress re用户地址(登陆时已经返回)
 */
export interface RecAlreadyAuthorizeReq {
    ReAddress: string;
}

/**
 * @interface SearchApReq .re模糊查找ap
 * @property partApUserName ap用户名部分
 */
export interface SearchApReq {
    partApUserName: string;
}