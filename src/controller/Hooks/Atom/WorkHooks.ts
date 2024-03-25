import {useAtomValue, useSetAtom} from "jotai";
import {BasicUserInfo} from "../../../model/entity/user.ts";
import {AtomHooks} from "../../../model/interface/hooks.ts";
import {createAlova} from "alova";
import ReactHook from "alova/react";
import GlobalFetch from "alova/GlobalFetch";
import {STORAGE_KEY_CONFIG, SERVER_URLS} from "../../../config/net.config.ts";
import {BaseRes, LoginReq, RegisterReq, RegisterRes} from "../../../model/http-bodys/reqs.ts";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {BasisSyncStorage, FileSystemImpl} from "../../util/InteractiveSystem.ts";
import {atomWithStorage} from "jotai/utils";

export const alovaClientImpl = createAlova({
    statesHook: ReactHook,
    requestAdapter: GlobalFetch(),
    responded: (response) => {
        return response.json();
    },
    baseURL: SERVER_URLS.backendUrl
});


const userInfoAtom = atomWithStorage<BasicUserInfo | null>(STORAGE_KEY_CONFIG.userInfo, null, new BasisSyncStorage<BasicUserInfo | null>(), {
    getOnInit: true
});


interface UserWorkValue {
    userInfo: BasicUserInfo | null;
}

interface UserWorkMethod {
    registerAsync(username: string, hashID: string, identity: UserIdentityEnum): Promise<RegisterRes>;

    loginAsync(privateKeys: string, identity: UserIdentityEnum): Promise<BaseRes>;

    logout(): void;

    changeUserNameAsync(newName: string): Promise<BaseRes>;
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
            async changeUserNameAsync(newName: string): Promise<BaseRes> {
                const name=newName;
                return {
                    status: 1
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
                const info: BasicUserInfo = {
                    hash: "", identity: identity, nick: "", privateKey: privateKey
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