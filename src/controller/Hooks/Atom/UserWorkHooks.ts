import {atom} from "jotai/vanilla/atom";
import {BasicUserInfo} from "../../../model/entity/user.ts";
import {AtomHooks} from "../../../model/interface/hooks.ts";
import {useAtomValue} from "jotai/react/useAtomValue";
import {createAlova} from "alova";
import ReactHook from "alova/react";
import GlobalFetch from "alova/GlobalFetch";
import {serverConfig} from "../../../config/net.config.ts";
import {RegisterReq, RegisterRes} from "../../../model/http-bodys/reqs.ts";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";

export const alovaClientImpl = createAlova({
    statesHook: ReactHook,
    requestAdapter: GlobalFetch(),
    responded: (response) => {
        return response.json();
    },
    baseURL: serverConfig.backendUrl
})


const userInfoAtom = atom<BasicUserInfo | null>(null);

interface UserWorkValue {
    userInfo: BasicUserInfo | null;
}

interface UserWorkMethod {
    registerAsync(nickname: string, hashID: string, identity: UserIdentityEnum): Promise<RegisterRes>;
}

export const UserWorkHooks: AtomHooks<UserWorkValue, UserWorkMethod> = {
    useValue(): UserWorkValue {
        const value = useAtomValue(userInfoAtom);
        return {
            userInfo: value
        }
    },
    useMethod(): UserWorkMethod {
        return {
            async registerAsync(nickname: string, hashID: string, identity: UserIdentityEnum): Promise<RegisterRes> {
                const reqBody: RegisterReq = {
                    nickname, hashID, identity
                }
                return alovaClientImpl.Post<RegisterRes>("/register", reqBody);
            }
        }
    }
}