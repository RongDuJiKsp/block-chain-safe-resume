import {useAtom, useAtomValue} from "jotai";
import {BasicUserState} from "../../../model/entity/user.ts";
import {AtomHooks} from "../../../model/interface/hooks.ts";
import {createAlova} from "alova";
import ReactHook from "alova/react";
import GlobalFetch from "alova/GlobalFetch";
import {SERVER_URLS, STORAGE_KEY_CONFIG} from "../../../config/net.config.ts";
import {ChangeNameReq, LoginReq, RegisterReq} from "../../../model/http-bodys/user/reqs.ts";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {BasisSyncStorage, FileSystemImpl} from "../../util/InteractiveSystem.ts";
import {atomWithStorage} from "jotai/utils";
import {ArrayRes, ChangeNameRes, LoginRes, RegisterRes} from "../../../model/http-bodys/user/ress.ts";
import {
    GiveOrDelayResumeLicensingRes,
    ResumeInfoRes,
    ResumeQuestListRes,
    ResumeRequestHistoryListRes,
    UploadRes
} from "../../../model/http-bodys/user/applicant/res.ts";
import {
    AccessibleSubKeyListRes,
    DownloadSubKeysRes,
    RequestListRes,
    UploadSubKeyRes
} from "../../../model/http-bodys/user/keykeeper/res.ts";
import {
    RecruiterResumeStatusListRes,
    RequestResumeLicensingRes,
    SearchApRes
} from "../../../model/http-bodys/user/recruiter/res.ts";
import {GetNeedSaveReq, RemindKKReq, SavePartReq, UploadKeyReq} from "../../../model/http-bodys/user/keykeeper/req.ts";
import {AccessibleSubKeyInfo, UploadSubKeyRequestInfo} from "../../../model/entity/keykeeper.ts";
import {RecAlreadyAuthorizeReq, RecAuthorizeReq, SearchApReq} from "../../../model/http-bodys/user/recruiter/req.ts";
import {ApSearchInfo, ConnectingResumeInfo} from "../../../model/entity/recruiter.ts";
import {
    ApAuthorizeReq,
    GetDownloadHisReq,
    GetMoreFileMesReq,
    GetRequestReq
} from "../../../model/http-bodys/user/applicant/req.ts";
import {ResumeLicenseRequestInfo, ResumeVisitHistoryInfo} from "../../../model/entity/applicant.ts";
import {CryptoSystemImpl} from "../../crypto/hash.ts";

export const alovaClientImpl = createAlova({
    statesHook: ReactHook,
    requestAdapter: GlobalFetch(),
    responded: (response) => {
        return response.json();
    },
    baseURL: SERVER_URLS.backendUrl
});


const userInfoAtom = atomWithStorage<BasicUserState | null>(STORAGE_KEY_CONFIG.userState, null, new BasisSyncStorage<BasicUserState | null>(), {
    getOnInit: true
});


interface UserWorkValue {
    userInfo: BasicUserState | null;
}

interface UserWorkMethod {
    registerAsync(identity: UserIdentityEnum): Promise<RegisterRes>;

    loginAsync(privateKeys: string, identity: UserIdentityEnum): Promise<LoginRes>;

    logout(): void;

    changeUserNameAsync(newName: string, privateKey: string): Promise<ChangeNameRes>;
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
            async changeUserNameAsync(newName: string, privateKey: string): Promise<ChangeNameRes> {
                if (info === null) throw "在未登录的情况下尝试修改用户名";
                const request: ChangeNameReq = {
                    oldName: info.nick,
                    newName: newName,
                    identity: info.identity,
                    privateKey: privateKey
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
            async loginAsync(privateKey: string, identity: UserIdentityEnum): Promise<LoginRes> {

                const reqBody: LoginReq = {
                    identity,
                    privateKeys: privateKey,
                };
                const res = await alovaClientImpl.Post<LoginRes>("/LoginReq", reqBody);

                const info: BasicUserState = {
                    identity: identity, nick: res.userName, address: res.address
                };
                setInfo(info);
                return res;
            },
            async registerAsync(identity: UserIdentityEnum): Promise<RegisterRes> {
                const reqBody: RegisterReq = {
                    identity
                };
                const res = await alovaClientImpl.Post<RegisterRes>("/RegisterReq", reqBody);
                if (res.status) res.privateKeys = FileSystemImpl.base64ToAscii(res.privateKeys);
                return res;
            }
        };
    }
};

