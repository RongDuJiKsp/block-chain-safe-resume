package com.xtu.leotan.safecv.applicant;

import com.xtu.leotan.safecv.applicant.domain.Applicant;
import com.xtu.leotan.safecv.applicant.mapper.ApplicantMapper;
import com.xtu.leotan.safecv.common.mvc.Res;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("applicant")
@CrossOrigin
public class ApplicantController implements ApplicantApi {

    private final ApplicantMapper applicantMapper;

    public ApplicantController(ApplicantMapper applicantMapper) {
        this.applicantMapper = applicantMapper;
    }

    @Override
    @GetMapping("{address}")
    public Res<String> getByAddress(@PathVariable String address) {
        Applicant applicant = applicantMapper.getByAddress(address);
        if (applicant == null) {
            return Res.badRequest("用户不存在");
        }
        return Res.success(applicant.getUsername());
    }
}
