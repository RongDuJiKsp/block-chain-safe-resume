import {GetFileTemplate} from "../../model/interface/util.ts";

export const FileTempleHandleImpl: GetFileTemplate = {
    getKeyKeeperSubKey(X: string, M: string, NO: string, apName: string, kkName: string): string {
        return `This Sub Key Handled By ${kkName} , for ${apName} .This is [${NO}th] SubKey
        The KeyPair is (P,X,M) with values (${NO},${X},${M})
        `;
    },
    getRegisterKey(SKey: string, userName: string): string {
        return `
        Dear ${userName}  
        If You Are Applicant You Need To Encrypt With SafeKey
        SafeKey : ${SKey}
        If You Are BackChecker,You Will Received A Key File,DO NOT LOST IT
         `;
    },
    getApInfo(ApName: string, ApAddressString: string): string {
        return `The Search Result is
        ApName : ${ApName},
        ApAddress : ${ApAddressString}
        `;
    }

};