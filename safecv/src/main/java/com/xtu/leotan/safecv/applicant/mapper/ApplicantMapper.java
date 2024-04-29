package com.xtu.leotan.safecv.applicant.mapper;

import org.apache.ibatis.annotations.Param;

import com.xtu.leotan.safecv.applicant.domain.Applicant;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * @author Leo
 * @description 针对表【Applicant】的数据库操作Mapper
 * @createDate 2024-04-28 18:35:11
 * @Entity generator.domain.Applicant
 */
@Mapper
public interface ApplicantMapper extends BaseMapper<Applicant> {

    @Select("select * from Applicant where username = #{username}")
    Applicant getByUsername(String username);

    @Select("select userName from Applicant where address = #{address} " +
            "union all " +
            "select userName from Recruiter where address = #{address} " +
            "union all " +
            "select userName from KeyKeeper where address=#{address}")
    String getUsernameByAddress(@Param("address") String address);

}




