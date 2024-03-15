import {Web3} from "web3";
import {Web3Server} from "@/interface/crypto";

const web3Impl = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
const Web3ServerImpl: Web3Server = {
    keyToAddress(privateKey: string): string {
        return web3Impl.eth.accounts.privateKeyToAccount(privateKey).address;
    }
}