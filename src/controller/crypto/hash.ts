import {SM4} from "gm-crypto"
import crypto from "crypto"
import {CryptoOfHash} from "../../interface/crypto";

export const cryptoOfHash: CryptoOfHash = {
    encryptedData(originalData, key) {
        return SM4.encrypt(originalData, key, {
            inputEncoding: 'utf8',
            outputEncoding: 'base64'
        })
    },
    decryptedData: (encryptedData, key) => {
        return SM4.decrypt(encryptedData, key, {
            inputEncoding: 'base64',
            outputEncoding: 'utf8'
        })
    },
    hashData: (data) => {
        const hash = crypto.createHash('md5');
        hash.update(data);
        return hash.digest('hex');
    },
}