package com.xtu.leotan.safecv.ipfs;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.File;
import java.io.IOException;

@SpringBootTest
class IpfsServiceTest {

    @Autowired
    private IpfsService ipfsService;

    public static final String TEST_FILE_PATH = "D:\\Project\\Java_Program\\block-chain-safe-resume\\safecv\\test.test";

    @Test
    void upload() throws IOException {
        var upload = ipfsService.upload(TEST_FILE_PATH);
        System.out.println("upload.hash = " + upload.hash);
    }

    @Test
    void download() throws IOException {
        File file = new File(TEST_FILE_PATH + ".download");
        File download = ipfsService.download("QmaLJQFtPzr6KDCnejgnTS3VA8SDZfB8dKAANkmqGTshA9", file);
        System.out.println("download = " + download.getAbsolutePath());
    }
}