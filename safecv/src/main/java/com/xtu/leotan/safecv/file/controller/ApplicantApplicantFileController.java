package com.xtu.leotan.safecv.file.controller;

import com.xtu.leotan.safecv.applicant.domain.Applicant;
import com.xtu.leotan.safecv.applicant.mapper.ApplicantMapper;
import com.xtu.leotan.safecv.common.mvc.Res;
import com.xtu.leotan.safecv.file.FileConfiguration;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("files")
public class ApplicantApplicantFileController implements ApplicantFileApi {

    private boolean usernameExists(String apUsername) {
        // 查询数据库
        Applicant byUsername = applicantMapper.getByUsername(apUsername);

        return byUsername != null;
    }


    private final FileConfiguration fileConfiguration;
    private final ApplicantMapper applicantMapper;

    public ApplicantApplicantFileController(FileConfiguration fileConfiguration, ApplicantMapper applicantMapper) {
        this.fileConfiguration = fileConfiguration;
        this.applicantMapper = applicantMapper;
    }

    @Override
    @PutMapping("{apUsername}")
    public Res<Boolean> upload(@PathVariable String apUsername, MultipartFile file) throws IOException {
        if (!usernameExists(apUsername)) {
            return Res.badRequest("用户不存在");
        }
        Path applicant = getPath("applicant", apUsername);
        file.transferTo(applicant);
        return Res.success(true);
    }

    @Override
    @GetMapping("{apUsername}")
    public Res<String> download(@PathVariable String apUsername, HttpServletResponse response) throws IOException {
        if (!usernameExists(apUsername)) {
            return Res.badRequest("用户不存在");
        }
        Path applicant = getPath("applicant", apUsername);
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment;filename=" + applicant.getFileName().toString());

        Files.copy(applicant, response.getOutputStream());

        response.flushBuffer();

        return Res.success("下载已启动");
    }

    @Override
    @DeleteMapping("{apUsername}")
    public Res<Boolean> delete(@PathVariable String apUsername) throws IOException {
        if (!usernameExists(apUsername)) {
            return Res.badRequest("用户不存在");
        }

        Path applicant = getPath("applicant", apUsername);

        Files.delete(applicant);
        return null;
    }


    private Path getPath(String category, String filename) throws IOException {
        String basePath = fileConfiguration.getPath();
        final Path path = Path.of(basePath, category);
        if (!path.normalize().startsWith(Path.of(basePath).normalize())) {
            throw new IllegalArgumentException("非法路径 " + filename);
        }
        if (!Files.isDirectory(path))
            Files.createDirectories(path);
        return path.resolve(filename);
    }
}
