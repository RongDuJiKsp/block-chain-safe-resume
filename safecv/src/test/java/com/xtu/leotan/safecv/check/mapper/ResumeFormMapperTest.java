package com.xtu.leotan.safecv.check.mapper;

import com.baomidou.mybatisplus.test.autoconfigure.MybatisPlusTest;
import com.xtu.leotan.safecv.check.domain.ResumeForm;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import java.util.List;


@MybatisPlusTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ResumeFormMapperTest {

    @Autowired
    private ResumeFormMapper resumeFormMapper;

    @Test
    void selectAll() {
        System.out.println(resumeFormMapper.selectList(null));
    }

    @Test
    void listUncheckResumeByCheckUsername(){
        List<ResumeForm> leotan = resumeFormMapper.listUncheckResumeByCheckUsername("leotan");
        System.out.println("leotan = " + leotan);
    }

}