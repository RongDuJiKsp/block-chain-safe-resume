package com.xtu.leotan.safecv.ipfs;

import io.ipfs.api.IPFS;
import io.ipfs.api.MerkleNode;
import io.ipfs.api.NamedStreamable;
import io.ipfs.multihash.Multihash;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
@Slf4j
public class IpfsService {

    private final IPFS ipfs;

    public IpfsService(IPFS ipfs) {
        this.ipfs = ipfs;
    }

    public MerkleNode upload(String filePath) throws IOException {
        log.info("Uploading file: {}", filePath);
        NamedStreamable.FileWrapper file = new NamedStreamable.FileWrapper(new File(filePath));
        return ipfs.add(file).get(0);
    }

    public File download(String hash, File target) throws IOException {

        // 下载文件
        Multihash filePointer = Multihash.fromBase58(hash);
        byte[] fileContents = ipfs.cat(filePointer);
        try (FileOutputStream fileOutputStream = new FileOutputStream(target)) {
            fileOutputStream.write(fileContents);
            return target;
        }
    }

}
