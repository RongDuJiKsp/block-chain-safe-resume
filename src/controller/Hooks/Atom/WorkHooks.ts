import {useAtom, useAtomValue} from "jotai";
import {BasicUserState} from "../../../model/entity/user.ts";
import {AtomHooks} from "../../../model/interface/hooks.ts";
import {createAlova} from "alova";
import ReactHook from "alova/react";
import GlobalFetch from "alova/GlobalFetch";
import {SERVER_URLS, STORAGE_KEY_CONFIG} from "../../../config/net.config.ts";
import {ChangeNameReq, LoginReq, RegisterReq} from "../../../model/http-bodys/reqs.ts";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {BasisSyncStorage, FileSystemImpl} from "../../util/InteractiveSystem.ts";
import {atomWithStorage} from "jotai/utils";
import {
    BaseRes,
    ChangeNameRes,
    GiveResumeLicensingRes,
    KeyKeeperRequestRequestListRes,
    LoginRes,
    RecruiterResumeStatusRes,
    RegisterRes,
    RequestResumeLicensingRes,
    ResumeInfoRes,
    ResumeQuestListRes,
    ResumeRequestHistoryListRes,
    UploadSubKeyRes
} from "../../../model/http-bodys/ress.ts";

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

    giveResumeLicensingAsync(): Promise<GiveResumeLicensingRes>;

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
            async giveResumeLicensingAsync(): Promise<GiveResumeLicensingRes> {
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

    getResumeStatusListAsync(): Promise<RecruiterResumeStatusRes>;

    requestResumeLicensingAsync(): Promise<RequestResumeLicensingRes>;
}

export const RecruiterWorkHooks: AtomHooks<null, RecruiterWorkMethod> = {
    useMethod(): RecruiterWorkMethod {
        return {
            async downloadResumeAsync(encryptHash: string, S: string): Promise<File> {
                return new File([encryptHash, S], "ss");
            },
            async getResumeStatusListAsync() {
                return {
                    status: 1,
                    message: ""
                };
            },
            async requestResumeLicensingAsync(): Promise<RequestResumeLicensingRes> {
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

    requestRequestListAsync(): Promise<KeyKeeperRequestRequestListRes>;
}