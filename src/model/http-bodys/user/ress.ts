/**
 * @interface BaseRes 所有响应体的基类  也就是所有响应体都继承自该响应体
 * @property {number} status 响应状态码 0为失败响应 1为正常响应
 * @property {string} message 响应信息，当为正常响应时可以为空字符串
 */
export interface BaseRes {
    status: number;
    message: string;
}

/**
 * @interface RegisterRes 注册的响应体
 * @extends BaseRes
 * @property {string} privateKeys 用户注册的私钥
 * @property {number} S 用户注册得到的 S Key
 * @property {number} P 用户注册得到的 P Key
 * @property {number[]} M 用户注册得到的子密钥M
 * @property {number[]} X 用户注册得到的子密钥X
 */
export interface RegisterRes extends BaseRes {
    address: string,
    privateKeys: string,
    S: number,
    P: number,
    M: number[],
    X: number[],
}

/**
 * @interface LoginRes 登录接口
 * @extends BaseRes
 * @property address 用户私钥对应的地址
 * @property userName 用户昵称
 * @property session  用户的会话标识
 */
export interface LoginRes extends BaseRes {
    address: string;
    userName: string;
    session: string;
}

//更改昵称的响应体
export interface ChangeNameRes extends BaseRes {
    newName: string;
}

