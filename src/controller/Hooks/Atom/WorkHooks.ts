import {atom, useAtomValue, useSetAtom} from "jotai";
import {BasicUserInfo} from "../../../model/entity/user.ts";
import {AtomHooks} from "../../../model/interface/hooks.ts";
import {createAlova} from "alova";
import ReactHook from "alova/react";
import GlobalFetch from "alova/GlobalFetch";
import {serverConfig} from "../../../config/net.config.ts";
import {BaseRes, LoginReq, RegisterReq, RegisterRes} from "../../../model/http-bodys/reqs.ts";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";

export const alovaClientImpl = createAlova({
    statesHook: ReactHook,
    requestAdapter: GlobalFetch(),
    responded: (response) => {
        return response.json();
    },
    baseURL: serverConfig.backendUrl
});


const userInfoAtom = atom<BasicUserInfo | null>(null);

interface UserWorkValue {
    userInfo: BasicUserInfo | null;
}

interface UserWorkMethod {
    registerAsync(nickname: string, hashID: string, identity: UserIdentityEnum): Promise<RegisterRes>;

    loginAsync(privateKeys: string, identity: UserIdentityEnum): Promise<BaseRes>;

    logout(): void;
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
            logout(): void {
                // setInfo(null);
            },
            async loginAsync(privateKey: string, identity: UserIdentityEnum): Promise<BaseRes> {

                const reqBody: LoginReq = {
                    identity,
                    PrivateKeys: privateKey
                };
                console.log(reqBody);
                const res = await alovaClientImpl.Post<BaseRes>("/login", reqBody);
                console.log(res);
                const info: BasicUserInfo = {
                    hash: "", identity: identity, nick: "", privateKey: privateKey
                };
                setInfo(info);
                return res;
            },
            async registerAsync(nickname: string, hashID: string, identity: UserIdentityEnum): Promise<RegisterRes> {
                const reqBody: RegisterReq = {
                    nickname, hashID, identity
                };
                return alovaClientImpl.Post<RegisterRes>("/register", reqBody);
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