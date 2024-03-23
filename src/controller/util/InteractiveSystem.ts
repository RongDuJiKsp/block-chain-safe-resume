import {UserFileSystem} from "../../model/interface/util.ts";
import {SyncStorage} from "jotai/vanilla/utils/atomWithStorage";


export const FileSystemImpl: UserFileSystem = {

    async downloadToFile(file: BinFile, prefix: string, suffix: string): Promise<void> {
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = prefix + "." + suffix;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    },
    base64ToAscii(base64: string): string {
        return new Buffer(base64, "base64").toString("utf-8");
    }

};

export class BasisSyncStorage<T> implements SyncStorage<T> {
    getItem(key: string, initialValue: T): T {
        const res = localStorage.getItem(key);
        if (res) return JSON.parse(res);
        return initialValue;
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    setItem(key: string, newValue: T): void {
        localStorage.setItem(key, JSON.stringify(newValue));
    }

}