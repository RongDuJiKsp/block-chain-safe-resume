export interface CryptoOfHash{
    encryptedData(originalData:string,key:string):string;
    decryptedData(encryptedData: string, key: string):string;
    hashData (data: string):string;
}
export interface Web3Server{
    keyToAddress(privateKey:string):string;
}