import {useAtom, useAtomValue} from "jotai";
import {
    BasicEncryptInfo,
    BasicInfo,
    BasicUserState,
    DocumentTraceabilityInformation
} from "../../../model/entity/user.ts";
import {AtomHooks} from "../../../model/interface/hooks.ts";
import {createAlova} from "alova";
import ReactHook from "alova/react";
import GlobalFetch from "alova/GlobalFetch";
import {SERVER_URLS, STORAGE_KEY_CONFIG} from "../../../config/net.config.ts";
import {ChangeNameReq, GetTokenReq, GetTransResultReq, LoginReq} from "../../../model/http-bodys/user/reqs.ts";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {BasisSyncStorage, FileSystemImpl} from "../../util/InteractiveSystem.ts";
import {atomWithStorage} from "jotai/utils";
import {
    ArrayRes,
    ChangeNameRes,
    GetTokenRes,
    GetTransResultRes,
    JavaServerRes,
    LoginRes
} from "../../../model/http-bodys/user/ress.ts";
import {
    GiveOrDelayResumeLicensingRes,
    KKInfoForSendListRes,
    ResumeInfoRes,
    ResumeQuestListRes,
    ResumeRequestHistoryListRes,
    SendSubKeyToKKRes,
    UploadRes
} from "../../../model/http-bodys/user/applicant/res.ts";
import {
    AccessibleSubKeyListRes,
    ChangeKKRes,
    GetFileMesRes,
    GetSavedRes,
    KKDownloadKeyRes,
    RequestListRes,
    ToBeAuditedResume,
    UploadSubKeyRes
} from "../../../model/http-bodys/user/keykeeper/res.ts";
import {
    DownloadRes,
    RecruiterResumeStatusListRes,
    RequestResumeLicensingRes,
    SearchApRes
} from "../../../model/http-bodys/user/recruiter/res.ts";
import {
    ChangeKKReq,
    GetFileMesReq,
    GetNeedSaveReq,
    GetSaveReq,
    RemindKKReq,
    UploadKeyReq
} from "../../../model/http-bodys/user/keykeeper/req.ts";
import {AccessibleSubKeyInfo, UploadSubKeyRequestInfo} from "../../../model/entity/keykeeper.ts";
import {
    DownloadFileReq,
    RecAlreadyAuthorizeReq,
    RecAuthorizeReq,
    SearchApReq
} from "../../../model/http-bodys/user/recruiter/req.ts";
import {ApSearchInfo, ConnectingResumeInfo} from "../../../model/entity/recruiter.ts";
import {
    ApAuthorizeReq,
    GetAllKKReq,
    GetDownloadHisReq,
    GetMoreFileMesReq,
    GetRequestReq,
    PostOnekeyReq
} from "../../../model/http-bodys/user/applicant/req.ts";
import {
    CheckingSelfResumeStatus,
    ResumeLicenseRequestInfo,
    ResumeVisitHistoryInfo
} from "../../../model/entity/applicant.ts";
import {CryptoSystemImpl} from "../../crypto/hash.ts";
import {AlgorithmSystemImpl} from "../../crypto/algorithm.ts";
import {fileTypeFromBlob} from "file-type/core";

const alovaClientImpl = createAlova({
    statesHook: ReactHook,
    requestAdapter: GlobalFetch(),
    responded: (response) => {
        return response.json();
    },
    baseURL: SERVER_URLS.backendUrl
});
const alovaClientJavaImpl = createAlova({
    statesHook: ReactHook,
    requestAdapter: GlobalFetch(),
    responded: (response) => {
        return response.json();
    },
    baseURL: SERVER_URLS.javaBackendUrl,
    localCache: null
});
const alovaClientJavaFileImpl = createAlova({
    statesHook: ReactHook,
    requestAdapter: GlobalFetch(),
    baseURL: SERVER_URLS.javaBackendUrl,
    responded: async (response) => {
        const blob = await response.blob();
        const types = await fileTypeFromBlob(blob);
        if (!types) return new File([blob], "unknown-file");
        return new File([blob], "resume-file." + types.ext, {type: types.mime});
    }
});


const userInfoAtom = atomWithStorage<BasicUserState | null>(STORAGE_KEY_CONFIG.userState, null, new BasisSyncStorage<BasicUserState | null>(), {
    getOnInit: true
});


