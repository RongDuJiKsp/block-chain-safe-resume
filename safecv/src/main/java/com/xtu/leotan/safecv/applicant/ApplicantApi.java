package com.xtu.leotan.safecv.applicant;

import com.xtu.leotan.safecv.common.mvc.Res;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "Applicant", description = "求职者接口")
public interface ApplicantApi {
    @Operation(summary = "根据地址获取求职者信息")
    @Parameter(name = "address", description = "地址", required = true)
    Res<String> getByAddress(@PathVariable String address);
}
