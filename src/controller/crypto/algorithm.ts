import {AlgorithmSystem} from "../../model/interface/crypto.ts";
import {CryptoSystemImpl} from "./hash.ts";

const AlgorithmSystemImpl: AlgorithmSystem = {
    calculateEncryptedKeyByS(S: string): string {
        return CryptoSystemImpl.hashDataBySM3(S).split("").filter((_, index): boolean => index % 2 === 0).join("");
    }
};