interface UserWorkValue {
    userInfo: BasicUserState | null;
}

interface UserWorkMethod {

    loginAsync(username: string, pwd: string, identity: UserIdentityEnum): Promise<LoginRes>;

    logout(): void;

    changeUserNameAsync(newName: string): Promise<ChangeNameRes>;

    getTokenNumberAsync(): Promise<GetTokenRes>;

}

export const UserWorkHooks: AtomHooks<UserWorkValue, UserWorkMethod> = {
    useValue(): UserWorkValue {
        const value = useAtomValue(userInfoAtom);
        return {
            userInfo: value
        };
    },
    useMethod(): UserWorkMethod {
        const [info, setInfo] = useAtom(userInfoAtom);

        return {
            async getTokenNumberAsync(): Promise<GetTokenRes> {
                if (info === null) throw "在未登录的情况下尝试获取token";
                const req: GetTokenReq = {
                    address: info.address
                };
                return alovaClientImpl.Post("/GetBalanceReq", req);
            },
            async changeUserNameAsync(newName: string): Promise<ChangeNameRes> {
                if (info === null) throw "在未登录的情况下尝试修改用户名";
                const request: ChangeNameReq = {
                    oldName: info.nick,
                    newName: newName,
                    identity: info.identity,
                    address: info.address
                };
                const response = await alovaClientImpl.Post<ChangeNameRes>("/ChangeNameReq", request);
                if (response.status) {
                    setInfo({...info, nick: response.newName});
                }
                return response;
            },
            logout(): void {
                setInfo(null);
            },
            async loginAsync(username: string, pwd: string, identity: UserIdentityEnum): Promise<LoginRes> {

                const reqBody: LoginReq = {
                    identity,
                    userName: username,
                    password: pwd,
                };
                const res = await alovaClientImpl.Post<LoginRes>("/LoginReq", reqBody);
                console.log("login User", res);
                if (!res.status) throw res.message;
                const info: BasicUserState = {
                    identity: identity, nick: res.userName, address: res.address
                };
                setInfo(info);
                return res;
            },
        };
    }
};

interface ApplicantWorkMethod {
    encryptedAndUpdateResumeAsync(File: MetaFile, S: string): Promise<UploadRes>;

    getResumeInfoAsync(): Promise<ResumeInfoRes>;

    getResumeRequestListAsync(): Promise<ResumeQuestListRes>;

    giveOrDelayResumeLicensingAsync(ReAddress: string, status: number): Promise<GiveOrDelayResumeLicensingRes>;

    getResumeRequestHistoryListAsync(): Promise<ResumeRequestHistoryListRes>;

    getKKInfoForSendListAsync(): Promise<KKInfoForSendListRes>;

    sendSubKeyToKKAsync(X: string, M: string, i: string, kkPublicKey: string, kkAddress: string): Promise<SendSubKeyToKKRes>;

    getCheckingSelfResumeStatusList(): Promise<JavaServerRes<CheckingSelfResumeStatus[]>>;
}

