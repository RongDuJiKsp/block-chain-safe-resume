import {atom, useAtom, useAtomValue} from "jotai";
import {RegisterReq} from "../../../model/http-bodys/user/reqs.ts";
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

interface UserRegisterValue {
    selectedIdentity: UserIdentityEnum;
    registered: boolean | null;
    message: string | null;
}

interface UserRegisterMethod {

    selectUserIdentity(identity: UserIdentityEnum): void;

    writePassword(password: string): void;

    registerWithDataAndStoreAsync(): Promise<RegisterRes>;

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
            writePassword(password: string): void {
                console.log(password);
                //TODO 改东西
            },
            async registerWithDataAndStoreAsync(): Promise<RegisterRes> {
                console.log(registerData);
                const res = await alovaClientImpl.Post<RegisterRes>("/RegisterReq", registerData);
                if (res.status) res.privateKeys = FileSystemImpl.base64ToAscii(res.privateKeys);
                setReceivedRegisterRes(res);
                return res;
            },
            async callFileDownloadWithData() {
                if (receivedRegisterRes === null) throw Error("在调用时未收到信息");
                const SKey = registerData.identity === UserIdentityEnum.Applicant ? AlgorithmSystemImpl.calculateEncryptedKeyByS(String(receivedRegisterRes.S)) : "";
                const PrivateKey = receivedRegisterRes.privateKeys;
                const downloadFile = new Blob([FileTempleHandleImpl.getRegisterKey(PrivateKey, SKey, receivedRegisterRes.X, receivedRegisterRes.M, receivedRegisterRes.encryptPrivateKeys)]);
                await FileSystemImpl.downloadToFileFromSuffixAsync(downloadFile, `${receivedRegisterRes.address.substring(0, 7)}... of ${registerData.identity}`, "key");
            },
            reset() {
                setRegisterData(initialRegisterData);
            }
        };
    }
};
