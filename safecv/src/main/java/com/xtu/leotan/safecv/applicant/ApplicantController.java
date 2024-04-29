package com.xtu.leotan.safecv.applicant;

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
        String applicant = applicantMapper.getUsernameByAddress(address);
        return Res.success(applicant);
    }
}