export const ApplicantWorkHooks: AtomHooks<null, ApplicantWorkMethod> = {
    useMethod(): ApplicantWorkMethod {
        const userInfo = useAtomValue(userInfoAtom);
        return {
            async sendSubKeyToKKAsync(X: string, M: string, i: string, kkPublicKey, kkAddress: string): Promise<SendSubKeyToKKRes> {
                if (userInfo === null) throw "在未登录时分发kk秘密份额";
                const req: PostOnekeyReq = {
                    i: Number(i),
                    x: Number(X),
                    m: Number(M),
                    publicKeys: kkPublicKey,
                    KKAddress: kkAddress,
                    ApAddress: userInfo.address
                };
                console.log(req);
                const res = await alovaClientImpl.Post<SendSubKeyToKKRes>("/PostOnekeyReq", req);
                console.log(res);
                return res;
            },
            async getKKInfoForSendListAsync(): Promise<KKInfoForSendListRes> {
                if (userInfo === null) throw "在未登录时获取kk列表";
                const req: GetAllKKReq = {
                    ApAddress: userInfo.address
                };
                const res = await alovaClientImpl.Post<ArrayRes>("/GetAllKKReq", req);
                return {
                    status: res.status,
                    message: res.message,
                    list: res.status ? res.list.map((val): BasicEncryptInfo => ({
                        name: val[0],
                        address: val[1],
                        publicKey: val[2]
                    })) : []
                };
            },
            async getResumeRequestHistoryListAsync(): Promise<ResumeRequestHistoryListRes> {
                if (userInfo === null) throw "在未登录时获取简历历史记录信息";
                const req: GetDownloadHisReq = {
                    ApUserName: userInfo.nick,
                    ApAddress: userInfo.address
                };
                const res = await alovaClientImpl.Post<ArrayRes>("/GetDownloadHisReq", req);
                return {
                    status: res.status,
                    message: res.message,
                    list: res.status ? res.list.map((val): ResumeVisitHistoryInfo => ({
                        ReUserName: val[1],
                        downloadTime: val[2]
                    })) : []
                };
            },
            async getResumeRequestListAsync(): Promise<ResumeQuestListRes> {
                if (userInfo === null) throw "在未登录时获取简历申请记录信息";
                const req: GetRequestReq = {
                    ApAddress: userInfo.address,
                };
                const res = await alovaClientImpl.Post<ArrayRes>("/GetRequestReq", req);
                const goData: ResumeQuestListRes = {
                    status: res.status,
                    message: res.message,
                    list: res.status ? res.list.map((val): ResumeLicenseRequestInfo => ({
                        username: val[2],
                        address: val[3],
                        status: Number(val[4])
                    })) : []
                };
                goData.list.sort((a: ResumeLicenseRequestInfo, b: ResumeLicenseRequestInfo) => a.status - b.status);
                return goData;
            },
            async giveOrDelayResumeLicensingAsync(ReAddress: string, status: number): Promise<GiveOrDelayResumeLicensingRes> {
                if (userInfo === null) throw "在未登录时操作验证";
                const req: ApAuthorizeReq = {
                    ReAddress, status, ApAddress: userInfo.address
                };
                return alovaClientImpl.Post("/ApAuthorizeReq", req);

            },
            async getResumeInfoAsync(): Promise<ResumeInfoRes> {
                if (userInfo === null) throw "在未登录时获取简历申请记录信息";
                const req: GetMoreFileMesReq = {
                    ApAddress: userInfo.address
                };
                return alovaClientImpl.Post<ResumeInfoRes>("/GetMoreFileMesReq", req);
            },
            async encryptedAndUpdateResumeAsync(file: MetaFile, S: string): Promise<UploadRes> {
                if (userInfo === null) throw "在未登录时上传简历";
                const encryptedFile = await CryptoSystemImpl.encryptedFileAsync(file, S);
                await alovaClientJavaImpl.Put<JavaServerRes<string>>(`/files/${userInfo.nick}`, FileSystemImpl.buildFormWithFile('file', file));
                console.log("文件上传成功");
                return alovaClientImpl.Post<UploadRes>("/UploadReq", FileSystemImpl.buildFormWithFile('file', encryptedFile), {
                    params: {
                        address: userInfo.address,
                        userName: userInfo.nick
                    }
                });
            },
            async getCheckingSelfResumeStatusList(): Promise<JavaServerRes<CheckingSelfResumeStatus[]>> {
                if (userInfo === null) throw "在未登录时查询简历状态";
                return alovaClientJavaImpl.Get<JavaServerRes<CheckingSelfResumeStatus[]>>(`/check/user?resumeUsername=${userInfo.nick}`);
            }

        };
    },
    useValue(): null {
        return null;
    }

};

interface RecruiterWorkMethod {
    downloadResumeAsync(fileHash: string, SafeKey: string, ApUserName: string, name: string, type: string): Promise<MetaFile>;

    getFileMessageAsync(ApAddress: string): Promise<GetFileMesRes>;

    autoDownloadFile(ApAddress: string, ApUserName: string): Promise<void>;

    requestResumeLicensingAsync(ApUserName: string, ApAddress: string): Promise<RequestResumeLicensingRes>;

    getResumeStatusListAsync(): Promise<RecruiterResumeStatusListRes>;

    getFuzzyLookupListAsync(partApUserName: string): Promise<SearchApRes>;
}

