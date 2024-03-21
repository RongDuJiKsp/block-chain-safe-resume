import {SM4} from "gm-crypto";
import crypto from "crypto";
import {CryptoOfHash, HashToTranslate} from "../../model/interface/crypto";
import {HashedUserRegisterInformation} from "../../model/entity/user.ts";

export const cryptoOfHash: CryptoOfHash = {
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
};
export const hashToTranslate: HashToTranslate = {
    getHashOfUserInfo(info: HashedUserRegisterInformation): string {
        return cryptoOfHash.hashData(JSON.stringify(info));
    }

};