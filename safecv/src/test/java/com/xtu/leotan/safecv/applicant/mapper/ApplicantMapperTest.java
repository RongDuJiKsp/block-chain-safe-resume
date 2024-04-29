package com.xtu.leotan.safecv.applicant.mapper;

import com.baomidou.mybatisplus.test.autoconfigure.MybatisPlusTest;
import com.xtu.leotan.safecv.applicant.domain.Applicant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;


@MybatisPlusTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ApplicantMapperTest {


    @Autowired
    ApplicantMapper applicantMapper;

    @Test
    void getByUsername() {
        Applicant qwerty = applicantMapper.getByUsername("qwerty");
        System.out.println("qwerty = " + qwerty);
    }
}