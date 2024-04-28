package com.xtu.leotan.safecv.check.service.impl;

import com.xtu.leotan.safecv.check.api.CheckController;
import com.xtu.leotan.safecv.check.domain.CheckRecord;
import com.xtu.leotan.safecv.check.domain.ResumeForm;
import com.xtu.leotan.safecv.check.mapper.CheckRecordMapper;
import com.xtu.leotan.safecv.check.mapper.KeykeeperMapper;
import com.xtu.leotan.safecv.check.mapper.ResumeFormMapper;
import com.xtu.leotan.safecv.check.service.CheckService;
import com.xtu.leotan.safecv.common.mvc.Res;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class CheckServiceImpl implements CheckService {


    private final CheckRecordMapper checkRecordMapper;

    public CheckServiceImpl(CheckRecordMapper checkRecordMapper) {
        this.checkRecordMapper = checkRecordMapper;
    }

    @Override
    public Res<CheckRecord> check(String resumeUsername, String checkUsername, Boolean isApprove, String reason) {
        return null;
    }

    @Override
    public Res<List<CheckRecord>> getByUser(String resumeUsername) {
        return null;
    }

    @Override
    public Res<List<CheckRecord>> getByKK(String checkUsername) {
        return null;
    }

    @Override
    public Res<Boolean> isApprove(String resumeUsername) {
        return null;
    }

    @Override
    public Res<List<ResumeForm>> getUnCheckResume(String checkUsername) {
        return null;
    }
}
