import {GetFileTemplate} from "../../model/interface/util.ts";

export const FileTempleHandleImpl: GetFileTemplate = {
    getKeyKeeperSubKey(X: number, M: number, P: number, NO: number, apName: string, apAddress: string, kkAddress: string): string {
        return `This Sub Key Handled By ${kkAddress} , of ${apAddress} for ${apName} .This is ${NO}th SubKey
        The KeyPair is (P,X,M) with values (${P},${X},${M})
        `;
    },
    getRegisterKey(privateKey: string, S: string): string {
        return `Please keep your  key, once lost, you can't get it back!
        PrivateValue : ${privateKey}
        SafeKey : ${S}
        You can login with PrivateValue and verify with SafeKey and Find SafeKey with SubSafeKey
        `;
    }

};