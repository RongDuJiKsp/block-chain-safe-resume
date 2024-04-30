import {atom, useAtom, useAtomValue} from "jotai";
import {UserIdentityEnum} from "../../../model/Enum/WorkEnum.ts";
import {AtomHooks} from "../../../model/interface/hooks.ts";
import {RegisterRes} from "../../../model/http-bodys/user/ress.ts";
import {FileSystemImpl} from "../../util/InteractiveSystem.ts";
import {createAlova} from "alova";
import ReactHook from "alova/react";
import GlobalFetch from "alova/GlobalFetch";
import {SERVER_URLS} from "../../../config/net.config.ts";
import {AlgorithmSystemImpl} from "../../crypto/algorithm.ts";
import {FileTempleHandleImpl} from "../../util/output.ts";
import {RegisterReq} from "../../../model/http-bodys/user/reqs.ts";

const alovaClientImpl = createAlova({
    statesHook: ReactHook,
    requestAdapter: GlobalFetch(),
    responded: (response) => {
        return response.json();
    },
    baseURL: SERVER_URLS.backendUrl
});

const initialRegisterData: RegisterReq = {
    identity: UserIdentityEnum.None,
    userName: "",
    password: ""
};
const RegisterDataAtom = atom<RegisterReq>(initialRegisterData);
const ReceivedRegisterResAtom = atom<RegisterRes | null>(null);

interface UserRegisterValue {
    selectedIdentity: UserIdentityEnum;
    registered: boolean | null;
    message: string | null;
}

interface UserRegisterMethod {

    selectUserIdentity(identity: UserIdentityEnum): void;


    registerWithDataAndStoreAsync(username: string, password: string): Promise<RegisterRes>;

    callFileDownloadWithData(): Promise<void>;

    reset(): void;
}

export const UserRegisterHook: AtomHooks<UserRegisterValue, UserRegisterMethod> = {
    useValue(): UserRegisterValue {
        const registerData = useAtomValue(RegisterDataAtom);
        const receivedRegisterRes = useAtomValue(ReceivedRegisterResAtom);
        return {
            selectedIdentity: registerData.identity,
            registered: receivedRegisterRes ? (receivedRegisterRes.status === 1) : null,
            message: receivedRegisterRes ? receivedRegisterRes.message : null,
        };
    },
    useMethod(): UserRegisterMethod {
        const [registerData, setRegisterData] = useAtom(RegisterDataAtom);
        const [receivedRegisterRes, setReceivedRegisterRes] = useAtom(ReceivedRegisterResAtom);
        return {
            selectUserIdentity(identity: UserIdentityEnum): void {
                setRegisterData(r => ({...r, identity}));
            },
            async registerWithDataAndStoreAsync(username: string, password: string): Promise<RegisterRes> {
                const req: RegisterReq = {
                    identity: registerData.identity,
                    userName: username,
                    password: password
                };
                setRegisterData(req);
                console.log(req);
                const res = await alovaClientImpl.Post<RegisterRes>("/RegisterReq", req);
                console.log("response",res);
                setReceivedRegisterRes(res);
                return res;
            },
            async callFileDownloadWithData() {
                if (receivedRegisterRes === null) throw Error("在调用时未收到信息");
                console.log("regisRes",receivedRegisterRes);
                const SKey = registerData.identity === UserIdentityEnum.Applicant ? AlgorithmSystemImpl.calculateEncryptedKeyByS(String(receivedRegisterRes.S)) : "";
                const downloadFile = new Blob([FileTempleHandleImpl.getRegisterKey(SKey, registerData.userName)]);
                await FileSystemImpl.downloadToFileFromSuffixAsync(downloadFile, `${registerData.userName}... of ${registerData.identity}`, "txt");
                if (registerData.identity === UserIdentityEnum.KeyKeeper) {
                    const downloadKey = new Blob([receivedRegisterRes.encryptPrivateKeys]);
                    await FileSystemImpl.downloadToFileAsNameAsync(downloadKey, "key of" + registerData.userName + ".pem");
                }
            },
            reset() {
                setRegisterData(initialRegisterData);
            }
        };
    }
};
