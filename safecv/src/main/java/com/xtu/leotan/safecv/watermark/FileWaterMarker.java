package com.xtu.leotan.safecv.watermark;

import com.xtu.leotan.safecv.common.util.Bytes;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.io.*;

/**
 * 给文件加上隐藏水印，也就是在文件末尾加上一段指定的字符
 */
@Repository
@Slf4j
public class FileWaterMarker {

    public File addWaterMark(String filePath, String waterMark) throws FileNotFoundException {
        return addWaterMark(new File(filePath), waterMark, new File(filePath + ".wm"));
    }

    public File addWaterMark(File source, String waterMark, File output) throws FileNotFoundException {
        byte[] newFileBytes = null;
        try (FileInputStream fileInputStream = new FileInputStream(source);
             FileOutputStream fileOutputStream = new FileOutputStream(output)) {

            // 读取文件内容
            byte[] fileBytes = new byte[(int) source.length()];
            fileInputStream.read(fileBytes);

            // 在文件末尾加上水印
            newFileBytes = addWaterMark(waterMark, fileBytes);

            // 写入新的文件
            fileOutputStream.write(newFileBytes);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return output;
    }

    public String getWaterMark(String filePath) throws FileNotFoundException {
        return getWaterMark(new File(filePath));
    }

    public byte[] addWaterMark(String watermark, byte[] fileBytes) {
        byte[] fileSize = Bytes.valueOf(fileBytes.length);
        byte[] waterMarkBytes = watermark.getBytes();
        byte[] newFileBytes = new byte[fileBytes.length + waterMarkBytes.length + fileSize.length];
        System.arraycopy(fileBytes, 0, newFileBytes, 0, fileBytes.length);
        System.arraycopy(waterMarkBytes, 0, newFileBytes, fileBytes.length, waterMarkBytes.length);
        // 文件末尾还需要加上源文件长度，方便之后解析
        System.arraycopy(fileSize, 0, newFileBytes, newFileBytes.length - fileSize.length, fileSize.length);
        return newFileBytes;
    }

    public String getWatermark(byte[] fileBytes) {
        // 获取源文件长度
        byte[] fileSize = new byte[8];
        System.arraycopy(fileBytes, fileBytes.length - fileSize.length, fileSize, 0, fileSize.length);
        long sourceFileSize = Bytes.toLong(fileSize);

        // 获取水印
        int waterMarkLength = (int) (fileBytes.length - fileSize.length - sourceFileSize);
        byte[] waterMark = new byte[waterMarkLength];

        System.arraycopy(fileBytes, (int) sourceFileSize, waterMark, 0, waterMarkLength);

        return new String(waterMark);
    }

    public String getWaterMark(File file) throws FileNotFoundException {
        try (FileInputStream fileInputStream = new FileInputStream(file)) {
            byte[] fileBytes = new byte[(int) file.length()];
            fileInputStream.read(fileBytes);
            return getWatermark(fileBytes);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
