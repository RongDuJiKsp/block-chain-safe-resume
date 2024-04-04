import {CryptoSystemImpl} from "../../controller/crypto/hash.ts";

export interface CryptoSystem {
    encryptedData(originalData: string, key: string): string;

    encryptedBin(originalBinData: ArrayBuffer, key: string): ArrayBuffer;

    encryptedFileAsync(originalData: MetaFile, key: string): Promise<MetaFile>;


    decryptedData(encryptedData: string, key: string): string;

    decryptedBin(encryptedBinData: ArrayBuffer, key: string): ArrayBuffer;

    decryptedFileAsync(encryptedBinData: MetaFile, key: string): Promise<MetaFile>;

    hashData(data: string): string;

    hashDataBySM3(data: string): string;

}


