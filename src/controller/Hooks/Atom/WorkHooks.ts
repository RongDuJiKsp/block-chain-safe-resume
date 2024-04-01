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
import {ArrayRes, BaseRes, ChangeNameRes, LoginRes, RegisterRes} from "../../../model/http-bodys/user/ress.ts";
import {
    GiveOrDelayResumeLicensingRes,
    ResumeInfoRes,
    ResumeQuestListRes,
    ResumeRequestHistoryListRes
} from "../../../model/http-bodys/user/applicant/res.ts";
import {
    AccessibleSubKeyListRes,
    DownloadSubKeysRes,
    RequestListRes,
    UploadSubKeyRes
} from "../../../model/http-bodys/user/keykeeper/res.ts";
import {RecruiterResumeStatusListRes, RequestResumeLicensingRes} from "../../../model/http-bodys/user/recruiter/res.ts";
import {GetNeedSaveReq, SavePartReq} from "../../../model/http-bodys/user/keykeeper/req.ts";
import {AccessibleSubKeyInfo} from "../../../model/entity/keykeeper.ts";

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
    updateResumeAsync(File: File, S: string): Promise<BaseRes>;

    getResumeInfoAsync(): Promise<ResumeInfoRes>;

    getResumeRequestListAsync(): Promise<ResumeQuestListRes>;

    giveOrDelayResumeLicensingAsync(): Promise<GiveOrDelayResumeLicensingRes>;

    getResumeRequestHistoryListAsync(): Promise<ResumeRequestHistoryListRes>;
}

export const ApplicantWorkHooks: AtomHooks<null, ApplicantWorkMethod> = {
    useMethod(): ApplicantWorkMethod {
        return {
            async getResumeRequestHistoryListAsync(): Promise<ResumeRequestHistoryListRes> {
                return {
                    status: 1,
                    message: 'ok',
                    list: []
                };
            },
            async getResumeRequestListAsync(): Promise<ResumeQuestListRes> {
                return {
                    status: 1,
                    message: 'ok',
                    list: [
                        {
                            address: "0x7F6aAe679dC0bD7d6ecF62224A5a3423877d6Be7",
                            username: "alibaba"
                        }, {
                            address: "0x7F6aAe679dC0bD7d6ecF62224A5a3423877d6Be7",
                            username: "alibaba"
                        },
                        {
                            address: "0x7F6aAe679dC0bD7d6ecF62224A5a3423877d6Be7",
                            username: "alibabababababab"
                        },
                        {
                            address: "0x7F6aAe679dC0bD7d6ecF62224A5a3423877d6Be7",
                            username: "alibaba"
                        },
                        {
                            address: "0x7F6aAe679dC0bD7d6ecF62224A5a3423877d6Be7",
                            username: "alibaba"
                        }, {
                            address: "0x7F6aAe679dC0bD7d6ecF62224A5a3423877d6Be7",
                            username: "alibaba"
                        },
                    ]
                };
            },
            async giveOrDelayResumeLicensingAsync(): Promise<GiveOrDelayResumeLicensingRes> {
                return {
                    status: 1,
                    message: 'ok'
                };
            },
            async getResumeInfoAsync(): Promise<ResumeInfoRes> {
                return {
                    status: 1,
                    message: "ok",
                    putTime: "1989-07-01 12:13:14",
                    downloadtimes: "2232"
                };
            },
            async updateResumeAsync(File: File, S: string): Promise<BaseRes> {
                return {
                    status: 1,
                    message: "ojF" + File.name + S
                };
            }
        };
    },
    useValue(): null {
        return null;
    }

};

interface RecruiterWorkMethod {
    downloadResumeAsync(encryptHash: string, S: string): Promise<File>;

    getResumeStatusListAsync(): Promise<RecruiterResumeStatusListRes>;

    requestResumeLicensingAsync(): Promise<RequestResumeLicensingRes>;
}

export const RecruiterWorkHooks: AtomHooks<null, RecruiterWorkMethod> = {
    useMethod(): RecruiterWorkMethod {
        const userInfo = useAtomValue(userInfoAtom);
        return {
            async downloadResumeAsync(encryptHash: string, S: string): Promise<File> {
                if (userInfo === null) throw "未登录时尝试上传";
                return new File([encryptHash, S], "ss");
            },
            async getResumeStatusListAsync(): Promise<RecruiterResumeStatusListRes> {
                if (userInfo === null) throw "未登录";
                return {
                    status: 1,
                    message: "",
                    list: []
                };
            },
            async requestResumeLicensingAsync(): Promise<RequestResumeLicensingRes> {
                if (userInfo === null) throw "未登录时尝试上传";
                return {
                    status: 1,
                    message: ""
                };
            }
        };
    },
    useValue(): null {
        return null;
    }

};

interface KeyKeeperWorkMethod {
    uploadSubKeyAsync(): Promise<UploadSubKeyRes>;

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
                    list: res.list.map((val): AccessibleSubKeyInfo => ({
                        userName: val[0],
                        address: val[1],
                        amount: Number(val[2])
                    }))
                };

            },
            async getRequestListAsync(): Promise<RequestListRes> {
                return {status: 1, message: "22"};
            },
            async uploadSubKeyAsync(): Promise<UploadSubKeyRes> {
                if (userInfo === null) throw "未登录时尝试上传子密钥";

                return {status: 1, message: "22"};
            }

        };
    }
    , useValue(): null {
        return null;
    }

};