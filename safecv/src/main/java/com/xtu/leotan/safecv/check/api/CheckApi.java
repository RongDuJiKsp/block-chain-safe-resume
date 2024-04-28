package com.xtu.leotan.safecv.check.api;


import com.xtu.leotan.safecv.check.domain.CheckRecord;
import com.xtu.leotan.safecv.check.domain.ResumeForm;
import com.xtu.leotan.safecv.common.mvc.Res;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Tag(name = "CheckApi", description = "简历审核接口")
public interface CheckApi {

    /**
     * 审核简历
     *
     * @param resumeUsername 简历用户名
     * @param checkUsername  审核用户名
     * @param isApprove      是否通过
     * @param reason         审核理由
     * @return 审核记录
     */
    @Operation(summary = "审核简历")
    @Parameters(
            {@Parameter(name = "resumeUsername", description = "简历用户名", required = true),

                    @Parameter(name = "checkUsername", description = "审核用户名", required = true),

                    @Parameter(name = "isApprove", description = "是否通过", required = true),

                    @Parameter(name = "reason", description = "审核理由", required = true)}
    )
    Res<CheckRecord> check(@PathVariable String resumeUsername, String checkUsername, Boolean isApprove, String reason);


    /**
     * 通过用户名称获取该用户简历审核记录
     *
     * @param resumeUsername 简历用户名
     * @return 审核记录列表
     */
    @Operation(summary = "通过用户名称获取该用户简历审核记录")
    @Parameter(name = "resumeUsername", description = "简历用户名", required = true)
    Res<List<CheckRecord>> getByUser(String resumeUsername);


    /**
     * 通过审核用户名称获取该用户审核记录
     *
     * @param checkUsername 审核用户名
     * @return 审核记录列表
     */

    @Operation(summary = "通过审核用户名称获取该用户审核记录")
    @Parameter(name = "checkUsername", description = "审核用户名", required = true)
    Res<List<CheckRecord>> getByKK(String checkUsername);


    /**
     * 判断简历是否审核通过
     *
     * @param resumeUsername 简历用户名
     * @return 是否通过
     */

    @Operation(summary = "判断简历是否审核通过")
    @Parameter(name = "resumeUsername", description = "简历用户名", required = true)
    Res<Boolean> isApprove(String resumeUsername);


    /**
     * 获取未审核的简历
     *
     * @param checkUsername 审核用户名
     * @return 未审核的所有简历
     */

    @Operation(summary = "获取某个审核用户KK的未审核的简历")
    @Parameter(name = "checkUsername", description = "审核用户名", required = true)
    Res<List<ResumeForm>> getUnCheckResume(String checkUsername);


}
