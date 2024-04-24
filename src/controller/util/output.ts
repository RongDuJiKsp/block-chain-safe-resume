import {GetFileTemplate} from "../../model/interface/util.ts";

export const FileTempleHandleImpl: GetFileTemplate = {
    getKeyKeeperSubKey(X: string, M: string, NO: string, apName: string, kkName: string): string {
        return `This Sub Key Handled By ${kkName} , for ${apName} .This is [${NO}th] SubKey
        The KeyPair is (P,X,M) with values (${NO},${X},${M})
        `;
    },
    getRegisterKey(privateKey: string, SKey: string): string {
        return `Please keep your  key, once lost, you can't get it back!
        PrivateValue : ${privateKey}
        You can login with PrivateValue 
        SafeKey : ${SKey}
         `;
    },
    getApInfo(ApName: string, ApAddressString: string): string {
        return `The Search Result is
        ApName : ${ApName},
        ApAddress : ${ApAddressString}
        `;
    }

};