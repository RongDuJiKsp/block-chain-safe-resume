package com.xtu.leotan.safecv.watermark;


import com.xtu.leotan.safecv.common.mvc.Res;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/watermark")
@Slf4j
public class WaterMarkController implements WaterMarkApi {

    private final FileWaterMarker fileWaterMarker;
    private final RestTemplate restTemplate;
    private final WeBaseConfiguration weBaseConfiguration;

    public WaterMarkController(FileWaterMarker fileWaterMarker, RestTemplate restTemplate, WeBaseConfiguration weBaseConfiguration) {
        this.fileWaterMarker = fileWaterMarker;
        this.restTemplate = restTemplate;
        this.weBaseConfiguration = weBaseConfiguration;
    }

    @Override
    @PutMapping("{watermark}")
    public void putWaterMark(@PathVariable String watermark, MultipartFile file, HttpServletResponse response) throws IOException {
        byte[] bytes = file.getBytes();
        byte[] markFile = fileWaterMarker.addWaterMark(watermark, bytes);
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment;filename=watermark_" + file.getOriginalFilename());
        response.getOutputStream().write(markFile);
    }

    @Override
    @PostMapping
    public Res<String> getWaterMark(@RequestParam("file") MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        String watermark = fileWaterMarker.getWatermark(bytes);
        log.info("watermark:{}", watermark);
        return Res.success(watermark);
    }


}
