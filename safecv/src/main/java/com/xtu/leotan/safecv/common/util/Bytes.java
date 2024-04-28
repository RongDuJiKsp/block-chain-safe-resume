package com.xtu.leotan.safecv.common.util;

public class Bytes {

    public static byte[] valueOf(long src) {
        // long 转换成byte数组
        byte[] b = new byte[8];
        b[0] = (byte) (src >>> 56);
        b[1] = (byte) (src >>> 48);
        b[2] = (byte) (src >>> 40);
        b[3] = (byte) (src >>> 32);
        b[4] = (byte) (src >>> 24);
        b[5] = (byte) (src >>> 16);
        b[6] = (byte) (src >>> 8);
        b[7] = (byte) (src);
        return b;
    }

    public static long toLong(byte[] src) {

        // byte数组转换成long
        long value = 0;
        for (int i = 0; i < 8; i++) {
            value = (value << 8) + (src[i] & 0xff);
        }
        return value;
    }
}
