export interface CryptoOfHash {
    encryptedData(originalData: string, key: string): string;

    encryptedBin(originalBinData: ArrayBuffer, key: string): ArrayBuffer;

    decryptedData(encryptedData: string, key: string): string;

    decryptedBin(encryptedBinData: ArrayBuffer, key: string): ArrayBuffer;

    hashData(data: string): string;
}


