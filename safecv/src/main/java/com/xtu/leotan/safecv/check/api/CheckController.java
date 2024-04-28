package com.xtu.leotan.safecv.check.api;

import com.xtu.leotan.safecv.check.domain.CheckRecord;
import com.xtu.leotan.safecv.check.domain.ResumeForm;
import com.xtu.leotan.safecv.common.mvc.Res;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("check")
public class CheckController implements CheckApi{


    @Override
    @PostMapping("/{resumeUsername}")
    public Res<CheckRecord> check(@PathVariable String resumeUsername, String checkUsername, Boolean isApprove, String reason) {
        return null;
    }

    @Override
    @GetMapping("user")
    public Res<List<CheckRecord>> getByUser(String resumeUsername) {
        return null;
    }

    @Override
    @GetMapping("kk")
    public Res<List<CheckRecord>> getByKK(String checkUsername) {
        return null;
    }

    @Override
    @GetMapping("status")
    public Res<Boolean> isApprove(String resumeUsername) {
        return null;
    }

    @Override
    @GetMapping("uncheck")
    public Res<List<ResumeForm>> getUnCheckResume(String checkUsername) {
        return null;
    }
}
