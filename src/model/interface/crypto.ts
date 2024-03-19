import {HashedUserRegisterInformation} from "../entity/user.ts";

export interface CryptoOfHash{
    encryptedData(originalData:string,key:string):string;
    decryptedData(encryptedData: string, key: string):string;
    hashData (data: string):string;
}
export interface HashToTranslate{
    getHashOfUserInfo(info:HashedUserRegisterInformation):string;
}
export interface Web3Server{
    keyToAddress(privateKey:string):string;
}