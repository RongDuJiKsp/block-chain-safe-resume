package com.xtu.leotan.safecv.applicant.mapper;

import com.xtu.leotan.safecv.applicant.domain.Applicant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
class ApplicantMapperTest {


    @Autowired
    ApplicantMapper applicantMapper;

    @Test
    void getByUsername() {
        Applicant qwerty = applicantMapper.getByUsername("qwerty");
        System.out.println("qwerty = " + qwerty);
    }
}