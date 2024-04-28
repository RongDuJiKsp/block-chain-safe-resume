package com.xtu.leotan.safecv.check.service;

import com.xtu.leotan.safecv.check.domain.CheckRecord;
import com.xtu.leotan.safecv.check.domain.ResumeForm;
import com.xtu.leotan.safecv.common.mvc.Res;

import java.util.List;

public interface CheckService {

    /**
     * 审核简历
     *
     * @param resumeUsername 简历用户名
     * @param checkUsername  审核用户名
     * @param isApprove      是否通过
     * @param reason         审核理由
     * @return 审核记录
     */
    CheckRecord check(String resumeUsername, String checkUsername, Boolean isApprove, String reason);


    /**
     * 通过用户名称获取该用户简历审核记录
     *
     * @param resumeUsername 简历用户名
     * @return 审核记录列表
     */
    List<CheckRecord> getByUser(String resumeUsername);


    /**
     * 通过审核用户名称获取该用户审核记录
     *
     * @param checkUsername 审核用户名
     * @return 审核记录列表
     */

    List<CheckRecord> getByKK(String checkUsername);


    /**
     * 判断简历是否审核通过
     *
     * @param resumeUsername 简历用户名
     * @return 是否通过
     */

    Boolean isApprove(String resumeUsername);


    /**
     * 获取未审核的简历
     *
     * @param checkUsername 审核用户名
     * @return 未审核的所有简历
     */
    List<ResumeForm> getUnCheckResume(String checkUsername);


}
