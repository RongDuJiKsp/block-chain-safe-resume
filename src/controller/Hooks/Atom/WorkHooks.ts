import {useAtomValue, useSetAtom} from "jotai";
import {BasicUserState} from "../../../model/entity/user.ts";
import {AtomHooks} from "../../../model/interface/hooks.ts";
import {createAlova} from "alova";
import ReactHook from "alova/react";
import GlobalFetch from "alova/GlobalFetch";
import {SERVER_URLS, STORAGE_KEY_CONFIG} from "../../../config/net.config.ts";
import {BaseRes, LoginReq, RegisterReq, RegisterRes} from "../../../model/http-bodys/reqs.ts";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {BasisSyncStorage, FileSystemImpl} from "../../util/InteractiveSystem.ts";
import {atomWithStorage} from "jotai/utils";
import {File} from "node:buffer";

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
    registerAsync(username: string, hashID: string, identity: UserIdentityEnum): Promise<RegisterRes>;

    loginAsync(privateKeys: string, identity: UserIdentityEnum): Promise<BaseRes>;

    logout(): void;

    changeUserNameAsync(newName: string): Promise<BaseRes>;

    uploadFileAsync(File: File, S: string): Promise<BaseRes>;

    downloadFileAsync(encryptHash: string, S: string): Promise<File>;
}

export const UserWorkHooks: AtomHooks<UserWorkValue, UserWorkMethod> = {
    useValue(): UserWorkValue {
        const value = useAtomValue(userInfoAtom);
        return {
            userInfo: value
        };
    },
    useMethod(): UserWorkMethod {
        const setInfo = useSetAtom(userInfoAtom);
        return {
            async downloadFileAsync(encryptHash: string, S: string): Promise<File> {
                return new File([encryptHash, S], "ss");
            },
            async uploadFileAsync(File: File, S: string): Promise<BaseRes> {
                return {
                    status: 1,
                    message: "ojF" + File.name + S
                };
            },
            async changeUserNameAsync(newName: string): Promise<BaseRes> {
                const name = newName;
                return {
                    status: 1,
                    message: "oj"
                };
            },
            logout(): void {
                setInfo(null);
            },
            async loginAsync(privateKey: string, identity: UserIdentityEnum): Promise<BaseRes> {

                const reqBody: LoginReq = {
                    identity,
                    PrivateKeys: privateKey,
                    username: new Date().toTimeString()
                };
                const res = await alovaClientImpl.Post<BaseRes>("/login", reqBody);
                const info: BasicUserState = {
                    hash: "", identity: identity, nick: "", address: ''
                };
                setInfo(info);
                return res;
            },
            async registerAsync(username: string, hashID: string, identity: UserIdentityEnum): Promise<RegisterRes> {
                const reqBody: RegisterReq = {
                    username, hashID, identity
                };
                const res = await alovaClientImpl.Post<RegisterRes>("/register", reqBody);
                res.PrivateKeys = FileSystemImpl.base64ToAscii(res.PrivateKeys);
                return res;
            }
        };
    }
};
export const AdminWorkHooks: AtomHooks<Record<string, never>, Record<string, never>> = {
    useMethod(): Record<string, never> {
        return {};
    }, useValue(): Record<string, never> {
        return {};
    }

};