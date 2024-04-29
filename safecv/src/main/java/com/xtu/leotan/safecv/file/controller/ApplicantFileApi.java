package com.xtu.leotan.safecv.file.controller;

import com.xtu.leotan.safecv.common.mvc.Res;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "临时文件管理", description = "临时文件管理")
public interface ApplicantFileApi {

    /**
     * 上传文件
     *
     * @param apUsername 用户名称
     * @param file       文件
     * @return 返回是否上传成功
     */
    @Operation(summary = "上传文件", description = "上传文件")
    @Parameters({@Parameter(name = "apUsername", description = "用户名称", required = true),
            @Parameter(name = "file", description = "文件", required = true)})
    Res<Boolean> upload(@PathVariable String apUsername, MultipartFile file) throws IOException;


    /**
     * 下载文件
     *
     * @param apUsername 用户名称
     * @return 返回用户名称
     */
    @Operation(summary = "下载文件", description = "下载文件")
    @Parameters({@Parameter(name = "apUsername", description = "用户名称", required = true)})
    Res<String> download(@PathVariable String apUsername, HttpServletResponse response) throws IOException;

    /**
     * 删除文件
     *
     * @param apUsername 用户名称
     * @return 返回是否删除成功
     */
    @Operation(summary = "删除文件", description = "删除文件")
    @Parameters({@Parameter(name = "apUsername", description = "用户名称", required = true)})
    Res<Boolean> delete(@PathVariable String apUsername) throws IOException;
}
