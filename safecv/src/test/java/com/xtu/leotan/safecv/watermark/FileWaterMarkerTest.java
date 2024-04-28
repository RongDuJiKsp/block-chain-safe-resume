package com.xtu.leotan.safecv.watermark;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.File;
import java.io.FileNotFoundException;

@SpringBootTest
class FileWaterMarkerTest {

    static final String source_file = "D:\\Project\\Python\\block-chain-safe-resume\\watermark.pdf";
    static final String product_file = "D:\\Project\\Python\\block-chain-safe-resume\\watermark.pdf.wm";

    @Test
    void addWaterMark() throws FileNotFoundException {

        FileWaterMarker fileWaterMarker = new FileWaterMarker();
        File testWaterMarker = fileWaterMarker.addWaterMark(source_file, "testWaterMarker");
        System.out.println(testWaterMarker.getAbsolutePath());
    }

    @Test
    void readWaterMark() throws FileNotFoundException {
        FileWaterMarker fileWaterMarker = new FileWaterMarker();
        String waterMarker = fileWaterMarker.getWaterMark(product_file);
        System.out.println("waterMarker = " + waterMarker);
    }
}