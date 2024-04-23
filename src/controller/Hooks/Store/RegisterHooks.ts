import {atom, useAtom} from "jotai";
import {RegisterReq} from "../../../model/http-bodys/user/reqs.ts";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {AtomHooks} from "../../../model/interface/hooks.ts";
import {RegisterRes} from "../../../model/http-bodys/user/ress.ts";
import {FileSystemImpl} from "../../util/InteractiveSystem.ts";
import {createAlova} from "alova";
import ReactHook from "alova/react";
import GlobalFetch from "alova/GlobalFetch";
import {SERVER_URLS} from "../../../config/net.config.ts";

const alovaClientImpl = createAlova({
    statesHook: ReactHook,
    requestAdapter: GlobalFetch(),
    responded: (response) => {
        return response.json();
    },
    baseURL: SERVER_URLS.backendUrl
});


const initialRegisterData: RegisterReq = {
    identity: UserIdentityEnum.None
};
const RegisterDataAtom = atom<RegisterReq>(initialRegisterData);
const ReceivedRegisterResAtom = atom<RegisterRes | null>(null);

interface UserRegisterMethod {

    selectUserIdentity(identity: UserIdentityEnum): void;

    writePassword(password: string): void;

    registerWithDataAndStoreAsync(): Promise<RegisterRes>;

    callFileDownloadWithData(): void;

    reset(): void;
}

export const UserRegisterHook: AtomHooks<null, UserRegisterMethod> = {
    useValue(): null {
        return null;
    },
    useMethod(): UserRegisterMethod {
        const [registerData, setRegisterData] = useAtom(RegisterDataAtom);
        const [receivedRegisterRes, setReceivedRegisterRes] = useAtom(ReceivedRegisterResAtom);
        return {
            selectUserIdentity(identity: UserIdentityEnum): void {
                setRegisterData(r => ({...r, identity}));
            },
            writePassword(password: string): void {
                console.log(password);
                //TODO 改东西
            },
            async registerWithDataAndStoreAsync(): Promise<RegisterRes> {
                const res = await alovaClientImpl.Post<RegisterRes>("/RegisterReq", registerData);
                if (res.status) res.privateKeys = FileSystemImpl.base64ToAscii(res.privateKeys);
                setReceivedRegisterRes(res);
                return res;
            },
            callFileDownloadWithData() {

            },
            reset() {
                setRegisterData(initialRegisterData);
            }
        };
    }
};
