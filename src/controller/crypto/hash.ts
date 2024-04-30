import {SM3, SM4} from "gm-crypto";
import * as crypto from "crypto";
import {CryptoSystem} from "../../model/interface/crypto";
import {FileSystemImpl} from "../util/InteractiveSystem.ts";

export const CryptoSystemImpl: CryptoSystem = {

    async encryptedFileAsync(originalData: MetaFile, key: string): Promise<MetaFile> {
        return FileSystemImpl.arrayBufferToFile(this.encryptedBin(await FileSystemImpl.readFileAsArrayBufferAsync(originalData), key), originalData.name, originalData.type);
    },
    async decryptedFileAsync(encryptedBinData: MetaFile, key: string): Promise<MetaFile> {
        return FileSystemImpl.arrayBufferToFile(this.decryptedBin(await FileSystemImpl.readFileAsArrayBufferAsync(encryptedBinData), key), encryptedBinData.name, encryptedBinData.type);
    },
    encryptedBin(originalBinData: ArrayBuffer, key: string): ArrayBuffer {
        return SM4.encrypt(originalBinData, key, {
            inputEncoding: "binary"
        });
    },
    decryptedBin(encryptedBinData: ArrayBuffer, key: string): ArrayBuffer {
        return SM4.decrypt(encryptedBinData, key, {
            inputEncoding: "binary"
        });
    },
    encryptedData(originalData, key) {
        return SM4.encrypt(originalData, key, {
            inputEncoding: 'utf8',
            outputEncoding: 'base64'
        });
    },
    decryptedData: (encryptedData, key) => {
        return SM4.decrypt(encryptedData, key, {
            inputEncoding: 'base64',
            outputEncoding: 'utf8'
        });
    },
    hashData: (data) => {
        const hash = crypto.createHash('md5');
        hash.update(data);
        return hash.digest('hex');
    },
    hashDataBySM3(data: string): string {
        return SM3.digest(data, "ascii", "hex");
    },


};
