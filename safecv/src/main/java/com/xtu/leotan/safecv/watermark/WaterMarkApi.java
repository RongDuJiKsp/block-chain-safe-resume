package com.xtu.leotan.safecv.watermark;

import com.xtu.leotan.safecv.common.mvc.Res;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "水印服务")
public interface WaterMarkApi {
    @Operation(summary = "添加水印")
    @Parameter(name = "watermark", description = "水印内容", required = true)
    @Parameter(name = "file", description = "文件", required = true)
    void putWaterMark(@PathVariable String watermark, MultipartFile file, HttpServletResponse response) throws IOException;

    @Operation(summary = "获取水印")
    @Parameter(name = "file", description = "文件", required = true)
    Res<String> getWaterMark(@RequestParam("file") MultipartFile file) throws IOException;
}
