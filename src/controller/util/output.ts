import {GetFileTemplate} from "../../model/interface/util.ts";

export const FileTempleHandleImpl: GetFileTemplate = {
    getKeyKeeperSubKey(X: string, M: string, P: string, NO: string, apName: string, kkName: string): string {
        return `This Sub Key Handled By ${kkName} , for ${apName} .This is [${NO}th] SubKey
        The KeyPair is (P,X,M) with values (${P},${X},${M})
        `;
    },
    getRegisterKey(privateKey: string, SKey: string, X: number[], M: number[], kkEncryptPrivateKey: string): string {
        return `Please keep your  key, once lost, you can't get it back!
        PrivateValue : ${privateKey}
        You can login with PrivateValue 
        SafeKey : ${SKey}
        If You Are Applicant ,You Need to Upload With SubKey
        Pairs: ${X&&X.map((X, index): string => `(${index},${X},${M[index]})`)}
        If You Are Applicant ,You Need to Distribution SubKey with (i,x,m) pair
        PrivateKey: 
        ${kkEncryptPrivateKey}
        If You Are KeyKeeper You Need To get SubKey With PrivateKey
         `;
    },
    getApInfo(ApName: string, ApAddressString: string): string {
        return `The Search Result is
        ApName : ${ApName},
        ApAddress : ${ApAddressString}
        `;
    }

};