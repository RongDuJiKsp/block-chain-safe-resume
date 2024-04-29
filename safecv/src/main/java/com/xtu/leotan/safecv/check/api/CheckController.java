package com.xtu.leotan.safecv.check.api;

import com.xtu.leotan.safecv.check.domain.CheckRecord;
import com.xtu.leotan.safecv.check.domain.ResumeForm;
import com.xtu.leotan.safecv.check.service.impl.CheckServiceImpl;
import com.xtu.leotan.safecv.common.mvc.Res;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("check")
@CrossOrigin
public class CheckController implements CheckApi {


    private final CheckServiceImpl checkServiceImpl;

    public CheckController(CheckServiceImpl checkServiceImpl) {
        this.checkServiceImpl = checkServiceImpl;
    }

    @Override
    @PostMapping("/{resumeUsername}")
    public Res<CheckRecord> check(@PathVariable String resumeUsername, String checkUsername, Boolean isApprove, String reason) {
        CheckRecord check = checkServiceImpl.check(resumeUsername, checkUsername, isApprove, reason);
        return Res.success(check);
    }

    @Override
    @GetMapping("user")
    public Res<List<CheckRecord>> getByUser(String resumeUsername) {
        List<CheckRecord> byUser = checkServiceImpl.getByUser(resumeUsername);
        return Res.success(byUser);
    }

    @Override
    @GetMapping("kk")
    public Res<List<CheckRecord>> getByKK(String checkUsername) {
        List<CheckRecord> byKK = checkServiceImpl.getByKK(checkUsername);
        return Res.success(byKK);
    }

    @Override
    @GetMapping("status")
    public Res<Boolean> isApprove(String resumeUsername) {
        Boolean approve = checkServiceImpl.isApprove(resumeUsername);
        return Res.success(approve);
    }

    @Override
    @GetMapping("uncheck")
    public Res<List<ResumeForm>> getUnCheckResume(String checkUsername) {
        List<ResumeForm> unCheckResume = checkServiceImpl.getUnCheckResume(checkUsername);
        return Res.success(unCheckResume);
    }
}