export const RecruiterWorkHooks: AtomHooks<null, RecruiterWorkMethod> = {
    useMethod(): RecruiterWorkMethod {
        const userInfo = useAtomValue(userInfoAtom);
        const noStatusServer = UserWithNoneStatusWork.useMethod();
        return {
            async autoDownloadFile(ApAddress: string, ApUserName: string): Promise<void> {
                console.log(ApAddress, ApUserName);
                const chainMeta = await this.getFileMessageAsync(ApAddress);//获取待下载文件信息
                console.log(chainMeta);
                if (!chainMeta.status) throw chainMeta.message;
                const file = await this.downloadResumeAsync(chainMeta.fileHash, AlgorithmSystemImpl.calculateEncryptedKeyByS(String(chainMeta.s)), ApUserName, chainMeta.fileName, chainMeta.fileType);//下载并解密文件
                console.log("***", file);
                //为文件添加显水印
                const maskedFIle = await FileSystemImpl.addWaterMaskToPDF(file);
                //为文件添加隐水印
                const waterFile = await noStatusServer.writeWater(maskedFIle, chainMeta.reslut.transactionHash + "|" + ApAddress);
                //下载文件
                await FileSystemImpl.downloadMetaFileAsync(waterFile);
            },
            async getFileMessageAsync(ApAddress: string): Promise<GetFileMesRes> {
                if (userInfo === null) throw "未登录时尝试下载";
                const req: GetFileMesReq = {
                    ApAddress, ReAddress: userInfo.address
                };
                console.log(req);
                return alovaClientImpl.Post("/GetFileMesReq", req);
            },
            async getFuzzyLookupListAsync(partApUserName: string): Promise<SearchApRes> {
                const req: SearchApReq = {
                    partApUserName
                };
                const res = await alovaClientImpl.Post<ArrayRes>("/SearchApReq", req);
                return {
                    status: res.status,
                    message: res.message,
                    list: res.status ?
                        res.list.map((val): ApSearchInfo => ({ApUserName: val[0], ApAddress: val[1]}))
                        : []
                };
            },
            async downloadResumeAsync(fileHash: string, SafeKey: string, ApUserName: string, name: string, type: string): Promise<MetaFile> {
                if (userInfo === null) throw "未登录时尝试下载";
                const req: DownloadFileReq = {
                    fileHash, ApUserName, ReUserName: userInfo.nick
                };
                const res = await alovaClientImpl.Post<DownloadRes>("/DownloadFileReq", req);
                console.log("res:", res);
                const file = FileSystemImpl.readBase64AsBlob(res.base64, type);
                return await CryptoSystemImpl.decryptedFileAsync(new File([file], name, {type: type}), SafeKey);
            },
            async getResumeStatusListAsync(): Promise<RecruiterResumeStatusListRes> {
                if (userInfo === null) throw "未登录时尝试获取简历列表";
                const req: RecAlreadyAuthorizeReq = {
                    ReAddress: userInfo.address
                };
                const res = await alovaClientImpl.Post<ArrayRes>("/RecAlreadyAuthorizeReq", req);
                return {
                    status: res.status,
                    message: res.message,
                    list: res.status ? res.list.map((val): ConnectingResumeInfo => ({
                        ApUserName: val[0],
                        ApAddress: val[1],
                        ReAddress: val[2],
                        status: Number(val[3])
                    })) : []
                };
            },
            async requestResumeLicensingAsync(ApUserName: string, ApAddress: string): Promise<RequestResumeLicensingRes> {
                if (userInfo === null) throw "未登录时尝试获取授权";
                const req: RecAuthorizeReq = {
                    ApUserName, ApAddress, ReAddress: userInfo.address
                };
                return alovaClientImpl.Post<RequestResumeLicensingRes>("/RecAuthorizeReq", req);
            }
        };
    },
    useValue(): null {
        return null;
    }

};

interface KeyKeeperWorkMethod {
    uploadSubKeyAsync(ApUsername: string, i: number, x: number, m: number): Promise<UploadSubKeyRes>;

    downloadSubKeyAsync(encryptPrivateKeyFile: MetaFile, apAddress: string): Promise<KKDownloadKeyRes>;

    acceptOrDelayResumeAsync(isAccept: boolean, result: string, username: string): Promise<JavaServerRes<string>>;

    getRequestListAsync(): Promise<RequestListRes>;

    /**
     * @deprecated 改掉了
     */
    getAccessibleSubKeyListAsync(): Promise<AccessibleSubKeyListRes>;

