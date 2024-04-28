package com.xtu.leotan.safecv.check.service.impl;

import com.xtu.leotan.safecv.check.domain.CheckRecord;
import com.xtu.leotan.safecv.check.domain.ResumeForm;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CheckServiceImplTest {

    @Autowired
    private CheckServiceImpl checkServiceImpl;

    @Test
    void check() {
        CheckRecord check = checkServiceImpl.check("123456789", "123456789", true, "123456789");
        System.out.println("check = " + check);
    }

    @Test
    void getByUser() {
        List<CheckRecord> byUser = checkServiceImpl.getByUser("123456789");
        System.out.println("byUser = " + byUser);
    }

    @Test
    void getByKK() {
        List<CheckRecord> byKK = checkServiceImpl.getByKK("123456789");
        System.out.println("byKK = " + byKK);
    }

    @Test
    void isApprove() {
        Boolean approve = checkServiceImpl.isApprove("123456789");
        System.out.println("approve = " + approve);
    }

    @Test
    void getUnCheck() {
        List<ResumeForm> unCheck = checkServiceImpl.getUnCheckResume("123456789");
        System.out.println("unCheck = " + unCheck);
    }

}