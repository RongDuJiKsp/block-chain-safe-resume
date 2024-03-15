import {UserFileSystem} from "../../interface/util.ts";

export const FileSystemImpl: UserFileSystem = {

    async downloadToFile(file: BinFile, prefix: string, suffix: string): Promise<void> {
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = prefix + "." + suffix
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }

}