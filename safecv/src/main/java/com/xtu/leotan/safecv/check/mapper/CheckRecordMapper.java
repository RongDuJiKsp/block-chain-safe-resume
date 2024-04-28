package com.xtu.leotan.safecv.check.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xtu.leotan.safecv.check.domain.CheckRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author Leo
 * @description 针对表【check_record(审核记录表)】的数据库操作Mapper
 * @createDate 2024-04-28 14:42:34
 * @Entity generator.domain.CheckRecord
 */
@Mapper
public interface CheckRecordMapper extends BaseMapper<CheckRecord> {

    @Select("select * from check_record where resume_username = #{resumeUsername}")
    List<CheckRecord> listByResumeUsername(String resumeUsername);


    @Select("select * from check_record where check_username = #{checkUsername}")
    List<CheckRecord> listByCheckUsername(String checkUsername);


    @Select("select * from check_record where resume_username = #{resumeUsername} and check_username = #{checkUsername}")
    CheckRecord selectByResumeAndCheckUsername(String resumeUsername, String checkUsername);

}