    /**
     * @deprecated 改掉了
     */
    getPermissionToBeKK(): Promise<ChangeKKRes>;

    getSavedSubKeyListAsync(): Promise<GetSavedRes>;

    getToBeAuditedListAsync(): Promise<JavaServerRes<ToBeAuditedResume[]>>;

    downloadToBeAuthoredResume(apName: string): Promise<MetaFile>;


}

export const KeyKeeperWorkHook: AtomHooks<null, KeyKeeperWorkMethod> = {

    useMethod(): KeyKeeperWorkMethod {
        const userInfo = useAtomValue(userInfoAtom);
        return {
            async getSavedSubKeyListAsync(): Promise<GetSavedRes> {
                if (userInfo === null) throw "未登录时尝试获取保管列表";
                const req: GetSaveReq = {
                    KKAddress: userInfo.address
                };
                const res = await alovaClientImpl.Post<ArrayRes>("/GetSaveReq", req);
                console.log(res);
                return {
                    status: res.status,
                    message: res.message,
                    list: res.status ? res.list.map((val): BasicInfo => ({userName: val[0], address: val[1]})) : []
                };
            },
            async getPermissionToBeKK(): Promise<ChangeKKRes> {
                if (userInfo === null) throw "未登录时尝试获取权限";
                const req: ChangeKKReq = {
                    KKAddress: userInfo.address
                };
                return alovaClientImpl.Post<ChangeKKRes>("/ChangeKKReq", req);
            },
            async downloadSubKeyAsync(encryptPrivateKeyFile: MetaFile, apAddress: string): Promise<KKDownloadKeyRes> {
                console.log(encryptPrivateKeyFile);
                if (userInfo === null) throw "未登录时尝试获取秘密份额";
                const formData = new FormData();
                formData.append("file", encryptPrivateKeyFile);
                return alovaClientImpl.Post<KKDownloadKeyRes>(`/KKDownloadKeyReq?KKAddress=${userInfo.address}&ApAddress=${apAddress}`, formData);
            },
            async getAccessibleSubKeyListAsync(): Promise<AccessibleSubKeyListRes> {
                if (userInfo === null) throw "未登录时尝试上传";
                const req: GetNeedSaveReq = {
                    KKAddress: userInfo.address
                };
                const res = await alovaClientImpl.Post<ArrayRes>("/GetNeedSaveReq", req);
                return {
                    status: res.status,
                    message: res.message,
                    list: res.status ? res.list.map((val): AccessibleSubKeyInfo => ({
                        userName: val[0],
                        address: val[1],
                        amount: Number(val[2])
                    })) : []
                };

            },
            async getRequestListAsync(): Promise<RequestListRes> {
                if (userInfo === null) throw "未登录时尝试获取";

                const req: RemindKKReq = {
                    KKAddress: userInfo.address
                };
                const res = await alovaClientImpl.Post<ArrayRes>("/RemindKKReq", req);
                return {
                    status: res.status,
                    message: res.message,
                    list: res.status ?
                        res.list.map((val): UploadSubKeyRequestInfo => ({
                            ApUserName: val[0],
                            time: val[2]
                        })) : []
                };
            },
            async uploadSubKeyAsync(ApUsername: string, i: number, x: number, m: number): Promise<UploadSubKeyRes> {
                if (userInfo === null) throw "未登录时尝试上传秘密份额";
                const req: UploadKeyReq = {
                    ApUserName: ApUsername, i, x, m, KKAddress: userInfo.address
                };
                return alovaClientImpl.Post("/UploadKeyReq", req);
            },
            async getToBeAuditedListAsync(): Promise<JavaServerRes<ToBeAuditedResume[]>> {
                if (userInfo === null) throw "未登录时尝试获取";
                const res = await alovaClientJavaImpl.Get<JavaServerRes<ToBeAuditedResume[]>>(`/check/uncheck?checkUsername=${userInfo.nick}`);
                console.log(res);
                return res;
            },
            async acceptOrDelayResumeAsync(isAccepted: boolean, result: string, username: string): Promise<JavaServerRes<string>> {
                if (userInfo === null) throw "未登录时尝试获取";
                const thisRes = await alovaClientJavaImpl.Post<JavaServerRes<string>>(`/check/${username}`, undefined, {
                    params: {
                        checkUsername: userInfo.nick,
                        isApprove: isAccepted,
                        reason: result
                    }
                });
                if (thisRes.success && (await alovaClientImpl.Get<JavaServerRes<boolean>>(`/check/status?resumeUsername=${username}`)).data) await alovaClientJavaFileImpl.Delete<MetaFile>(`/files/${username}`);
                return thisRes;
            },
            async downloadToBeAuthoredResume(apName: string): Promise<MetaFile> {
                return alovaClientJavaFileImpl.Get<MetaFile>(`/files/${apName}`);
            }

        };
    }
    , useValue(): null {
        return null;
    }

};

