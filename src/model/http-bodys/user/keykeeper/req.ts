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

/**
 * kk上传密钥
 * @interface UploadKeyReq
 * @property KKAddress kk地址登录时已经返回
 * @property ApAddress Ap求职者的地址
 * @property i 下标i,上传的是第几份份额
 * @property x  对应x
 * @property m  对应m
 */
export interface UploadKeyReq {
    KKAddress: string
    ApUserName: string
    i: number
    x: number
    m: number
}

/**
 * @interface GetFileMesReq
 * @property ApAddress  ap用户地址
 * @property ReAddress re用户的地址
 */
export interface GetFileMesReq {
    ApAddress: string;
    ReAddress: string;
}

/**
 * kk申请成功密钥保管人
 * @interface ChangeKKReq
 * @property KKAddress kk地址
 */
export interface ChangeKKReq {
    KKAddress: string
}

/** kk查看已经保管的秘密份额
 * @interface GetSaveReq
 * @property KKAddress kk用户地址(登陆时已经返回)
 */
export interface GetSaveReq {
    KKAddress: string;
}

/**
 * @interface KKDownloadKeyReq
 * @property KKAddress KK用户地址
 * @property ApAddress Ap用户地址
 * @property encryptPrivateKeys kk私钥
 */
export interface KKDownloadKeyReq {
    KKAddress: string
    ApAddress: string
    encryptPrivateKeys: string
}
