/**
 * @interface DownloadFileReq
 * @property hash 文件的ipfs上对应的hash 文件的mime类型和文件名由客户端与区块链直接交互得到
 */
export interface DownloadFileReq {
    hash: string;
}