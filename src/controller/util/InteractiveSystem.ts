import {UserFileSystem} from "../../model/interface/util.ts";
import {SyncStorage} from "jotai/vanilla/utils/atomWithStorage";


export const FileSystemImpl: UserFileSystem = {
    async readFileAsTextAsync(file: MetaFile) {
        return new Promise<string>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (ev): void => {
                const reader = ev.target;
                if (reader === null || reader.result === null) {
                    reject("Null Error");
                    return;
                }
                resolve(reader.result as string);
            };
            fileReader.onerror = (ev) => {
                reject(ev.target?.error);
            };
            fileReader.readAsText(file);
        });
    },
    async downloadMetaFileAsync(file: MetaFile): Promise<void> {
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    },
    arrayBufferToFile(arrayBuffer: ArrayBuffer, fileName: string, fileType): MetaFile {
        return new File([arrayBuffer], fileName, {
            type: fileType
        });
    },
    readFileAsArrayBufferAsync(file: MetaFile): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (ev): void => {
                const reader = ev.target;
                if (reader === null || reader.result === null) {
                    reject("Null Error");
                    return;
                }
                resolve(reader.result as ArrayBuffer);
            };
            fileReader.onerror = (ev) => {
                reject(ev.target?.error);
            };
            fileReader.readAsArrayBuffer(file);
        });
    },

    async downloadToFileFromSuffixAsync(file: BinFile, prefix: string, suffix: string): Promise<void> {
        await this.downloadToFileAsNameAsync(file, prefix + "." + suffix);
    },
    async downloadToFileAsNameAsync(file: BinFile, name: string): Promise<void> {
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    },
    readFileAsBase64Async(file: MetaFile) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (ev): void => {
                resolve(String(ev.target?.result).split(",")[1]);
            };
            fileReader.onerror = (ev) => {
                reject(ev.target?.error);
            };
            fileReader.readAsDataURL(file);
        });
    },
    readBase64AsBlob(base64: string, type: string): BinFile {
        const binStr = atob(base64);
        let n = binStr.length;
        const u8Arr = new Uint8Array(n);
        while (n--) {
            u8Arr[n] = binStr.charCodeAt(n);
        }
        return new Blob([u8Arr], {type: type});
    },
    base64ToAscii(base64: string): string {
        return new Buffer(base64, "base64").toString("utf-8");
    },
    writeTextToClipboard(text: string) {
        const input = document.createElement('textarea');
        input.innerHTML = text;
        document.body.appendChild(input);
        input.select();
        const result = document.execCommand('copy');
        document.body.removeChild(input);
        return result;
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