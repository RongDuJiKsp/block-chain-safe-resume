package com.xtu.leotan.safecv.check.service.impl;

import com.xtu.leotan.safecv.check.domain.CheckRecord;
import com.xtu.leotan.safecv.check.domain.ResumeForm;
import com.xtu.leotan.safecv.check.mapper.CheckRecordMapper;
import com.xtu.leotan.safecv.check.mapper.ResumeFormMapper;
import com.xtu.leotan.safecv.check.service.CheckService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class CheckServiceImpl implements CheckService {

    public static final int LIMIT_TIME = 3;


    private final CheckRecordMapper checkRecordMapper;
    private final ResumeFormMapper resumeFormMapper;

    public CheckServiceImpl(CheckRecordMapper checkRecordMapper, ResumeFormMapper resumeFormMapper) {
        this.checkRecordMapper = checkRecordMapper;
        this.resumeFormMapper = resumeFormMapper;
    }

    @Override
    public CheckRecord check(String resumeUsername, String checkUsername, Boolean isApprove, String reason) {
        CheckRecord checkRecord = checkRecordMapper.selectByResumeAndCheckUsername(resumeUsername, checkUsername);
        if (checkRecord == null) { // 新建
            log.info("新建审核记录 - 审核人[{}] - 审核简历人[{}] - 审核结果[{}] - 审核原因[{}]", checkUsername, resumeUsername, isApprove, reason);
            checkRecord = new CheckRecord();
            checkRecord.setResumeUsername(resumeUsername);
            checkRecord.setCheckUsername(checkUsername);
            checkRecord.setIsApprove(isApprove);
            checkRecord.setReason(reason);
            checkRecordMapper.insert(checkRecord);
            return checkRecord;
        } else { // 更新
            log.info("更新审核记录 - 审核人[{}] - 审核简历人[{}] - 审核结果[{}] - 审核原因[{}]", checkUsername, resumeUsername, isApprove, reason);
            checkRecord.setIsApprove(isApprove);
            checkRecord.setReason(reason);
            checkRecordMapper.updateById(checkRecord);
            return checkRecord;
        }
    }

    @Override
    public List<CheckRecord> getByUser(String resumeUsername) {
        return checkRecordMapper.listByResumeUsername(resumeUsername);
    }

    @Override
    public List<CheckRecord> getByKK(String checkUsername) {
        return checkRecordMapper.listByCheckUsername(checkUsername);
    }

    @Override
    public Boolean isApprove(String resumeUsername) {
        List<CheckRecord> byUser = getByUser(resumeUsername);
        return byUser.size() >= LIMIT_TIME;
    }

    @Override
    public List<ResumeForm> getUnCheckResume(String checkUsername) {
        return resumeFormMapper.listUncheckResumeByCheckUsername(checkUsername);
    }
}