interface ApplicantWorkMethod {
    encryptedAndUpdateResumeAsync(File: MetaFile, S: string): Promise<UploadRes>;

    getResumeInfoAsync(): Promise<ResumeInfoRes>;

    getResumeRequestListAsync(): Promise<ResumeQuestListRes>;

    giveOrDelayResumeLicensingAsync(ReAddress: string, status: number): Promise<GiveOrDelayResumeLicensingRes>;

    getResumeRequestHistoryListAsync(): Promise<ResumeRequestHistoryListRes>;
}

export const ApplicantWorkHooks: AtomHooks<null, ApplicantWorkMethod> = {
    useMethod(): ApplicantWorkMethod {
        const userInfo = useAtomValue(userInfoAtom);
        return {
            async getResumeRequestHistoryListAsync(): Promise<ResumeRequestHistoryListRes> {
                if (userInfo === null) throw "在未登录时获取简历历史记录信息";
                const req: GetDownloadHisReq = {
                    ApUserName: userInfo.nick
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
                    address: userInfo.address
                };
                return alovaClientImpl.Post<ResumeInfoRes>("/GetMoreFileMesReq", req);
            },
            async encryptedAndUpdateResumeAsync(File: MetaFile, S: string): Promise<UploadRes> {
                if (userInfo === null) throw "在未登录时上传简历";
                const encryptedFile = await CryptoSystemImpl.encryptedFileAsync(File, S);
                const formData = new FormData();
                formData.append("file", encryptedFile);
                return alovaClientImpl.Post<UploadRes>("/UploadReq", formData, {
                    params: {
                        address: userInfo.address,
                        userName: userInfo.nick
                    }
                });
            }
        };
    },
    useValue(): null {
        return null;
    }

};

interface RecruiterWorkMethod {
    downloadResumeAsync(encryptHash: string, S: string): Promise<MetaFile>;

    requestResumeLicensingAsync(ApUserName: string, ApAddress: string): Promise<RequestResumeLicensingRes>;

    getResumeStatusListAsync(): Promise<RecruiterResumeStatusListRes>;

    getFuzzyLookupListAsync(partApUserName: string): Promise<SearchApRes>;
}

export const RecruiterWorkHooks: AtomHooks<null, RecruiterWorkMethod> = {
    useMethod(): RecruiterWorkMethod {
        const userInfo = useAtomValue(userInfoAtom);
        return {
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
            async downloadResumeAsync(encryptHash: string, S: string): Promise<MetaFile> {
                if (userInfo === null) throw "未登录时尝试下载";
                return new File([encryptHash, S], "ss");//TODO:实现一键下载并且解密的功能
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
    uploadSubKeyAsync(ApAddress: string, i: number, x: number, m: number): Promise<UploadSubKeyRes>;

    downloadSubKeyAsync(apUserName: string, apAddress: string): Promise<DownloadSubKeysRes>;

    getRequestListAsync(): Promise<RequestListRes>;

    getAccessibleSubKeyListAsync(): Promise<AccessibleSubKeyListRes>;
}

export const KeyKeeperWorkHook: AtomHooks<null, KeyKeeperWorkMethod> = {

    useMethod(): KeyKeeperWorkMethod {
        const userInfo = useAtomValue(userInfoAtom);
        return {
            async downloadSubKeyAsync(apUserName: string, apAddress: string): Promise<DownloadSubKeysRes> {
                if (userInfo === null) throw "未登录时尝试获取子密钥";
                const req: SavePartReq = {KKAddress: userInfo.address, address: apAddress, userName: apUserName};
                return alovaClientImpl.Post<DownloadSubKeysRes>("/SavePartReq", req);
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
            async uploadSubKeyAsync(ApAddress: string, i: number, x: number, m: number): Promise<UploadSubKeyRes> {
                if (userInfo === null) throw "未登录时尝试上传子密钥";
                const req: UploadKeyReq = {
                    ApAddress, i, x, m, KKAddress: userInfo.address
                };
                return alovaClientImpl.Post("/UploadKeyReq", req);
            }

        };
    }
    , useValue(): null {
        return null;
    }

};