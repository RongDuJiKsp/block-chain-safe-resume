//获取kk能够保存的子密钥列表的请求
export interface GetNeedSaveReq {
    KKAddress: string;
}

//获取kk保存的子密钥的请求
export interface SavePartReq {
    userName: string;
    address: string;
    KKAddress: string;
}

/**
 * 列出所有需要kk上传密钥的用户
 * @interface RemindKKReq
 * @property KKAddress kk地址登录时已经返回
 */
export interface RemindKKReq {
    KKAddress: string;
}