interface UserWithNoneStatusWorkMethod {
    findUserNameByAddress(address: string): Promise<JavaServerRes<string>>;

    writeWater(file: MetaFile, context: string): Promise<MetaFile>;

    readWater(file: MetaFile): Promise<JavaServerRes<string>>;

    findHashMetaDataWithMarkedFile(file: MetaFile): Promise<GetTransResultRes>;

    findHashMetaDataWithHash(hash: string): Promise<GetTransResultRes>;

    trackFileInformation(file: MetaFile): Promise<DocumentTraceabilityInformation>;
}

export const UserWithNoneStatusWork: AtomHooks<null, UserWithNoneStatusWorkMethod> = {
    useMethod(): UserWithNoneStatusWorkMethod {
        return {
            async findUserNameByAddress(address: string): Promise<JavaServerRes<string>> {
                return alovaClientJavaImpl.Get<JavaServerRes<string>>(`/applicant/${address}`);
            },
            async readWater(file: MetaFile): Promise<JavaServerRes<string>> {
                return alovaClientJavaImpl.Post<JavaServerRes<string>>(`/watermark`, FileSystemImpl.buildFormWithFile('file', file));
            },
            async writeWater(file: MetaFile, context: string): Promise<MetaFile> {
                return alovaClientJavaFileImpl.Put<MetaFile>(`/watermark/${context}`, FileSystemImpl.buildFormWithFile('file', file));
            },
            async findHashMetaDataWithHash(hash: string): Promise<GetTransResultRes> {
                const req: GetTransResultReq = {
                    hash_value: hash
                };
                return alovaClientImpl.Post<GetTransResultRes>("/CheckHash", req);
            },
            async findHashMetaDataWithMarkedFile(file: MetaFile): Promise<GetTransResultRes> {
                const fileWaterRes = await this.readWater(file);
                if (!fileWaterRes.success) throw fileWaterRes.message;
                const metaData = await this.findHashMetaDataWithHash(fileWaterRes.data);
                console.log(metaData);
                return metaData;
            },

            async trackFileInformation(file: MetaFile): Promise<DocumentTraceabilityInformation> {
                const trackResult: DocumentTraceabilityInformation = {
                    blockCharinData: {},
                    fileName: "",
                    fromAddress: "",
                    fromName: "",
                    toAddress: "",
                    waterMaskContext: "",
                    sourceAddress: "",
                    sourceName: ""
                };
                trackResult.fileName = file.name;
                console.log(trackResult);
                const fileWaterRes = await this.readWater(file);
                if (!fileWaterRes.success) throw fileWaterRes.message;
                const [transferHash, apAddress] = fileWaterRes.data.split("|");
                console.log(transferHash, apAddress);
                trackResult.waterMaskContext = transferHash;
                console.log(trackResult);
                const metaDataRes = await this.findHashMetaDataWithHash(transferHash);
                if (!metaDataRes.status) throw metaDataRes.message;
                console.log(metaDataRes);
                const chainData = metaDataRes.result["data"] as Record<string, string>;
                console.log(chainData);
                // console.log(chainData);
                trackResult.blockCharinData = metaDataRes.result;
                trackResult.fromAddress = chainData["from"];
                trackResult.toAddress = chainData["to"];
                trackResult.sourceAddress = apAddress;
                trackResult.fromName = (await this.findUserNameByAddress(trackResult.fromAddress)).data;
                trackResult.sourceName = (await this.findUserNameByAddress(trackResult.sourceAddress)).data;
                delete chainData["input"];
                delete chainData["chainId"];
                delete chainData["groupId"];
                delete chainData["extraData"];
                delete chainData["signature"];
                return trackResult;
            }
        };
    }
    , useValue(): null {
        return null;
    }

};