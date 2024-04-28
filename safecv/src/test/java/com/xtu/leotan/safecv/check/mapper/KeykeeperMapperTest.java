package com.xtu.leotan.safecv.check.mapper;

import com.baomidou.mybatisplus.test.autoconfigure.MybatisPlusTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import static org.junit.jupiter.api.Assertions.*;


@MybatisPlusTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class KeykeeperMapperTest {
    @Autowired
    KeykeeperMapper mapper;

    @Test
    void selectList() {
        System.out.println(mapper.selectList(null));
    }

}