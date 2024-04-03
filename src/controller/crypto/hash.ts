import {SM4} from "gm-crypto";
import * as crypto from "crypto";
import {CryptoOfHash} from "../../model/interface/crypto";

export const cryptoOfHash: CryptoOfHash = {
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
    }

};
