/**
 * @interface UploadFileReq
 * @property base64 文件的base64 文件的mime类型和文件名由客户端与区块链直接交互得到
 */
export interface UploadFileReq {
    base64: string;
}