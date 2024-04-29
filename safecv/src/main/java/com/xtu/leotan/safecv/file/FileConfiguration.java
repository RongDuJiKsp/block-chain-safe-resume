package com.xtu.leotan.safecv.file;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "file")
@Data
public class FileConfiguration {
    /**
     * 文件上传路径
     */
    private String path = "./upload/";
}
