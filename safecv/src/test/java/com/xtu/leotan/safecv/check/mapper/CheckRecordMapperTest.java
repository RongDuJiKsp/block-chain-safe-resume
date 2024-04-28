package com.xtu.leotan.safecv.check.mapper;

import com.baomidou.mybatisplus.test.autoconfigure.MybatisPlusTest;
import com.xtu.leotan.safecv.check.domain.CheckRecord;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import java.util.List;

@MybatisPlusTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CheckRecordMapperTest {
    @Autowired
    private CheckRecordMapper mapper;

    @Test
    void testSelectCheckRecordList() {
        System.out.println(mapper.selectList(null));
    }


    @Test
    void listByResumeUsername() {
        List<CheckRecord> checkRecords = mapper.listByResumeUsername("123");
        System.out.println("checkRecords = " + checkRecords);;
    }

    @Test
    void listByCheckUsername() {
        List<CheckRecord> checkRecords = mapper.listByCheckUsername("123");
        System.out.println("checkRecords = " + checkRecords);
    }

    @Test
    void selectByResumeAndCheckUsername() {
        CheckRecord checkRecord = mapper.selectByResumeAndCheckUsername("123", "123");
        System.out.println("checkRecord = " + checkRecord);
    }

}